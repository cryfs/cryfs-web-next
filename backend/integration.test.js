"use strict";

/**
 * Integration tests that verify the full Lambda handler flow
 * with mocked external services.
 */

jest.mock('@aws-sdk/client-ssm');
jest.mock('@aws-sdk/client-ses');
jest.mock('mailchimp-api-v3');

describe('Integration Tests', () => {
  const validToken = 'fd0kAn1zns';
  let ssmClient;
  let sesClient;
  let Mailchimp;

  beforeEach(() => {
    jest.resetModules();

    // Re-require mocks after resetModules
    ssmClient = require('@aws-sdk/client-ssm');
    sesClient = require('@aws-sdk/client-ses');
    Mailchimp = require('mailchimp-api-v3');

    // Reset all mock functions
    ssmClient.__mockSend.mockReset();
    sesClient.__mockSend.mockReset();
    Mailchimp.__mockPost.mockReset();
    Mailchimp.__mockGet.mockReset();
    Mailchimp.__mockPut.mockReset();

    // Setup default AWS SSM mock (for newsletter - no longer has SENDGRID_API_KEY)
    ssmClient.__mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token' },
        { Name: 'MAILCHIMP_LIST_ID', Value: 'list-id' },
      ],
    });

    // Setup default SES mock
    sesClient.__mockSend.mockResolvedValue({});
  });

  describe('Newsletter Registration Flow', () => {
    test('complete successful registration flow', async () => {
      Mailchimp.__mockPost.mockResolvedValue({ id: 'new-member' });

      const { register } = require('./newsletter');

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'newuser@example.com',
        }),
      };

      const result = await register(event, {});

      // Verify response
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ success: true });

      // Verify CORS headers
      expect(result.headers['Access-Control-Allow-Origin']).toBe('https://www.cryfs.org');

      // Verify Mailchimp was called
      expect(Mailchimp.__mockPost).toHaveBeenCalledWith({
        path: '/lists/list-id/members',
        body: {
          email_address: 'newuser@example.com',
          status: 'pending',
        },
      });

      // Verify notification email was sent via SES
      expect(sesClient.__mockSend).toHaveBeenCalled();
    });

    test('invalid token blocks Mailchimp call', async () => {
      const { register } = require('./newsletter');

      const event = {
        body: JSON.stringify({
          token: 'invalid',
          email: 'test@example.com',
        }),
      };

      const result = await register(event, {});

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Wrong token');
      expect(Mailchimp.__mockPost).not.toHaveBeenCalled();
    });
  });

  describe('Contact Form Flow', () => {
    test('complete contact form submission', async () => {
      const { send } = require('./contact');

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'visitor@example.com',
          message: 'Hello, I need help!',
        }),
      };

      const result = await send(event, {});

      // Verify response
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ success: true });

      // Verify CORS headers
      expect(result.headers['Access-Control-Allow-Origin']).toBe('https://www.cryfs.org');

      // Verify email was sent via SES
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

      const { register } = require('./newsletter');

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'test@example.com',
        }),
      };

      const result = await register(event, {});

      expect(result.statusCode).toBe(500);

      // Verify error notification email was sent via SES
      expect(sesClient.__mockSend).toHaveBeenCalled();
      const command = sesClient.__mockSend.mock.calls[0][0];
      expect(command.input.Message.Subject.Data).toContain('Error');
    });
  });

  describe('Secrets Loading', () => {
    test('secrets are loaded from SSM on first request', async () => {
      Mailchimp.__mockPost.mockResolvedValue({ id: 'member' });

      const { register } = require('./newsletter');

      const event = {
        body: JSON.stringify({
          token: validToken,
          email: 'test@example.com',
        }),
      };

      await register(event, {});

      // Verify SSM was called with correct parameters (no more SENDGRID_API_KEY)
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
