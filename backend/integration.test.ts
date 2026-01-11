/**
 * Integration tests that verify the full Lambda handler flow
 * with mocked external services.
 */

jest.mock('@aws-sdk/client-ssm');
jest.mock('@aws-sdk/client-ses');
jest.mock('mailchimp-api-v3');

import type { APIGatewayProxyEvent, Context } from 'aws-lambda';

interface MockSSMClient {
  __mockSend: jest.Mock;
  SSMClient: new () => { send: jest.Mock };
  GetParametersCommand: new (input: Record<string, unknown>) => { input: Record<string, unknown> };
}

interface MockSESClient {
  __mockSend: jest.Mock;
  SESClient: new () => { send: jest.Mock };
  SendEmailCommand: new (input: Record<string, unknown>) => { input: Record<string, unknown> };
}

interface MockMailchimpType {
  __mockPost: jest.Mock;
  __mockGet: jest.Mock;
  __mockPut: jest.Mock;
}

describe('Integration Tests', () => {
  const validToken = 'fd0kAn1zns';
  let ssmClient: MockSSMClient;
  let sesClient: MockSESClient;
  let Mailchimp: MockMailchimpType;

  beforeEach(() => {
    jest.resetModules();

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ssmClient = require('@aws-sdk/client-ssm');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    sesClient = require('@aws-sdk/client-ses');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Mailchimp = require('mailchimp-api-v3').default;

    ssmClient.__mockSend.mockReset();
    sesClient.__mockSend.mockReset();
    Mailchimp.__mockPost.mockReset();
    Mailchimp.__mockGet.mockReset();
    Mailchimp.__mockPut.mockReset();

    ssmClient.__mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token' },
        { Name: 'MAILCHIMP_LIST_ID', Value: 'list-id' },
      ],
    });

    sesClient.__mockSend.mockResolvedValue({});
  });

  describe('Newsletter Registration Flow', () => {
    test('complete successful registration flow', async () => {
      Mailchimp.__mockPost.mockResolvedValue({ id: 'new-member' });

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { register } = require('./newsletter');

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'newuser@example.com',
        }),
      } as APIGatewayProxyEvent;

      const result = await register(event, {} as Context);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ success: true });

      expect(result.headers['Access-Control-Allow-Origin']).toBe('https://www.cryfs.org');

      expect(Mailchimp.__mockPost).toHaveBeenCalledWith({
        path: '/lists/list-id/members',
        body: {
          email_address: 'newuser@example.com',
          status: 'pending',
        },
      });

      expect(sesClient.__mockSend).toHaveBeenCalled();
    });

    test('invalid token blocks Mailchimp call', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { register } = require('./newsletter');

      const event = {
        body: JSON.stringify({
          token: 'invalid',
          email: 'test@example.com',
        }),
      } as APIGatewayProxyEvent;

      const result = await register(event, {} as Context);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Wrong token');
      expect(Mailchimp.__mockPost).not.toHaveBeenCalled();
    });
  });

  describe('Contact Form Flow', () => {
    test('complete contact form submission', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { send } = require('./contact');

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'visitor@example.com',
          message: 'Hello, I need help!',
        }),
      } as APIGatewayProxyEvent;

      const result = await send(event, {} as Context);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ success: true });

      expect(result.headers['Access-Control-Allow-Origin']).toBe('https://www.cryfs.org');

      expect(sesClient.__mockSend).toHaveBeenCalledTimes(1);
      const command = sesClient.__mockSend.mock.calls[0][0];
      expect(command).toBeInstanceOf(sesClient.SendEmailCommand);
      expect(command.input.Destination.ToAddresses).toEqual(['messmer@cryfs.org']);
      expect(command.input.Message.Subject.Data).toContain('visitor@example.com');
      expect(command.input.Message.Body.Text.Data).toBe('Hello, I need help!');
      expect(command.input.ReplyToAddresses).toEqual(['visitor@example.com']);
    });
  });

  describe('Error Handling Flow', () => {
    test('Mailchimp error triggers error notification', async () => {
      Mailchimp.__mockPost.mockRejectedValue({ title: 'API Error', detail: 'Service unavailable' });

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { register } = require('./newsletter');

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'test@example.com',
        }),
      } as APIGatewayProxyEvent;

      const result = await register(event, {} as Context);

      expect(result.statusCode).toBe(500);

      expect(sesClient.__mockSend).toHaveBeenCalled();
      const command = sesClient.__mockSend.mock.calls[0][0];
      expect(command.input.Message.Subject.Data).toContain('Error');
    });
  });

  describe('Secrets Loading', () => {
    test('secrets are loaded from SSM on first request', async () => {
      Mailchimp.__mockPost.mockResolvedValue({ id: 'member' });

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { register } = require('./newsletter');

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'test@example.com',
        }),
      } as APIGatewayProxyEvent;

      await register(event, {} as Context);

      expect(ssmClient.__mockSend).toHaveBeenCalledTimes(1);
      const command = ssmClient.__mockSend.mock.calls[0][0];
      expect(command).toBeInstanceOf(ssmClient.GetParametersCommand);
      expect(command.input).toEqual({
        Names: ['MAILCHIMP_API_TOKEN', 'MAILCHIMP_LIST_ID'],
        WithDecryption: true,
      });
    });
  });
});
