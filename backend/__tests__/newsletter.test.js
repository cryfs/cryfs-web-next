// Mock dependencies
const mockMailchimpGet = jest.fn()
const mockMailchimpPost = jest.fn()
const mockMailchimpPut = jest.fn()

jest.mock('mailchimp-api-v3', () => {
  return jest.fn(() => ({
    get: mockMailchimpGet,
    post: mockMailchimpPost,
    put: mockMailchimpPut,
  }))
})

jest.mock('../email', () => ({
  email_myself: jest.fn(() => Promise.resolve()),
}))

jest.mock('../secret', () =>
  jest.fn((key) => {
    if (key === 'MAILCHIMP_LIST_ID') return Promise.resolve('test-list-id')
    if (key === 'MAILCHIMP_API_TOKEN') return Promise.resolve('test-api-token')
    return Promise.resolve('test-value')
  })
)

import { register } from '../newsletter'
import { email_myself } from '../email'

describe('newsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createEvent = (email) => ({
    body: JSON.stringify({ token: 'fd0kAn1zns', email }),
  })

  it('successfully registers a new email', async () => {
    mockMailchimpPost.mockResolvedValueOnce({})

    const event = createEvent('newuser@example.com')
    const response = await register(event, {})

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(true)

    expect(mockMailchimpPost).toHaveBeenCalledWith({
      path: '/lists/test-list-id/members',
      body: {
        email_address: 'newuser@example.com',
        status: 'pending',
      },
    })
  })

  it('sends notification email on successful registration', async () => {
    mockMailchimpPost.mockResolvedValueOnce({})

    const event = createEvent('newuser@example.com')
    await register(event, {})

    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user',
      expect.stringContaining('Registered newuser@example.com')
    )
  })

  it('handles already registered email', async () => {
    const error = { title: 'Member Exists' }
    mockMailchimpPost.mockRejectedValueOnce(error)
    mockMailchimpGet.mockResolvedValueOnce({ status: 'subscribed' })

    const event = createEvent('existing@example.com')
    const response = await register(event, {})

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(true)

    expect(mockMailchimpGet).toHaveBeenCalledWith({
      path: expect.stringContaining('existing@example.com'),
    })
  })

  it('resubscribes previously unsubscribed email', async () => {
    const error = { title: 'Member Exists' }
    mockMailchimpPost.mockRejectedValueOnce(error)
    mockMailchimpGet.mockResolvedValueOnce({ status: 'unsubscribed' })
    mockMailchimpPut.mockResolvedValueOnce({})

    const event = createEvent('unsubscribed@example.com')
    const response = await register(event, {})

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(true)

    expect(mockMailchimpPut).toHaveBeenCalledWith({
      path: expect.stringContaining('/lists/test-list-id/members/'),
      body: {
        email_address: 'unsubscribed@example.com',
        status: 'pending',
      },
    })
  })

  it('returns error for invalid email', async () => {
    const error = { title: 'Invalid Resource' }
    mockMailchimpPost.mockRejectedValueOnce(error)

    const event = createEvent('invalid-email')
    const response = await register(event, {})

    expect(response.statusCode).toBe(400)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(false)
    expect(body.error).toBe('invalid-email')
  })

  it('returns error for forgotten email', async () => {
    const error = { title: 'Forgotten Email Not Subscribed' }
    mockMailchimpPost.mockRejectedValueOnce(error)

    const event = createEvent('forgotten@example.com')
    const response = await register(event, {})

    expect(response.statusCode).toBe(400)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(false)
    expect(body.error).toBe('unsubscribed')
  })

  it('returns generic error for unknown Mailchimp errors', async () => {
    const error = { title: 'Unknown Error Type' }
    mockMailchimpPost.mockRejectedValueOnce(error)

    const event = createEvent('test@example.com')
    const response = await register(event, {})

    expect(response.statusCode).toBe(500)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(false)
  })

  it('sends notification email for error cases', async () => {
    const error = { title: 'Invalid Resource' }
    mockMailchimpPost.mockRejectedValueOnce(error)

    const event = createEvent('invalid@email')
    await register(event, {})

    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (not adding - invalid email)',
      expect.stringContaining('invalid@email')
    )
  })

  it('logs successful registration to console', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    mockMailchimpPost.mockResolvedValueOnce({})

    const event = createEvent('newuser@example.com')
    await register(event, {})

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Registered newuser@example.com')
    )
    consoleSpy.mockRestore()
  })

  it('logs error cases to console', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    const error = { title: 'Invalid Resource' }
    mockMailchimpPost.mockRejectedValueOnce(error)

    const event = createEvent('invalid')
    await register(event, {})

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('invalid email address')
    )
    consoleSpy.mockRestore()
  })

  it('uses pending status for double opt-in', async () => {
    mockMailchimpPost.mockResolvedValueOnce({})

    const event = createEvent('test@example.com')
    await register(event, {})

    expect(mockMailchimpPost).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          status: 'pending',
        }),
      })
    )
  })

  it('handles case-insensitive email hashing', async () => {
    const error = { title: 'Member Exists' }
    mockMailchimpPost.mockRejectedValueOnce(error)
    mockMailchimpGet.mockResolvedValueOnce({ status: 'subscribed' })

    const event = createEvent('Test@Example.COM')
    await register(event, {})

    // MD5 hash of 'test@example.com' (lowercase)
    const expectedHash = '55502f40dc8b7c769880b10874abc9d0'
    expect(mockMailchimpGet).toHaveBeenCalledWith({
      path: expect.stringContaining(expectedHash),
    })
  })

  it('sends resubscribe notification email', async () => {
    const error = { title: 'Member Exists' }
    mockMailchimpPost.mockRejectedValueOnce(error)
    mockMailchimpGet.mockResolvedValueOnce({ status: 'unsubscribed' })
    mockMailchimpPut.mockResolvedValueOnce({})

    const event = createEvent('unsub@example.com')
    await register(event, {})

    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (resubscribe)',
      expect.stringContaining('was unsubscribed before')
    )
  })

  it('handles CORS and wraps with LambdaFunction', async () => {
    mockMailchimpPost.mockResolvedValueOnce({})

    const event = createEvent('test@example.com')
    const response = await register(event, {})

    // LambdaFunction adds CORS headers
    expect(response.headers).toBeDefined()
    expect(response.headers['Access-Control-Allow-Origin']).toBe('https://www.cryfs.org')
  })
})
