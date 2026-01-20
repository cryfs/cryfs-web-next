jest.mock('./email', () => ({
  email_myself: jest.fn().mockResolvedValue(undefined),
}));

import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { send } from './contact';
import { email_myself } from './email';

const mockedEmailMyself = email_myself as jest.Mock;

describe('contact send', () => {
  const validToken = '6BK2tEU6Cv';

  beforeEach(() => {
    mockedEmailMyself.mockClear();
  });

  test('sends contact email with sender email in subject', async () => {
    const event = {
      body: JSON.stringify({
        token: validToken,
        email: 'visitor@example.com',
        message: 'Hello, I have a question.',
      }),
    } as APIGatewayProxyEvent;

    const result = await send(event, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(mockedEmailMyself).toHaveBeenCalledWith(
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
    } as APIGatewayProxyEvent;

    const result = await send(event, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(mockedEmailMyself).toHaveBeenCalledWith(
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
    } as APIGatewayProxyEvent;

    const result = await send(event, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(mockedEmailMyself).toHaveBeenCalledWith(
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
    } as APIGatewayProxyEvent;

    const result = await send(event, {} as Context);

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
    } as APIGatewayProxyEvent;

    const result = await send(event, {} as Context);

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
        email: 'test@test.com',
        message: 'Test message',
      }),
    } as APIGatewayProxyEvent;

    const result = await send(event, {} as Context);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      error: 'Wrong token',
    });
  });
});
