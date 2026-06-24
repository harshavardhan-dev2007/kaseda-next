import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../app/page';

// Mock the global fetch API to simulate a member count of 100
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ count: 100, limit: 500, remaining: 400 }),
  })
) as jest.Mock;

describe('Home Page Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main headlines', () => {
    render(<Home />);
    
    // Check if the logo/brand is rendered (use getAllByText because Wear appears multiple times)
    expect(screen.getAllByText(/Wear/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/KASEDA/i).length).toBeGreaterThan(0);
    
    // Check for the CTA button
    expect(screen.getByText(/Join The Founding Community/i)).toBeInTheDocument();
  });

  it('validates form inputs correctly', async () => {
    render(<Home />);
    
    // Fill form with invalid data
    const nameInput = screen.getByLabelText(/Full Name/i);
    const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
    const form = submitBtn.closest('form');

    // Test 1: Invalid Name
    fireEvent.change(nameInput, { target: { value: 'A' } }); // too short
    fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/Full Name must be at least 2 characters/i)).toBeInTheDocument();
    });

    // Test 2: Invalid Phone
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(phoneInput, { target: { value: '123' } }); // invalid phone
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid WhatsApp Number/i)).toBeInTheDocument();
    });

    // Test 3: Invalid Email
    fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } }); // invalid email
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid Email Address/i)).toBeInTheDocument();
    });
  });
});
