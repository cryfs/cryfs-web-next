import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactSection from '../ContactSection'
import * as Analytics from '../../Analytics'

// Mock the Analytics module
jest.mock('../../Analytics', () => ({
  logAnalyticsEvent: jest.fn(() => Promise.resolve()),
}))

// Mock fetch
global.fetch = jest.fn()

describe('ContactSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch.mockClear()
  })

  it('renders contact form', () => {
    render(<ContactSection />)
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Your message to us/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Your email address/i)).toBeInTheDocument()
    expect(screen.getByText('Send')).toBeInTheDocument()
  })

  it('updates message when user types', async () => {
    const user = userEvent.setup()
    render(<ContactSection />)

    const messageInput = screen.getByPlaceholderText(/Your message to us/i)
    await user.type(messageInput, 'This is my message')

    expect(messageInput).toHaveValue('This is my message')
  })

  it('updates email when user types', async () => {
    const user = userEvent.setup()
    render(<ContactSection />)

    const emailInput = screen.getByPlaceholderText(/Your email address/i)
    await user.type(emailInput, 'test@example.com')

    expect(emailInput).toHaveValue('test@example.com')
  })

  it('shows error when message is empty', async () => {
    render(<ContactSection />)

    const sendButton = screen.getByText('Send')
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/Please enter a message to send./i)).toBeInTheDocument()
    })

    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('contact_form', 'click')
    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('contact_form', 'error')
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows success message on successful send', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    const user = userEvent.setup()
    render(<ContactSection />)

    const messageInput = screen.getByPlaceholderText(/Your message to us/i)
    await user.type(messageInput, 'This is my feedback')

    const emailInput = screen.getByPlaceholderText(/Your email address/i)
    await user.type(emailInput, 'test@example.com')

    const sendButton = screen.getByText('Send')
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/Thank you./i)).toBeInTheDocument()
    })

    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('contact_form', 'click')
    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('contact_form', 'success')
  })

  it('sends message without email if email is not provided', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    const user = userEvent.setup()
    render(<ContactSection />)

    const messageInput = screen.getByPlaceholderText(/Your message to us/i)
    await user.type(messageInput, 'Anonymous feedback')

    const sendButton = screen.getByText('Send')
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://backend.cryfs.org/contact/send',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: '',
            message: 'Anonymous feedback',
            token: 'fd0kAn1zns',
          }),
        })
      )
    })
  })

  it('shows error message when backend returns error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'server-error' }),
    })

    const user = userEvent.setup()
    render(<ContactSection />)

    const messageInput = screen.getByPlaceholderText(/Your message to us/i)
    await user.type(messageInput, 'Test message')

    const sendButton = screen.getByText('Send')
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/Sorry, there was an error sending your message./i)).toBeInTheDocument()
    })

    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('contact_form', 'error')
  })

  it('shows error message when fetch throws', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    const user = userEvent.setup()
    render(<ContactSection />)

    const messageInput = screen.getByPlaceholderText(/Your message to us/i)
    await user.type(messageInput, 'Test message')

    const sendButton = screen.getByText('Send')
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/Sorry, there was an error sending your message./i)).toBeInTheDocument()
    })
  })

  it('sends correct request to backend', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    const user = userEvent.setup()
    render(<ContactSection />)

    const messageInput = screen.getByPlaceholderText(/Your message to us/i)
    await user.type(messageInput, 'Great product!')

    const emailInput = screen.getByPlaceholderText(/Your email address/i)
    await user.type(emailInput, 'user@test.com')

    const sendButton = screen.getByText('Send')
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://backend.cryfs.org/contact/send',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'user@test.com',
            message: 'Great product!',
            token: 'fd0kAn1zns',
          }),
        })
      )
    })
  })

  it('clears previous notification when sending again', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    const user = userEvent.setup()
    render(<ContactSection />)

    const messageInput = screen.getByPlaceholderText(/Your message to us/i)
    await user.type(messageInput, 'First message')

    const sendButton = screen.getByText('Send')
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/Thank you./i)).toBeInTheDocument()
    })

    // Send again
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(Analytics.logAnalyticsEvent).toHaveBeenCalledTimes(4) // 2 clicks + 2 successes
    })
  })
})
