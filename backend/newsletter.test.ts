jest.mock('@mailchimp/mailchimp_marketing');
jest.mock('./email', () => ({
  email_myself: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('./secret', () =>
  jest.fn((key: string) => {
    const secrets: Record<string, string> = {
      MAILCHIMP_API_TOKEN: 'test-mc-token-us1',
      MAILCHIMP_LIST_ID: 'test-list-id',
    };
    return Promise.resolve(secrets[key]);
  })
);

import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { register } from './newsletter';
import { email_myself } from './email';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const MockMailchimp = require('@mailchimp/mailchimp_marketing').default;
const mockedEmailMyself = email_myself as jest.Mock;

describe('newsletter register', () => {
  const validToken = '6BK2tEU6Cv';

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockAddListMember.mockReset();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockGetListMember.mockReset();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockUpdateListMember.mockReset();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockSetConfig.mockReset();
  });

  test('registers new email successfully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockAddListMember.mockResolvedValue({ id: 'new-member' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'newuser@example.com',
      }),
    } as APIGatewayProxyEvent;

    const result = await register(event, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(MockMailchimp.__mockAddListMember).toHaveBeenCalledWith('test-list-id', {
      email_address: 'newuser@example.com',
      status: 'pending',
    });
    expect(mockedEmailMyself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user',
      expect.stringContaining('Registered newuser@example.com')
    );
  });

  test('returns success for already subscribed email (enumeration protection)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockAddListMember.mockRejectedValue({ title: 'Member Exists' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockGetListMember.mockResolvedValue({ status: 'subscribed' });

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockAddListMember.mockRejectedValue({ title: 'Member Exists' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockGetListMember.mockResolvedValue({ status: 'unsubscribed' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockUpdateListMember.mockResolvedValue({ status: 'pending' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'resubscribe@example.com',
      }),
    } as APIGatewayProxyEvent;

    const result = await register(event, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(MockMailchimp.__mockUpdateListMember).toHaveBeenCalled();
    expect(mockedEmailMyself).toHaveBeenCalledWith(
      'CryFS Newsletter Registration',
      'New interested user (resubscribe)',
      expect.stringContaining('Resubscribing')
    );
  });

  test('returns unsubscribed error for forgotten email', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockAddListMember.mockRejectedValue({ title: 'Forgotten Email Not Subscribed' });

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockAddListMember.mockRejectedValue({ title: 'Invalid Resource' });

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockAddListMember.mockRejectedValue({ title: 'Unknown Error', detail: 'Something went wrong' });

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockAddListMember.mockResolvedValue({ id: 'new-member' });

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(MockMailchimp.__mockAddListMember).not.toHaveBeenCalled();
  });

  test('uses MD5 hash for subscriber lookup', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockAddListMember.mockRejectedValue({ title: 'Member Exists' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MockMailchimp.__mockGetListMember.mockResolvedValue({ status: 'subscribed' });

    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'Test@Example.com',
      }),
    } as APIGatewayProxyEvent;

    await register(event, {} as Context);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(MockMailchimp.__mockGetListMember).toHaveBeenCalledWith(
      'test-list-id',
      '55502f40dc8b7c769880b10874abc9d0',
      { fields: ['status'] }
    );
  });
});
