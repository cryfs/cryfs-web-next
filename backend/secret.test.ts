jest.mock('@aws-sdk/client-ssm');

interface MockSSMModule {
  __mockSend: jest.Mock;
  GetParametersCommand: typeof import('@aws-sdk/client-ssm').GetParametersCommand;
}

interface SecretModule {
  default: (key: string) => Promise<string>;
}

describe('secret', () => {
  let secret: (key: string) => Promise<string>;
  let mockSend: jest.Mock;
  let GetParametersCommand: typeof import('@aws-sdk/client-ssm').GetParametersCommand;

  beforeEach(async () => {
    jest.resetModules();
    const ssmClient = await import('@aws-sdk/client-ssm') as unknown as MockSSMModule;
    mockSend = ssmClient.__mockSend;
    GetParametersCommand = ssmClient.GetParametersCommand;
    mockSend.mockReset();
  });

  test('loads all secrets successfully', async () => {
    mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
        { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
      ],
    });

    const secretModule = await import('./secret') as SecretModule;
    secret = secretModule.default;

    const mailchimpToken = await secret('MAILCHIMP_API_TOKEN');
    const mailchimpList = await secret('MAILCHIMP_LIST_ID');

    expect(mailchimpToken).toBe('mc-token-123');
    expect(mailchimpList).toBe('list-abc');
  });

  test('throws error when secrets are missing', async () => {
    mockSend.mockResolvedValue({
      Parameters: [{ Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' }],
    });

    const secretModule = await import('./secret') as SecretModule;
    secret = secretModule.default;

    await expect(secret('MAILCHIMP_API_TOKEN')).rejects.toThrow('missing keys');
  });

  test('caches secrets after first load', async () => {
    mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
        { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
      ],
    });

    const secretModule = await import('./secret') as SecretModule;
    secret = secretModule.default;

    await secret('MAILCHIMP_API_TOKEN');
    await secret('MAILCHIMP_LIST_ID');

    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test('returns undefined for unknown keys', async () => {
    mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
        { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
      ],
    });

    const secretModule = await import('./secret') as SecretModule;
    secret = secretModule.default;

    const unknownKey = await secret('UNKNOWN_KEY');
    expect(unknownKey).toBeUndefined();
  });

  test('calls SSM with correct parameters', async () => {
    mockSend.mockResolvedValue({
      Parameters: [
        { Name: 'MAILCHIMP_API_TOKEN', Value: 'mc-token-123' },
        { Name: 'MAILCHIMP_LIST_ID', Value: 'list-abc' },
      ],
    });

    const secretModule = await import('./secret') as SecretModule;
    secret = secretModule.default;
    await secret('MAILCHIMP_API_TOKEN');

    expect(mockSend).toHaveBeenCalledTimes(1);
    const calls = mockSend.mock.calls as Array<[{ input: Record<string, unknown> }]>;
    const command = calls[0][0];
    expect(command).toBeInstanceOf(GetParametersCommand);
    expect(command.input).toEqual({
      Names: ['MAILCHIMP_API_TOKEN', 'MAILCHIMP_LIST_ID'],
      WithDecryption: true,
    });
  });
});
