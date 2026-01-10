"use strict";

jest.mock('mailchimp-api-v3');
jest.mock('./email', () => ({
  email_myself: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('./secret', () => jest.fn((key) => {
  const secrets = {
    MAILCHIMP_API_TOKEN: 'test-mc-token',
    MAILCHIMP_LIST_ID: 'test-list-id',
  };
  return Promise.resolve(secrets[key]);
}));

import Mailchimp from 'mailchimp-api-v3';
import { register } from './newsletter';
import { email_myself } from './email';

describe('newsletter register', () => {
  const validToken = 'fd0kAn1zns';

  beforeEach(() => {
    jest.clearAllMocks();
    Mailchimp.__mockPost.mockReset();
    Mailchimp.__mockGet.mockReset();
    Mailchimp.__mockPut.mockReset();
  });

  test('registers new email successfully', async () => {
    Mailchimp.__mockPost.mockResolvedValue({ id: 'new-member' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'newuser@example.com',
      }),
    };

    const result = await register(event, {});

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(Mailchimp.__mockPost).toHaveBeenCalledWith({
      path: '/lists/test-list-id/members',
      body: {
        email_address: 'newuser@example.com',
        status: 'pending',
      },
    });
    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user',
      expect.stringContaining('Registered newuser@example.com')
    );
  });

  test('returns success for already subscribed email (enumeration protection)', async () => {
    Mailchimp.__mockPost.mockRejectedValue({ title: 'Member Exists' });
    Mailchimp.__mockGet.mockResolvedValue({ status: 'subscribed' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'existing@example.com',
      }),
    };

    const result = await register(event, {});

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (not adding - already exists)',
      expect.stringContaining('already exists')
    );
  });

  test('resubscribes previously unsubscribed email', async () => {
    Mailchimp.__mockPost.mockRejectedValue({ title: 'Member Exists' });
    Mailchimp.__mockGet.mockResolvedValue({ status: 'unsubscribed' });
    Mailchimp.__mockPut.mockResolvedValue({ status: 'pending' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'resubscribe@example.com',
      }),
    };

    const result = await register(event, {});

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(Mailchimp.__mockPut).toHaveBeenCalled();
    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (resubscribe)',
      expect.stringContaining('Resubscribing')
    );
  });

  test('returns unsubscribed error for forgotten email', async () => {
    Mailchimp.__mockPost.mockRejectedValue({ title: 'Forgotten Email Not Subscribed' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'forgotten@example.com',
      }),
    };

    const result = await register(event, {});

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: 'unsubscribed',
    });
    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (not adding - previously unsubscribed)',
      expect.stringContaining('previously unsubscribed')
    );
  });

  test('returns invalid-email error for invalid email', async () => {
    Mailchimp.__mockPost.mockRejectedValue({ title: 'Invalid Resource' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'not-an-email',
      }),
    };

    const result = await register(event, {});

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: 'invalid-email',
    });
    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (not adding - invalid email)',
      expect.stringContaining('invalid email address')
    );
  });

  test('returns 500 for unknown Mailchimp error', async () => {
    Mailchimp.__mockPost.mockRejectedValue({ title: 'Unknown Error', detail: 'Something went wrong' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'test@example.com',
      }),
    };

    const result = await register(event, {});

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ success: false });
    expect(email_myself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'Error registering user',
      expect.stringContaining('error')
    );
  });

  test('includes CORS headers in response', async () => {
    Mailchimp.__mockPost.mockResolvedValue({ id: 'new-member' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'test@example.com',
      }),
    };

    const result = await register(event, {});

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
        email: 'test@example.com',
      }),
    };

    const result = await register(event, {});

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: 'Wrong token',
    });
    expect(Mailchimp.__mockPost).not.toHaveBeenCalled();
  });

  test('uses MD5 hash for subscriber lookup', async () => {
    Mailchimp.__mockPost.mockRejectedValue({ title: 'Member Exists' });
    Mailchimp.__mockGet.mockResolvedValue({ status: 'subscribed' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'Test@Example.com',
      }),
    };

    await register(event, {});

    // MD5 of 'test@example.com' (lowercase) is 55502f40dc8b7c769880b10874abc9d0
    expect(Mailchimp.__mockGet).toHaveBeenCalledWith({
      path: expect.stringContaining('55502f40dc8b7c769880b10874abc9d0'),
    });
  });
});
