"use strict";

/**
 * Integration tests that verify the full Lambda handler flow
 * with mocked external services.
 */

jest.mock('aws-sdk');
jest.mock('@sendgrid/mail');
jest.mock('mailchimp-api-v3');

describe('Integration Tests', () => {
  const validToken = 'fd0kAn1zns';
  let AWS;
  let sendgrid;
  let Mailchimp;

  beforeEach(() => {
    jest.resetModules();

    // Re-require mocks after resetModules
    AWS = require('aws-sdk');
    sendgrid = require('@sendgrid/mail');
    Mailchimp = require('mailchimp-api-v3');

    // Reset all mock functions
    AWS.__mockGetParameters.mockReset();
    sendgrid.__mockSend.mockClear();
    sendgrid.__mockSetApiKey.mockClear();
    Mailchimp.__mockPost.mockReset();
    Mailchimp.__mockGet.mockReset();
    Mailchimp.__mockPut.mockReset();

    // Setup default AWS SSM mock
    AWS.__mockGetParameters.mockImplementation((params, callback) => {
      callback(null, {
        Parameters: [
          { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token' },
          { Name: 'MAILCHIMP_LIST_ID', Value: 'list-id' },
          { Name: 'SENDGRID_API_KEY', Value: 'sg-key' },
        ],
      });
    });
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

      // Verify notification email was sent
      expect(sendgrid.send).toHaveBeenCalled();
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

      // Verify email was sent via SendGrid
      expect(sendgrid.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'messmer@cryfs.org',
          subject: expect.stringContaining('visitor@example.com'),
          text: 'Hello, I need help!',
        })
      );
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

      // Verify error notification email was sent
      expect(sendgrid.send).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('Error'),
        })
      );
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

      // Verify SSM was called with correct parameters
      expect(AWS.__mockGetParameters).toHaveBeenCalledWith(
        expect.objectContaining({
          Names: ['MAILCHIMP_API_TOKEN', 'MAILCHIMP_LIST_ID', 'SENDGRID_API_KEY'],
          WithDecryption: true,
        }),
        expect.any(Function)
      );
    });
  });
});
