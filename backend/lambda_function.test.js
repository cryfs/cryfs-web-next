"use strict";

jest.mock('./email', () => ({
  email_myself: jest.fn().mockResolvedValue(undefined),
}));

import { LambdaFunction } from './lambda_function';
import { email_myself } from './email';

describe('LambdaFunction', () => {
  const validToken = 'fd0kAn1zns';

  beforeEach(() => {
    email_myself.mockClear();
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
      };

      const result = await handler(event, {});

      expect(mockImpl).toHaveBeenCalledWith({ token: validToken, email: 'test@example.com' });
      expect(result.statusCode).toBe(200);
    });

    test('returns 400 for invalid token', async () => {
      const mockImpl = jest.fn();
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: 'wrong-token', email: 'test@example.com' }),
      };

      const result = await handler(event, {});

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
      };

      const result = await handler(event, {});

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
      };

      const result = await handler(event, {});

      expect(result.headers).toEqual({
        'Access-Control-Allow-Origin': 'https://www.cryfs.org',
        'Access-Control-Allow-Credentials': false,
        'Vary': 'Origin',
      });
    });

    test('includes CORS headers in error response', async () => {
      const mockImpl = jest.fn();
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: 'invalid' }),
      };

      const result = await handler(event, {});

      expect(result.headers).toEqual({
        'Access-Control-Allow-Origin': 'https://www.cryfs.org',
        'Access-Control-Allow-Credentials': false,
        'Vary': 'Origin',
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
      };

      const result = await handler(event, {});

      expect(result.headers).toEqual({
        'X-Custom-Header': 'custom-value',
        'Access-Control-Allow-Origin': 'https://www.cryfs.org',
        'Access-Control-Allow-Credentials': false,
        'Vary': 'Origin',
      });
    });
  });

  describe('error handling', () => {
    test('returns 500 when implementation throws', async () => {
      const mockImpl = jest.fn().mockRejectedValue(new Error('Something went wrong'));
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: validToken }),
      };

      const result = await handler(event, {});

      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body)).toEqual({ success: false });
    });

    test('sends error email when implementation throws', async () => {
      const mockImpl = jest.fn().mockRejectedValue(new Error('Something went wrong'));
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: JSON.stringify({ token: validToken }),
      };

      await handler(event, {});

      expect(email_myself).toHaveBeenCalledWith(
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
      };

      const result = await handler(event, {});

      expect(result.statusCode).toBe(500);
      expect(mockImpl).not.toHaveBeenCalled();
    });

    test('sends error email for invalid JSON body', async () => {
      const mockImpl = jest.fn();
      const handler = LambdaFunction(mockImpl);

      const event = {
        body: 'not valid json',
      };

      await handler(event, {});

      expect(email_myself).toHaveBeenCalled();
    });
  });
});
