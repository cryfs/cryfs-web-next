jest.mock('./email', () => ({
  email_myself: jest.fn().mockResolvedValue(undefined),
}));

import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { LambdaFunction } from './lambda_function';
import { email_myself } from './email';

const mockedEmailMyself = email_myself as jest.Mock;

describe('LambdaFunction', () => {
  const validToken = 'fd0kAn1zns';

  beforeEach(() => {
    mockedEmailMyself.mockClear();
  });

  describe('token validation', () => {
    test('calls implementation with valid token', async () => {
      const mockImpl = jest.fn().mockResolvedValue({
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      });
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: validToken, email: 'test@example.com' }),
      } as APIGatewayProxyEvent;

      const result = await handler(event, {} as Context);

      expect(mockImpl).toHaveBeenCalledWith({ token: validToken, email: 'test@example.com' });
      expect(result.statusCode).toBe(200);
    });

    test('returns 400 for invalid token', async () => {
      const mockImpl = jest.fn();
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: 'wrong-token', email: 'test@example.com' }),
      } as APIGatewayProxyEvent;

      const result = await handler(event, {} as Context);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: 'Wrong token',
      });
      expect(mockImpl).not.toHaveBeenCalled();
    });

    test('returns 400 for missing token', async () => {
      const mockImpl = jest.fn();
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ email: 'test@example.com' }),
      } as APIGatewayProxyEvent;

      const result = await handler(event, {} as Context);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: 'Wrong token',
      });
      expect(mockImpl).not.toHaveBeenCalled();
    });
  });

  describe('CORS headers', () => {
    test('includes CORS headers in successful response', async () => {
      const mockImpl = jest.fn().mockResolvedValue({
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      });
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: validToken }),
      } as APIGatewayProxyEvent;

      const result = await handler(event, {} as Context);

      expect(result.headers).toEqual({
        'Access-Control-Allow-Origin': 'https://www.cryfs.org',
        'Access-Control-Allow-Credentials': false,
        Vary: 'Origin',
      });
    });

    test('includes CORS headers in error response', async () => {
      const mockImpl = jest.fn();
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: 'invalid' }),
      } as APIGatewayProxyEvent;

      const result = await handler(event, {} as Context);

      expect(result.headers).toEqual({
        'Access-Control-Allow-Origin': 'https://www.cryfs.org',
        'Access-Control-Allow-Credentials': false,
        Vary: 'Origin',
      });
    });

    test('merges implementation headers with CORS headers', async () => {
      const mockImpl = jest.fn().mockResolvedValue({
        statusCode: 200,
        headers: { 'X-Custom-Header': 'custom-value' },
        body: JSON.stringify({ success: true }),
      });
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: validToken }),
      } as APIGatewayProxyEvent;

      const result = await handler(event, {} as Context);

      expect(result.headers).toEqual({
        'X-Custom-Header': 'custom-value',
        'Access-Control-Allow-Origin': 'https://www.cryfs.org',
        'Access-Control-Allow-Credentials': false,
        Vary: 'Origin',
      });
    });
  });

  describe('error handling', () => {
    test('returns 500 when implementation throws', async () => {
      const mockImpl = jest.fn().mockRejectedValue(new Error('Something went wrong'));
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: validToken }),
      } as APIGatewayProxyEvent;

      const result = await handler(event, {} as Context);

      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body)).toEqual({ success: false });
    });

    test('sends error email when implementation throws', async () => {
      const mockImpl = jest.fn().mockRejectedValue(new Error('Something went wrong'));
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: validToken }),
      } as APIGatewayProxyEvent;

      await handler(event, {} as Context);

      expect(mockedEmailMyself).toHaveBeenCalledWith(
        'CryFS Backend',
        'Error',
        expect.stringContaining('Something went wrong')
      );
    });

    test('returns 500 for invalid JSON body', async () => {
      const mockImpl = jest.fn();
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: 'not valid json',
      } as APIGatewayProxyEvent;

      const result = await handler(event, {} as Context);

      expect(result.statusCode).toBe(500);
      expect(mockImpl).not.toHaveBeenCalled();
    });

    test('sends error email for invalid JSON body', async () => {
      const mockImpl = jest.fn();
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: 'not valid json',
      } as APIGatewayProxyEvent;

      await handler(event, {} as Context);

      expect(mockedEmailMyself).toHaveBeenCalled();
    });
  });
});
