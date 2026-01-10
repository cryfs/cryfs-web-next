// Mock email module
jest.mock('../email', () => ({
  email_myself: jest.fn(() => Promise.resolve()),
}))

import { LambdaFunction } from '../lambda_function'
import { email_myself } from '../email'

describe('LambdaFunction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createEvent = (body) => ({
    body: JSON.stringify(body),
  })

  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://www.cryfs.org',
    'Access-Control-Allow-Credentials': false,
    'Vary': 'Origin',
  }

  it('calls implementation with parsed body', async () => {
    const implementation = jest.fn(() =>
      Promise.resolve({
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      })
    )

    const handler = LambdaFunction(implementation)
    const event = createEvent({ token: 'fd0kAn1zns', data: 'test' })

    await handler(event, {})

    expect(implementation).toHaveBeenCalledWith({ token: 'fd0kAn1zns', data: 'test' })
  })

  it('adds CORS headers to response', async () => {
    const implementation = jest.fn(() =>
      Promise.resolve({
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      })
    )

    const handler = LambdaFunction(implementation)
    const event = createEvent({ token: 'fd0kAn1zns' })

    const response = await handler(event, {})

    expect(response.headers).toEqual(corsHeaders)
  })

  it('preserves existing headers in response', async () => {
    const implementation = jest.fn(() =>
      Promise.resolve({
        statusCode: 200,
        headers: { 'Custom-Header': 'value' },
        body: JSON.stringify({ success: true }),
      })
    )

    const handler = LambdaFunction(implementation)
    const event = createEvent({ token: 'fd0kAn1zns' })

    const response = await handler(event, {})

    expect(response.headers).toEqual({
      'Custom-Header': 'value',
      ...corsHeaders,
    })
  })

  it('rejects requests with wrong token', async () => {
    const implementation = jest.fn()
    const handler = LambdaFunction(implementation)
    const event = createEvent({ token: 'wrong-token' })

    const response = await handler(event, {})

    expect(response).toEqual({
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Wrong token',
      }),
    })
    expect(implementation).not.toHaveBeenCalled()
  })

  it('rejects requests without token', async () => {
    const implementation = jest.fn()
    const handler = LambdaFunction(implementation)
    const event = createEvent({ data: 'test' })

    const response = await handler(event, {})

    expect(response.statusCode).toBe(400)
    expect(implementation).not.toHaveBeenCalled()
  })

  it('handles implementation errors gracefully', async () => {
    const implementation = jest.fn(() => {
      throw new Error('Implementation error')
    })

    const handler = LambdaFunction(implementation)
    const event = createEvent({ token: 'fd0kAn1zns' })

    const response = await handler(event, {})

    expect(response).toEqual({
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false }),
    })
  })

  it('sends error notification email on implementation error', async () => {
    const error = new Error('Test error')
    const implementation = jest.fn(() => {
      throw error
    })

    const handler = LambdaFunction(implementation)
    const event = createEvent({ token: 'fd0kAn1zns', test: 'data' })

    await handler(event, {})

    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Backend',
      'Error',
      expect.stringContaining('Error calling function')
    )
    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Backend',
      'Error',
      expect.stringContaining('Test error')
    )
  })

  it('handles JSON parse errors', async () => {
    const implementation = jest.fn()
    const handler = LambdaFunction(implementation)
    const event = { body: 'invalid json' }

    const response = await handler(event, {})

    expect(response.statusCode).toBe(500)
    expect(implementation).not.toHaveBeenCalled()
  })

  it('logs errors to console', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    const implementation = jest.fn(() => {
      throw new Error('Test error')
    })

    const handler = LambdaFunction(implementation)
    const event = createEvent({ token: 'fd0kAn1zns' })

    await handler(event, {})

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error calling function'))
    consoleSpy.mockRestore()
  })

  it('returns implementation response unchanged except for headers', async () => {
    const implementation = jest.fn(() =>
      Promise.resolve({
        statusCode: 201,
        body: JSON.stringify({ custom: 'data', id: 123 }),
      })
    )

    const handler = LambdaFunction(implementation)
    const event = createEvent({ token: 'fd0kAn1zns' })

    const response = await handler(event, {})

    expect(response.statusCode).toBe(201)
    expect(response.body).toBe(JSON.stringify({ custom: 'data', id: 123 }))
  })

  it('handles async implementation functions', async () => {
    const implementation = jest.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      }
    })

    const handler = LambdaFunction(implementation)
    const event = createEvent({ token: 'fd0kAn1zns' })

    const response = await handler(event, {})

    expect(response.statusCode).toBe(200)
    expect(implementation).toHaveBeenCalled()
  })

  it('accepts correct token fd0kAn1zns', async () => {
    const implementation = jest.fn(() =>
      Promise.resolve({
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      })
    )

    const handler = LambdaFunction(implementation)
    const event = createEvent({ token: 'fd0kAn1zns' })

    const response = await handler(event, {})

    expect(response.statusCode).toBe(200)
    expect(implementation).toHaveBeenCalled()
  })
})
