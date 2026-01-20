/**
 * Integration tests that verify the full Lambda handler flow
 * with mocked external services.
 */

jest.mock('@aws-sdk/client-ssm');
jest.mock('@aws-sdk/client-ses');
jest.mock('mailchimp-api-v3');

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

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

interface NewsletterModule {
  register: (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;
}

interface ContactModule {
  send: (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;
}

describe('Integration Tests', () => {
  const validToken = '6BK2tEU6Cv';
  let ssmClient: MockSSMClient;
  let sesClient: MockSESClient;
  let Mailchimp: MockMailchimpType;

  beforeEach(async () => {
    jest.resetModules();

    ssmClient = await import('@aws-sdk/client-ssm') as unknown as MockSSMClient;
    sesClient = await import('@aws-sdk/client-ses') as unknown as MockSESClient;
    const mailchimpModule = await import('mailchimp-api-v3') as unknown as { default: MockMailchimpType };
    Mailchimp = mailchimpModule.default;

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

      const { register } = await import('./newsletter') as NewsletterModule;

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'newuser@example.com',
        }),
      } as APIGatewayProxyEvent;

      const result = await register(event, {} as Context);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ success: true });

      expect(result.headers?.['Access-Control-Allow-Origin']).toBe('https://www.cryfs.org');

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
      const { register } = await import('./newsletter') as NewsletterModule;

      const event = {
        body: JSON.stringify({
          token: 'invalid',
          email: 'test@example.com',
        }),
      } as APIGatewayProxyEvent;

      const result = await register(event, {} as Context);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body) as { error: string };
      expect(body.error).toBe('Wrong token');
      expect(Mailchimp.__mockPost).not.toHaveBeenCalled();
    });
  });

  describe('Contact Form Flow', () => {
    test('complete contact form submission', async () => {
      const { send } = await import('./contact') as ContactModule;

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

      expect(result.headers?.['Access-Control-Allow-Origin']).toBe('https://www.cryfs.org');

      expect(sesClient.__mockSend).toHaveBeenCalledTimes(1);
      type EmailInput = { input: { Destination: { ToAddresses: string[] }; Message: { Subject: { Data: string }; Body: { Text: { Data: string } } }; ReplyToAddresses: string[] } };
      const calls = sesClient.__mockSend.mock.calls as Array<[EmailInput]>;
      const command = calls[0]![0];
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

      const { register } = await import('./newsletter') as NewsletterModule;

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'test@example.com',
        }),
      } as APIGatewayProxyEvent;

      const result = await register(event, {} as Context);

      expect(result.statusCode).toBe(500);

      expect(sesClient.__mockSend).toHaveBeenCalled();
      type ErrorEmailInput = { input: { Message: { Subject: { Data: string } } } };
      const calls = sesClient.__mockSend.mock.calls as Array<[ErrorEmailInput]>;
      const command = calls[0]![0];
      expect(command.input.Message.Subject.Data).toContain('Error');
    });
  });

  describe('Secrets Loading', () => {
    test('secrets are loaded from SSM on first request', async () => {
      Mailchimp.__mockPost.mockResolvedValue({ id: 'member' });

      const { register } = await import('./newsletter') as NewsletterModule;

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'test@example.com',
        }),
      } as APIGatewayProxyEvent;

      await register(event, {} as Context);

      expect(ssmClient.__mockSend).toHaveBeenCalledTimes(1);
      type SSMInput = { input: Record<string, unknown> };
      const calls = ssmClient.__mockSend.mock.calls as Array<[SSMInput]>;
      const command = calls[0]![0];
      expect(command).toBeInstanceOf(ssmClient.GetParametersCommand);
      expect(command.input).toEqual({
        Names: ['MAILCHIMP_API_TOKEN', 'MAILCHIMP_LIST_ID'],
        WithDecryption: true,
      });
    });
  });
});
