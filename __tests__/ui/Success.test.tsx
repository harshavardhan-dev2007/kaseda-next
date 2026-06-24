import { render, screen, waitFor, act } from '@testing-library/react';
import SuccessPage from '../../app/success/page';

describe('Success Page Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and fetches member count', async () => {
    // Mock successful fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: 120, limit: 500 }),
      })
    ) as jest.Mock;

    await act(async () => {
      render(<SuccessPage />);
    });

    // Check header
    expect(screen.getByAltText('KASEDA Logo')).toBeInTheDocument();
    
    // Check main text
    expect(screen.getByText(/Registration/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirmed/i)).toBeInTheDocument();
    
    // Wait for member count to appear
    await waitFor(() => {
      expect(screen.getByText(/MEMBER #120/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText('120')).toBeInTheDocument(); // The big number
    expect(screen.getByText(/380 SPOTS REMAINING/i)).toBeInTheDocument(); // 500 - 120
    
    // Check benefits
    expect(screen.getByText(/Secret Launch Coupon/i)).toBeInTheDocument();
  });

  it('handles fetch failure gracefully', async () => {
    // Mock failed fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as jest.Mock;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(<SuccessPage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/MEMBER #\.\.\./i)).toBeInTheDocument();
    });

    expect(screen.getByText('--')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
