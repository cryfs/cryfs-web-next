
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterSection from './NewsletterSection';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as typeof fetch;

// Mock the Analytics module
jest.mock('../Analytics', () => ({
  logAnalyticsEvent: jest.fn().mockResolvedValue(undefined),
}));

describe('NewsletterSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('rendering', () => {
    it('renders the heading', () => {
      render(<NewsletterSection />);
      expect(screen.getByText(/get notified when there are updates/i)).toBeInTheDocument();
    });

    it('renders email input field', () => {
      render(<NewsletterSection />);
      expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<NewsletterSection />);
      expect(screen.getByRole('button', { name: /get notified/i })).toBeInTheDocument();
    });

    it('email input has correct type', () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('email input is required', () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      expect(emailInput).toHaveAttribute('required');
    });
  });

  describe('email input behavior', () => {
    it('updates value when typing', async () => {
      const user = userEvent.setup();
      render(<NewsletterSection />);

      const emailInput = screen.getByPlaceholderText(/enter email/i);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('handles empty input', () => {
      render(<NewsletterSection />);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      expect(emailInput).toHaveValue('');
    });
  });

  describe('form submission - success', () => {
    it('shows success message on successful submission', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<NewsletterSection />);

      await user.type(screen.getByPlaceholderText(/enter email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      await waitFor(() => {
        expect(screen.getByText(/confirmation email/i)).toBeInTheDocument();
      });
    });

    it('calls fetch with correct parameters', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<NewsletterSection />);

      await user.type(screen.getByPlaceholderText(/enter email/i), 'user@test.com');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://backend.cryfs.org/newsletter/register',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('user@test.com'),
          })
        );
      });
    });
  });

  describe('form submission - errors', () => {
    it('shows invalid email error', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'invalid-email' }),
      });

      render(<NewsletterSection />);

      await user.type(screen.getByPlaceholderText(/enter email/i), 'invalid');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('shows unsubscribed error', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'unsubscribed' }),
      });

      render(<NewsletterSection />);

      await user.type(screen.getByPlaceholderText(/enter email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      await waitFor(() => {
        expect(screen.getByText(/unsubscribed before/i)).toBeInTheDocument();
      });
    });

    it('shows unknown error for unrecognized error response', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'some-unknown-error' }),
      });

      render(<NewsletterSection />);

      await user.type(screen.getByPlaceholderText(/enter email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      await waitFor(() => {
        expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
      });
    });

    it('shows unknown error on network failure', async () => {
      const user = userEvent.setup();
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<NewsletterSection />);

      await user.type(screen.getByPlaceholderText(/enter email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      await waitFor(() => {
        expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
      });
    });
  });

  describe('notification clearing', () => {
    it('shows new notification on subsequent submission', async () => {
      const user = userEvent.setup();

      // First submission fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'invalid-email' }),
      });

      render(<NewsletterSection />);

      await user.type(screen.getByPlaceholderText(/enter email/i), 'bad');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });

      // Second submission succeeds
      mockFetch.mockResolvedValueOnce({ ok: true });

      await user.clear(screen.getByPlaceholderText(/enter email/i));
      await user.type(screen.getByPlaceholderText(/enter email/i), 'good@example.com');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      // The success message should now be visible
      await waitFor(() => {
        expect(screen.getByText(/confirmation email/i)).toBeInTheDocument();
      });
    });
  });

  describe('analytics', () => {
    it('logs analytics event on click', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = require('../Analytics');
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<NewsletterSection />);

      await user.type(screen.getByPlaceholderText(/enter email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      await waitFor(() => {
        expect(logAnalyticsEvent).toHaveBeenCalledWith('interested_user_form', 'click');
      });
    });

    it('logs success analytics event on successful submission', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = require('../Analytics');
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<NewsletterSection />);

      await user.type(screen.getByPlaceholderText(/enter email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      await waitFor(() => {
        expect(logAnalyticsEvent).toHaveBeenCalledWith('interested_user_form', 'success');
      });
    });

    it('logs error analytics event on failed submission', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = require('../Analytics');
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'invalid-email' }),
      });

      render(<NewsletterSection />);

      await user.type(screen.getByPlaceholderText(/enter email/i), 'bad');
      await user.click(screen.getByRole('button', { name: /get notified/i }));

      await waitFor(() => {
        expect(logAnalyticsEvent).toHaveBeenCalledWith('interested_user_form', 'error');
      });
    });
  });
});
