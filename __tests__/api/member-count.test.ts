/**
 * @jest-environment node
 */
import { GET } from '../../app/api/member-count/route';

const mockGet = jest.fn();

jest.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: jest.fn(),
    },
    sheets: jest.fn(() => ({
      spreadsheets: {
        values: {
          get: mockGet,
        },
      },
    })),
  },
}));

describe('API Route - /api/member-count', () => {
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

  it('returns mock count with correct structure when env vars are missing', async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.limit).toBe(500);
    expect(typeof json.count).toBe('number');
    expect(typeof json.remaining).toBe('number');
    expect(json.remaining).toBe(json.limit - json.count);
  });

  it('handles Google Sheets path with valid data', async () => {
    process.env.GOOGLE_CLIENT_EMAIL = 'test@example.com';
    process.env.GOOGLE_PRIVATE_KEY = 'private-key';
    process.env.GOOGLE_SHEET_ID = 'sheet-id';

    mockGet.mockResolvedValueOnce({
      data: {
        values: [
          ['Name', 'WhatsApp Number', 'Email', 'Date', 'Time'],
          ['John', '+1111111111', 'john@test.com', 'Date', 'Time'],
          ['Duplicate', '+1111111111', 'dup@test.com', 'Date', 'Time'], // Duplicate phone
          ['Jane', '+2222222222', 'john@test.com', 'Date', 'Time'], // Duplicate email
          ['Alice', '+3333333333', 'alice@test.com', 'Date', 'Time'],
        ]
      }
    });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.count).toBe(2); // John, Alice
  });

  it('handles Google Sheets path with empty data', async () => {
    process.env.GOOGLE_CLIENT_EMAIL = 'test@example.com';
    process.env.GOOGLE_PRIVATE_KEY = 'private-key';
    process.env.GOOGLE_SHEET_ID = 'sheet-id';

    mockGet.mockResolvedValueOnce({
      data: {
        values: [
          ['Name', 'WhatsApp Number', 'Email', 'Date', 'Time']
        ]
      }
    });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.count).toBe(0);
  });

  it('handles Google Sheets path and returns 500 on auth error', async () => {
    process.env.GOOGLE_CLIENT_EMAIL = 'test@example.com';
    process.env.GOOGLE_PRIVATE_KEY = 'private-key';
    process.env.GOOGLE_SHEET_ID = 'sheet-id';

    mockGet.mockRejectedValueOnce(new Error('Auth failed'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const response = await GET();

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.error).toBe('Failed to fetch member count');

    consoleSpy.mockRestore();
  });
});
