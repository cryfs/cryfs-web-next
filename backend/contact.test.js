"use strict";

jest.mock('./email', () => ({
  email_myself: jest.fn().mockResolvedValue(undefined),
}));

import { send } from './contact';
import { email_myself } from './email';

describe('contact send', () => {
  const validToken = 'fd0kAn1zns';

  beforeEach(() => {
    email_myself.mockClear();
  });

  test('sends contact email with sender email in subject', async () => {
    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'visitor@example.com',
        message: 'Hello, I have a question.',
      }),
    };

    const result = await send(event, {});

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Contact Form',
      'CryFS Contact Form  (from visitor@example.com)',
      'Hello, I have a question.',
      'visitor@example.com'
    );
  });

  test('shows "(from unknown)" when email is empty string', async () => {
    const event = {
      body: JSON.stringify({
        token: validToken,
        email: '',
        message: 'Anonymous message',
      }),
    };

    const result = await send(event, {});

    expect(result.statusCode).toBe(200);
    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Contact Form',
      'CryFS Contact Form  (from unknown)',
      'Anonymous message',
      ''
    );
  });

  test('handles undefined email', async () => {
    const event = {
      body: JSON.stringify({
        token: validToken,
        message: 'Message without email',
      }),
    };

    const result = await send(event, {});

    expect(result.statusCode).toBe(200);
    // When email is undefined, it's passed as undefined to do_send
    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Contact Form',
      expect.stringContaining('CryFS Contact Form'),
      'Message without email',
      undefined
    );
  });

  test('returns 200 on success', async () => {
    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'test@test.com',
        message: 'Test message',
      }),
    };

    const result = await send(event, {});

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
  });

  test('includes CORS headers in response', async () => {
    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'test@test.com',
        message: 'Test message',
      }),
    };

    const result = await send(event, {});

    expect(result.headers).toEqual({
      'Access-Control-Allow-Origin': 'https://www.cryfs.org',
      'Access-Control-Allow-Credentials': false,
      'Vary': 'Origin',
    });
  });

  test('rejects invalid token', async () => {
    const event = {
      body: JSON.stringify({
        token: 'invalid-token',
        email: 'test@test.com',
        message: 'Test message',
      }),
    };

    const result = await send(event, {});

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: 'Wrong token',
    });
  });
});
