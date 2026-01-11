"use strict";

jest.mock('@aws-sdk/client-ssm');

describe('secret', () => {
  let secret;
  let mockSend;
  let GetParametersCommand;

  beforeEach(() => {
    jest.resetModules();
    // Re-require after resetModules to get fresh mock
    const ssmClient = require('@aws-sdk/client-ssm');
    mockSend = ssmClient.__mockSend;
    GetParametersCommand = ssmClient.GetParametersCommand;
    mockSend.mockReset();
  });

  test('loads all secrets successfully', async () => {
    mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
        { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
        { Name: 'SENDGRID_API_KEY', Value: 'sg-key-xyz' },
      ],
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
    mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
        // Missing MAILCHIMP_LIST_ID and SENDGRID_API_KEY
      ],
    });

    secret = require('./secret').default;

    await expect(secret('MAILCHIMP_API_TOKEN')).rejects.toThrow('missing keys');
  });

  test('caches secrets after first load', async () => {
    mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
        { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
        { Name: 'SENDGRID_API_KEY', Value: 'sg-key-xyz' },
      ],
    });

    secret = require('./secret').default;

    await secret('MAILCHIMP_API_TOKEN');
    await secret('MAILCHIMP_LIST_ID');
    await secret('SENDGRID_API_KEY');

    // SSM should only be called once due to caching
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test('returns undefined for unknown keys', async () => {
    mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
        { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
        { Name: 'SENDGRID_API_KEY', Value: 'sg-key-xyz' },
      ],
    });

    secret = require('./secret').default;

    const unknownKey = await secret('UNKNOWN_KEY');
    expect(unknownKey).toBeUndefined();
  });

  test('calls SSM with correct parameters', async () => {
    mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
        { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
        { Name: 'SENDGRID_API_KEY', Value: 'sg-key-xyz' },
      ],
    });

    secret = require('./secret').default;
    await secret('MAILCHIMP_API_TOKEN');

    expect(mockSend).toHaveBeenCalledTimes(1);
    const command = mockSend.mock.calls[0][0];
    expect(command).toBeInstanceOf(GetParametersCommand);
    expect(command.input).toEqual({
      Names: ['MAILCHIMP_API_TOKEN', 'MAILCHIMP_LIST_ID', 'SENDGRID_API_KEY'],
      WithDecryption: true,
    });
  });
});
