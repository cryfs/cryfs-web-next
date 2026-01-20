jest.mock('mailchimp-api-v3');
jest.mock('./email', () => ({
  email_myself: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('./secret', () =>
  jest.fn((key: string) => {
    const secrets: Record<string, string> = {
      MAILCHIMP_API_TOKEN: 'test-mc-token',
      MAILCHIMP_LIST_ID: 'test-list-id',
    };
    return Promise.resolve(secrets[key]);
  })
);

import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { register } from './newsletter';
import { email_myself } from './email';

interface MockMailchimpType {
  __mockPost: jest.Mock;
  __mockGet: jest.Mock;
  __mockPut: jest.Mock;
}

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
const MockMailchimp = require('mailchimp-api-v3').default as MockMailchimpType;
const mockedEmailMyself = email_myself as jest.Mock;

describe('newsletter register', () => {
  const validToken = '6BK2tEU6Cv';

  beforeEach(() => {
    jest.clearAllMocks();
    MockMailchimp.__mockPost.mockReset();
    MockMailchimp.__mockGet.mockReset();
    MockMailchimp.__mockPut.mockReset();
  });

  test('registers new email successfully', async () => {
    MockMailchimp.__mockPost.mockResolvedValue({ id: 'new-member' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'newuser@example.com',
      }),
    } as APIGatewayProxyEvent;

    const result = await register(event, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(MockMailchimp.__mockPost).toHaveBeenCalledWith({
      path: '/lists/test-list-id/members',
      body: {
        email_address: 'newuser@example.com',
        status: 'pending',
      },
    });
    expect(mockedEmailMyself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user',
      expect.stringContaining('Registered newuser@example.com')
    );
  });

  test('returns success for already subscribed email (enumeration protection)', async () => {
    MockMailchimp.__mockPost.mockRejectedValue({ title: 'Member Exists' });
    MockMailchimp.__mockGet.mockResolvedValue({ status: 'subscribed' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'existing@example.com',
      }),
    } as APIGatewayProxyEvent;

    const result = await register(event, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(mockedEmailMyself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (not adding - already exists)',
      expect.stringContaining('already exists')
    );
  });

  test('resubscribes previously unsubscribed email', async () => {
    MockMailchimp.__mockPost.mockRejectedValue({ title: 'Member Exists' });
    MockMailchimp.__mockGet.mockResolvedValue({ status: 'unsubscribed' });
    MockMailchimp.__mockPut.mockResolvedValue({ status: 'pending' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'resubscribe@example.com',
      }),
    } as APIGatewayProxyEvent;

    const result = await register(event, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(MockMailchimp.__mockPut).toHaveBeenCalled();
    expect(mockedEmailMyself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (resubscribe)',
      expect.stringContaining('Resubscribing')
    );
  });

  test('returns unsubscribed error for forgotten email', async () => {
    MockMailchimp.__mockPost.mockRejectedValue({ title: 'Forgotten Email Not Subscribed' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'forgotten@example.com',
      }),
    } as APIGatewayProxyEvent;

    const result = await register(event, {} as Context);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: 'unsubscribed',
    });
    expect(mockedEmailMyself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (not adding - previously unsubscribed)',
      expect.stringContaining('previously unsubscribed')
    );
  });

  test('returns invalid-email error for invalid email', async () => {
    MockMailchimp.__mockPost.mockRejectedValue({ title: 'Invalid Resource' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'not-an-email',
      }),
    } as APIGatewayProxyEvent;

    const result = await register(event, {} as Context);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: 'invalid-email',
    });
    expect(mockedEmailMyself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (not adding - invalid email)',
      expect.stringContaining('invalid email address')
    );
  });

  test('returns 500 for unknown Mailchimp error', async () => {
    MockMailchimp.__mockPost.mockRejectedValue({ title: 'Unknown Error', detail: 'Something went wrong' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'test@example.com',
      }),
    } as APIGatewayProxyEvent;

    const result = await register(event, {} as Context);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ success: false });
    expect(mockedEmailMyself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'Error registering user',
      expect.stringContaining('error')
    );
  });

  test('includes CORS headers in response', async () => {
    MockMailchimp.__mockPost.mockResolvedValue({ id: 'new-member' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'test@example.com',
      }),
    } as APIGatewayProxyEvent;

    const result = await register(event, {} as Context);

    expect(result.headers).toEqual({
      'Access-Control-Allow-Origin': 'https://www.cryfs.org',
      'Access-Control-Allow-Credentials': false,
      Vary: 'Origin',
    });
  });

  test('rejects invalid token', async () => {
    const event = {
      body: JSON.stringify({
        token: 'invalid-token',
        email: 'test@example.com',
      }),
    } as APIGatewayProxyEvent;

    const result = await register(event, {} as Context);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: 'Wrong token',
    });
    expect(MockMailchimp.__mockPost).not.toHaveBeenCalled();
  });

  test('uses MD5 hash for subscriber lookup', async () => {
    MockMailchimp.__mockPost.mockRejectedValue({ title: 'Member Exists' });
    MockMailchimp.__mockGet.mockResolvedValue({ status: 'subscribed' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'Test@Example.com',
      }),
    } as APIGatewayProxyEvent;

    await register(event, {} as Context);

    expect(MockMailchimp.__mockGet).toHaveBeenCalledWith({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      path: expect.stringContaining('55502f40dc8b7c769880b10874abc9d0'),
    });
  });
});
