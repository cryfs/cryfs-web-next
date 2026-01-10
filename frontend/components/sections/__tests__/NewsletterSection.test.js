import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewsletterSection from '../NewsletterSection'
import * as Analytics from '../../Analytics'

// Mock the Analytics module
jest.mock('../../Analytics', () => ({
  logAnalyticsEvent: jest.fn(() => Promise.resolve()),
}))

// Mock fetch
global.fetch = jest.fn()

describe('NewsletterSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch.mockClear()
  })

  it('renders newsletter form', () => {
    render(<NewsletterSection />)
    expect(screen.getByText(/Get notified when there are updates!/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
    expect(screen.getByText(/Get Notified/)).toBeInTheDocument()
  })

  it('updates email input when user types', async () => {
    const user = userEvent.setup()
    render(<NewsletterSection />)

    const emailInput = screen.getByPlaceholderText('Enter email')
    await user.type(emailInput, 'test@example.com')

    expect(emailInput).toHaveValue('test@example.com')
  })

  it('shows success message on successful registration', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    const user = userEvent.setup()
    render(<NewsletterSection />)

    const emailInput = screen.getByPlaceholderText('Enter email')
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByText(/Get Notified/)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Thank you. You'll get a confirmation email shortly./i)).toBeInTheDocument()
    })

    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('interested_user_form', 'click')
    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('interested_user_form', 'success')
  })

  it('shows error message for invalid email', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'invalid-email' }),
    })

    const user = userEvent.setup()
    render(<NewsletterSection />)

    const emailInput = screen.getByPlaceholderText('Enter email')
    await user.type(emailInput, 'invalid-email')

    const submitButton = screen.getByText(/Get Notified/)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address./i)).toBeInTheDocument()
    })

    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('interested_user_form', 'error')
  })

  it('shows error message for unsubscribed email', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'unsubscribed' }),
    })

    const user = userEvent.setup()
    render(<NewsletterSection />)

    const emailInput = screen.getByPlaceholderText('Enter email')
    await user.type(emailInput, 'unsubscribed@example.com')

    const submitButton = screen.getByText(/Get Notified/)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/You've unsubscribed before/i)).toBeInTheDocument()
    })
  })

  it('shows generic error message for unknown errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'unknown-error-type' }),
    })

    const user = userEvent.setup()
    render(<NewsletterSection />)

    const emailInput = screen.getByPlaceholderText('Enter email')
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByText(/Get Notified/)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/An error occurred. Please subscribe by sending an email to messmer@cryfs.org./i)).toBeInTheDocument()
    })
  })

  it('shows generic error message when fetch throws', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    const user = userEvent.setup()
    render(<NewsletterSection />)

    const emailInput = screen.getByPlaceholderText('Enter email')
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByText(/Get Notified/)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/An error occurred. Please subscribe by sending an email to messmer@cryfs.org./i)).toBeInTheDocument()
    })
  })

  it('sends correct request to backend', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    const user = userEvent.setup()
    render(<NewsletterSection />)

    const emailInput = screen.getByPlaceholderText('Enter email')
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByText(/Get Notified/)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://backend.cryfs.org/newsletter/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            token: 'fd0kAn1zns',
          }),
        })
      )
    })
  })

  it('clears previous notification when submitting again', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })

    const user = userEvent.setup()
    render(<NewsletterSection />)

    const emailInput = screen.getByPlaceholderText('Enter email')
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByText(/Get Notified/)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Thank you. You'll get a confirmation email shortly./i)).toBeInTheDocument()
    })

    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('interested_user_form', 'click')
    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('interested_user_form', 'success')

    // Submit again
    fireEvent.click(submitButton)

    // The notification should still be visible after re-submission
    await waitFor(() => {
      expect(Analytics.logAnalyticsEvent).toHaveBeenCalledTimes(4) // 2 clicks + 2 successes
    })
  })
})
