"use strict";

jest.mock('aws-sdk');

describe('secret', () => {
  let secret;
  let mockGetParameters;

  beforeEach(() => {
    jest.resetModules();
    // Re-require AWS after resetModules to get fresh mock
    const AWS = require('aws-sdk');
    mockGetParameters = AWS.__mockGetParameters;
    mockGetParameters.mockReset();
  });

  test('loads all secrets successfully', async () => {
    mockGetParameters.mockImplementation((params, callback) => {
      callback(null, {
        Parameters: [
          { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
          { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
          { Name: 'SENDGRID_API_KEY', Value: 'sg-key-xyz' },
        ],
      });
    });

    secret = require('./secret').default;

    const mailchimpToken = await secret('MAILCHIMP_API_TOKEN');
    const mailchimpList = await secret('MAILCHIMP_LIST_ID');
    const sendgridKey = await secret('SENDGRID_API_KEY');

    expect(mailchimpToken).toBe('mc-token-123');
    expect(mailchimpList).toBe('list-abc');
    expect(sendgridKey).toBe('sg-key-xyz');
  });

  test('throws error when secrets are missing', async () => {
    mockGetParameters.mockImplementation((params, callback) => {
      callback(null, {
        Parameters: [
          { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
          // Missing MAILCHIMP_LIST_ID and SENDGRID_API_KEY
        ],
      });
    });

    secret = require('./secret').default;

    await expect(secret('MAILCHIMP_API_TOKEN')).rejects.toThrow('missing keys');
  });

  test('caches secrets after first load', async () => {
    mockGetParameters.mockImplementation((params, callback) => {
      callback(null, {
        Parameters: [
          { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
          { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
          { Name: 'SENDGRID_API_KEY', Value: 'sg-key-xyz' },
        ],
      });
    });

    secret = require('./secret').default;

    await secret('MAILCHIMP_API_TOKEN');
    await secret('MAILCHIMP_LIST_ID');
    await secret('SENDGRID_API_KEY');

    // SSM should only be called once due to caching
    expect(mockGetParameters).toHaveBeenCalledTimes(1);
  });

  test('returns undefined for unknown keys', async () => {
    mockGetParameters.mockImplementation((params, callback) => {
      callback(null, {
        Parameters: [
          { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
          { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
          { Name: 'SENDGRID_API_KEY', Value: 'sg-key-xyz' },
        ],
      });
    });

    secret = require('./secret').default;

    const unknownKey = await secret('UNKNOWN_KEY');
    expect(unknownKey).toBeUndefined();
  });

  test('calls SSM with correct parameters', async () => {
    mockGetParameters.mockImplementation((params, callback) => {
      callback(null, {
        Parameters: [
          { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
          { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
          { Name: 'SENDGRID_API_KEY', Value: 'sg-key-xyz' },
        ],
      });
    });

    secret = require('./secret').default;
    await secret('MAILCHIMP_API_TOKEN');

    expect(mockGetParameters).toHaveBeenCalledWith(
      {
        Names: ['MAILCHIMP_API_TOKEN', 'MAILCHIMP_LIST_ID', 'SENDGRID_API_KEY'],
        WithDecryption: true,
      },
      expect.any(Function)
    );
  });
});
