
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactSection from './ContactSection';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as typeof fetch;

// Mock the Analytics module
jest.mock('../Analytics', () => ({
  logAnalyticsEvent: jest.fn().mockResolvedValue(undefined),
}));

describe('ContactSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('rendering', () => {
    it('renders the heading', () => {
      render(<ContactSection />);
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('renders message textarea', () => {
      render(<ContactSection />);
      expect(screen.getByPlaceholderText(/your message to us/i)).toBeInTheDocument();
    });

    it('renders email input field', () => {
      render(<ContactSection />);
      expect(screen.getByPlaceholderText(/your email address/i)).toBeInTheDocument();
    });

    it('renders send button', () => {
      render(<ContactSection />);
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('email input indicates it is optional', () => {
      render(<ContactSection />);
      const emailInput = screen.getByPlaceholderText(/your email address/i);
      expect(emailInput.getAttribute('placeholder')).toContain('optional');
    });

    it('message textarea is required', () => {
      render(<ContactSection />);
      const messageTextarea = screen.getByPlaceholderText(/your message to us/i);
      expect(messageTextarea).toHaveAttribute('required');
    });
  });

  describe('input behavior', () => {
    it('updates message value when typing', async () => {
      const user = userEvent.setup();
      render(<ContactSection />);

      const messageTextarea = screen.getByPlaceholderText(/your message to us/i);
      await user.type(messageTextarea, 'Hello, this is my message');

      expect(messageTextarea).toHaveValue('Hello, this is my message');
    });

    it('updates email value when typing', async () => {
      const user = userEvent.setup();
      render(<ContactSection />);

      const emailInput = screen.getByPlaceholderText(/your email address/i);
      await user.type(emailInput, 'user@example.com');

      expect(emailInput).toHaveValue('user@example.com');
    });
  });

  describe('form submission - validation', () => {
    it('shows error when submitting empty message', async () => {
      const user = userEvent.setup();
      render(<ContactSection />);

      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/please enter a message/i)).toBeInTheDocument();
      });
    });

    it('does not call fetch when message is empty', async () => {
      const user = userEvent.setup();
      render(<ContactSection />);

      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/please enter a message/i)).toBeInTheDocument();
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('form submission - success', () => {
    it('shows success message on successful submission', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<ContactSection />);

      await user.type(screen.getByPlaceholderText(/your message to us/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('Thank you.')).toBeInTheDocument();
      });
    });

    it('calls fetch with correct parameters', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<ContactSection />);

      await user.type(screen.getByPlaceholderText(/your message to us/i), 'My feedback');
      await user.type(screen.getByPlaceholderText(/your email address/i), 'test@test.com');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://backend.cryfs.org/contact/send',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('My feedback'),
          })
        );
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.email).toBe('test@test.com');
      expect(callBody.message).toBe('My feedback');
    });

    it('allows submission without email (optional)', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<ContactSection />);

      await user.type(screen.getByPlaceholderText(/your message to us/i), 'Anonymous message');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('Thank you.')).toBeInTheDocument();
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.email).toBe('');
      expect(callBody.message).toBe('Anonymous message');
    });
  });

  describe('form submission - errors', () => {
    it('shows error message on failed submission', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: false });

      render(<ContactSection />);

      await user.type(screen.getByPlaceholderText(/your message to us/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/sorry, there was an error/i)).toBeInTheDocument();
      });
    });

    it('shows error message on network failure', async () => {
      const user = userEvent.setup();
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<ContactSection />);

      await user.type(screen.getByPlaceholderText(/your message to us/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/sorry, there was an error/i)).toBeInTheDocument();
      });
    });
  });

  describe('notification clearing', () => {
    it('clears previous notification on new submission', async () => {
      const user = userEvent.setup();

      // First submission fails
      mockFetch.mockResolvedValueOnce({ ok: false });

      render(<ContactSection />);

      await user.type(screen.getByPlaceholderText(/your message to us/i), 'First message');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/sorry, there was an error/i)).toBeInTheDocument();
      });

      // Second submission succeeds
      mockFetch.mockResolvedValueOnce({ ok: true });

      await user.clear(screen.getByPlaceholderText(/your message to us/i));
      await user.type(screen.getByPlaceholderText(/your message to us/i), 'Second message');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('Thank you.')).toBeInTheDocument();
      });
    });
  });

  describe('analytics', () => {
    it('logs analytics event on click', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = require('../Analytics');
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<ContactSection />);

      await user.type(screen.getByPlaceholderText(/your message to us/i), 'Test');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(logAnalyticsEvent).toHaveBeenCalledWith('contact_form', 'click');
      });
    });

    it('logs success analytics event on successful submission', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = require('../Analytics');
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<ContactSection />);

      await user.type(screen.getByPlaceholderText(/your message to us/i), 'Test');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(logAnalyticsEvent).toHaveBeenCalledWith('contact_form', 'success');
      });
    });

    it('logs error analytics event on empty message', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = require('../Analytics');

      render(<ContactSection />);

      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(logAnalyticsEvent).toHaveBeenCalledWith('contact_form', 'error');
      });
    });

    it('logs error analytics event on failed submission', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = require('../Analytics');
      mockFetch.mockResolvedValueOnce({ ok: false });

      render(<ContactSection />);

      await user.type(screen.getByPlaceholderText(/your message to us/i), 'Test');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(logAnalyticsEvent).toHaveBeenCalledWith('contact_form', 'error');
      });
    });
  });
});
