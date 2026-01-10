// Mock dependencies
jest.mock('../email', () => ({
  email_myself: jest.fn(() => Promise.resolve()),
}))

import { send } from '../contact'
import { email_myself } from '../email'

describe('contact', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createEvent = (email, message) => ({
    body: JSON.stringify({ token: 'fd0kAn1zns', email, message }),
  })

  it('sends contact email with user email and message', async () => {
    const event = createEvent('user@example.com', 'This is my feedback')

    const response = await send(event, {})

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(true)

    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Contact Form',
      'CryFS Contact Form  (from user@example.com)',
      'This is my feedback',
      'user@example.com'
    )
  })

  it('sends contact email without user email', async () => {
    const event = createEvent('', 'Anonymous feedback')

    await send(event, {})

    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Contact Form',
      'CryFS Contact Form  (from unknown)',
      'Anonymous feedback',
      ''
    )
  })

  it('returns success response', async () => {
    const event = createEvent('test@example.com', 'Message')

    const response = await send(event, {})

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: expect.objectContaining({
        'Access-Control-Allow-Origin': 'https://www.cryfs.org',
      }),
    })
  })

  it('logs message to console', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    const event = createEvent('user@example.com', 'Test message')

    await send(event, {})

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Sent contact email from user@example.com')
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Test message')
    )
    consoleSpy.mockRestore()
  })

  it('includes reply_to when email is provided', async () => {
    const event = createEvent('reply@example.com', 'Message')

    await send(event, {})

    expect(email_myself).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String),
      'reply@example.com'
    )
  })

  it('includes empty reply_to when email is not provided', async () => {
    const event = createEvent('', 'Message')

    await send(event, {})

    expect(email_myself).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String),
      ''
    )
  })

  it('handles different message lengths', async () => {
    const shortMessage = 'Hi'
    const longMessage = 'a'.repeat(5000)

    await send(createEvent('user@example.com', shortMessage), {})
    await send(createEvent('user@example.com', longMessage), {})

    expect(email_myself).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
      expect.any(String),
      shortMessage,
      expect.any(String)
    )

    expect(email_myself).toHaveBeenNthCalledWith(
      2,
      expect.any(String),
      expect.any(String),
      longMessage,
      expect.any(String)
    )
  })

  it('handles special characters in message', async () => {
    const specialMessage = 'Special chars: \n\t"\'<>&€'
    const event = createEvent('user@example.com', specialMessage)

    await send(event, {})

    expect(email_myself).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      specialMessage,
      expect.any(String)
    )
  })

  it('formats subject correctly with email', async () => {
    const event = createEvent('test@example.com', 'Message')

    await send(event, {})

    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Contact Form',
      'CryFS Contact Form  (from test@example.com)',
      expect.any(String),
      expect.any(String)
    )
  })

  it('formats subject correctly without email', async () => {
    const event = createEvent('', 'Message')

    await send(event, {})

    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Contact Form',
      'CryFS Contact Form  (from unknown)',
      expect.any(String),
      expect.any(String)
    )
  })

  it('handles CORS through LambdaFunction wrapper', async () => {
    const event = createEvent('test@example.com', 'Message')

    const response = await send(event, {})

    expect(response.headers).toEqual(
      expect.objectContaining({
        'Access-Control-Allow-Origin': 'https://www.cryfs.org',
        'Access-Control-Allow-Credentials': false,
        'Vary': 'Origin',
      })
    )
  })

  it('validates token through LambdaFunction wrapper', async () => {
    const event = {
      body: JSON.stringify({ token: 'wrong-token', email: 'test@example.com', message: 'Message' }),
    }

    const response = await send(event, {})

    expect(response.statusCode).toBe(400)
    expect(email_myself).not.toHaveBeenCalled()
  })

  it('handles email sending errors', async () => {
    email_myself.mockRejectedValueOnce(new Error('SendGrid error'))

    const event = createEvent('test@example.com', 'Message')
    const response = await send(event, {})

    // LambdaFunction wrapper catches the error
    expect(response.statusCode).toBe(500)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(false)
  })
})
