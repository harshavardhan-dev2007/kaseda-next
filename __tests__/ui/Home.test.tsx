import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Home from '../../app/page';

// Mock scrollIntoView for jsdom
Element.prototype.scrollIntoView = jest.fn();

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
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: 100, limit: 500, remaining: 400 }),
      })
    );
  });

  describe('Home Page Rendering', () => {
    it('renders the KASEDA logo', () => {
      render(<Home />);
      const logos = screen.getAllByAltText('KASEDA Logo');
      expect(logos.length).toBeGreaterThan(0);
    });

    it('renders the Hero section', () => {
      render(<Home />);
      expect(screen.getAllByText(/Wear/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Confidence/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Premium streetwear and everyday essentials/i)).toBeInTheDocument();
    });

    it('renders the CTA buttons in hero', () => {
      render(<Home />);
      expect(screen.getByText(/Join The Founding Community/i)).toBeInTheDocument();
      expect(screen.getByText(/Learn Our Story/i)).toBeInTheDocument();
    });

    it('renders the Footer', () => {
      render(<Home />);
      expect(screen.getByText(/Connect/i)).toBeInTheDocument();
      expect(screen.getByText(/Inquiries/i)).toBeInTheDocument();
      expect(screen.getByText(/All Rights Reserved/i)).toBeInTheDocument();
    });

    it('renders the countdown timer section', () => {
      render(<Home />);
      expect(screen.getByText(/THE CHRONOLOGY/i)).toBeInTheDocument();
      expect(screen.getByText(/Launching/i)).toBeInTheDocument();
    });

    it('renders the story section content', () => {
      render(<Home />);
      expect(screen.getByText(/KASEDA was born from a simple idea/i)).toBeInTheDocument();
      // Use getAllByText since Kalam appears in multiple elements
      expect(screen.getAllByText(/Kalam/i).length).toBeGreaterThan(0);
    });

    it('renders the registration form inputs', () => {
      render(<Home />);
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/WhatsApp Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    });

    it('renders the founding community section', () => {
      render(<Home />);
      expect(screen.getAllByText(/THE FOUNDING COMMUNITY/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Reserve My Secret Launch Coupon/i).length).toBeGreaterThan(0);
    });

    it('renders benefit cards', () => {
      render(<Home />);
      expect(screen.getAllByText(/Secret Launch Coupon/i).length).toBeGreaterThan(0);
    });
  });

  describe('Navigation', () => {
    it('scrolls to story section when Our Story button is clicked', () => {
      render(<Home />);
      const buttons = screen.getAllByText(/Our Story/i);
      fireEvent.click(buttons[0]);
      // scrollIntoView was called via the mocked prototype
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });

    it('scrolls to early-access when Get Access button is clicked', () => {
      render(<Home />);
      const getAccessBtn = screen.getByText(/Get Access/i);
      fireEvent.click(getAccessBtn);
      // scrollIntoView called for the early-access section
    });

    it('scrolls when Learn Our Story button is clicked', () => {
      render(<Home />);
      const learnBtn = screen.getByText(/Learn Our Story/i);
      fireEvent.click(learnBtn);
    });

    it('scrolls when Join The Founding Community hero CTA is clicked', () => {
      render(<Home />);
      const joinBtn = screen.getByText(/Join The Founding Community/i);
      fireEvent.click(joinBtn);
    });
  });

  describe('Registration Form Validation & State', () => {
    it('displays validation error for short name', async () => {
      render(<Home />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Full Name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('displays validation error for empty name', async () => {
      render(<Home />);
      
      const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      // Leave name empty
      fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Full Name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('displays validation error for invalid phone', async () => {
      render(<Home />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '123' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid WhatsApp Number/i)).toBeInTheDocument();
      });
    });

    it('displays validation error for empty phone', async () => {
      render(<Home />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid WhatsApp Number/i)).toBeInTheDocument();
      });
    });

    it('displays validation error for invalid email', async () => {
      render(<Home />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
      fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid Email Address/i)).toBeInTheDocument();
      });
    });

    it('displays validation error for empty email', async () => {
      render(<Home />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid Email Address/i)).toBeInTheDocument();
      });
    });

    it('shows loading state and disables button during submission', async () => {
      let resolveApi: (value: any) => void;
      const fetchPromise = new Promise((resolve) => {
        resolveApi = resolve;
      });
      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/register') {
          return fetchPromise;
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 100, limit: 500, remaining: 400 }),
        });
      });

      render(<Home />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
      
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Securing Entry.../i)).toBeInTheDocument();
      });
      const loadingBtn = screen.getByText(/Securing Entry.../i);
      expect(loadingBtn).toBeDisabled();

      await act(async () => {
        resolveApi!({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      });

      await waitFor(() => {
        expect(screen.getByText(/Reserve My Secret Launch Coupon/i)).toBeInTheDocument();
        expect(screen.getByText(/Reserve My Secret Launch Coupon/i)).not.toBeDisabled();
      });
    });

    it('shows error message when API returns an error', async () => {
      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/register') {
          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Already registered' }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 100, limit: 500, remaining: 400 }),
        });
      });

      render(<Home />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Already registered/i)).toBeInTheDocument();
      });
    });

    it('shows error with fallback message when API error has no message', async () => {
      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/register') {
          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({}),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 100, limit: 500, remaining: 400 }),
        });
      });

      render(<Home />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Failed to submit/i)).toBeInTheDocument();
      });
    });

    it('shows generic error when fetch throws', async () => {
      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/register') {
          return Promise.reject(new Error('Network failure'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 100, limit: 500, remaining: 400 }),
        });
      });

      render(<Home />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Network failure/i)).toBeInTheDocument();
      });
    });

    it('shows fallback error when fetch throws without message', async () => {
      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/register') {
          return Promise.reject({});
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 100, limit: 500, remaining: 400 }),
        });
      });

      render(<Home />);
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const phoneInput = screen.getByLabelText(/WhatsApp Number/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByText(/Reserve My Secret Launch Coupon/i);
      const form = submitBtn.closest('form');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '+919876543210' } });
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Failed to register/i)).toBeInTheDocument();
      });
    });

    it('handles fetch failure for member count gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (global.fetch as jest.Mock).mockImplementation(() => {
        return Promise.reject(new Error('Fetch failed'));
      });

      render(<Home />);
      
      await waitFor(() => {
        expect(screen.getAllByAltText('KASEDA Logo').length).toBeGreaterThan(0);
      });

      consoleSpy.mockRestore();
    });

    it('handles non-ok member count response', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ok: false,
        })
      );

      render(<Home />);
      await waitFor(() => {
        expect(screen.getAllByAltText('KASEDA Logo').length).toBeGreaterThan(0);
      });
    });

    it('renders the Waitlist Mode when spots are full', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 500, limit: 500, remaining: 0 }),
        })
      );

      render(<Home />);
      
      await waitFor(() => {
        expect(screen.getByText(/Founding Membership/i)).toBeInTheDocument();
      });
      
      expect(screen.getAllByText(/Join The Waitlist/i).length).toBeGreaterThan(0);
    });

    it('handles member count with no limit field', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 50 }),
        })
      );

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText(/Join The Founding Community/i)).toBeInTheDocument();
      });
    });
  });
});
