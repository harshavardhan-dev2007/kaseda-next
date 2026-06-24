/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '../../app/api/register/route';

const mockGet = jest.fn();
const mockAppend = jest.fn();

jest.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: jest.fn(),
    },
    sheets: jest.fn(() => ({
      spreadsheets: {
        values: {
          get: mockGet,
          append: mockAppend,
        },
      },
    })),
  },
}));

describe('API Route - /api/register', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.GOOGLE_CLIENT_EMAIL = '';
    process.env.GOOGLE_PRIVATE_KEY = '';
    process.env.GOOGLE_SHEET_ID = '';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const createMockRequest = (body: any) => {
    return new NextRequest('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  // ─── Validation Tests ───────────────────────────────────────────

  it('returns 400 when fullName is missing', async () => {
    const req = createMockRequest({ whatsappNumber: '+919876543210', email: 'test@test.com' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('Full Name');
  });

  it('returns 400 when fullName is too short', async () => {
    const req = createMockRequest({ fullName: 'A', whatsappNumber: '+919876543210', email: 'test@test.com' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('Full Name');
  });

  it('returns 400 when whatsappNumber is missing', async () => {
    const req = createMockRequest({ fullName: 'John Doe', email: 'test@test.com' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('WhatsApp');
  });

  it('returns 400 when whatsappNumber is invalid (too short)', async () => {
    const req = createMockRequest({ fullName: 'John Doe', whatsappNumber: '123', email: 'test@test.com' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('WhatsApp');
  });

  it('returns 400 when email is missing', async () => {
    const req = createMockRequest({ fullName: 'John Doe', whatsappNumber: '+919876543210' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('Email');
  });

  it('returns 400 when email is invalid', async () => {
    const req = createMockRequest({ fullName: 'John Doe', whatsappNumber: '+919876543210', email: 'not-email' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('Email');
  });

  // ─── Mock Mode Tests ────────────────────────────────────────────

  it('registers successfully in mock mode with unique data', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    const uniquePhone = `+1${Date.now()}`;
    const req = createMockRequest({
      fullName: 'John Doe',
      whatsappNumber: uniquePhone,
      email: uniqueEmail,
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.message).toBe('Mock registration saved successfully.');
  });

  it('returns 409 when registering a duplicate in mock mode', async () => {
    const email = `dup${Date.now()}@example.com`;
    const phone = `+1${Date.now()}`;

    // First registration
    const req1 = createMockRequest({
      fullName: 'John Doe',
      whatsappNumber: phone,
      email: email,
    });
    await POST(req1);

    // Duplicate registration
    const req2 = createMockRequest({
      fullName: 'John Doe',
      whatsappNumber: phone,
      email: email,
    });
    const response = await POST(req2);

    expect(response.status).toBe(409);
    const json = await response.json();
    expect(json.error).toContain('already');
  });

  // ─── Google Sheets Path Tests ───────────────────────────────────

  it('handles Google Sheets path successfully', async () => {
    process.env.GOOGLE_CLIENT_EMAIL = 'test@example.com';
    process.env.GOOGLE_PRIVATE_KEY = 'private-key';
    process.env.GOOGLE_SHEET_ID = 'sheet-id';

    mockGet.mockResolvedValueOnce({
      data: {
        values: [
          ['Name', 'WhatsApp Number', 'Email', 'Date', 'Time'],
          ['Existing User', '+9999999999', 'existing@example.com', 'Date', 'Time']
        ]
      }
    });

    mockAppend.mockResolvedValueOnce({});

    const req = createMockRequest({
      fullName: 'Prod User',
      whatsappNumber: '+1111111111',
      email: 'prod@example.com',
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.message).toBe('Successfully registered in Google Sheets.');
  });

  it('handles Google Sheets path and detects duplicate', async () => {
    process.env.GOOGLE_CLIENT_EMAIL = 'test@example.com';
    process.env.GOOGLE_PRIVATE_KEY = 'private-key';
    process.env.GOOGLE_SHEET_ID = 'sheet-id';

    mockGet.mockResolvedValueOnce({
      data: {
        values: [
          ['Name', 'WhatsApp Number', 'Email', 'Date', 'Time'],
          ['Prod User', '+1111111111', 'prod@example.com', 'Date', 'Time']
        ]
      }
    });

    const req = createMockRequest({
      fullName: 'Prod User',
      whatsappNumber: '+1111111111',
      email: 'prod@example.com',
    });

    const response = await POST(req);
    
    expect(response.status).toBe(409);
  });

  it('handles Google Sheets path and returns 500 on auth error', async () => {
    process.env.GOOGLE_CLIENT_EMAIL = 'test@example.com';
    process.env.GOOGLE_PRIVATE_KEY = 'private-key';
    process.env.GOOGLE_SHEET_ID = 'sheet-id';

    mockGet.mockRejectedValueOnce(new Error('Auth failed'));
    mockAppend.mockRejectedValueOnce(new Error('Auth failed'));

    const req = createMockRequest({
      fullName: 'Prod User',
      whatsappNumber: '+2222222222',
      email: 'prod2@example.com',
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const response = await POST(req);
    
    expect(response.status).toBe(500);
    consoleSpy.mockRestore();
  });
});
