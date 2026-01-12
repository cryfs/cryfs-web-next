jest.mock('@aws-sdk/client-ses');

interface MockSESModule {
  SendEmailCommand: typeof import('@aws-sdk/client-ses').SendEmailCommand;
  __mockSend: jest.Mock;
}

interface EmailModule {
  email_myself: typeof import('./email').email_myself;
}

describe('email_myself', () => {
  let SendEmailCommand: typeof import('@aws-sdk/client-ses').SendEmailCommand;
  let mockSend: jest.Mock;
  let email_myself: typeof import('./email').email_myself;

  beforeEach(async () => {
    jest.resetModules();
    const ses = await import('@aws-sdk/client-ses') as unknown as MockSESModule;
    SendEmailCommand = ses.SendEmailCommand;
    mockSend = ses.__mockSend;
    mockSend.mockClear();
    mockSend.mockResolvedValue({});
    const emailModule = await import('./email') as EmailModule;
    email_myself = emailModule.email_myself;
  });

  test('sends email with correct payload', async () => {
    await email_myself('Test Sender', 'Test Subject', 'Test message body');

    expect(mockSend).toHaveBeenCalledTimes(1);
    const calls = mockSend.mock.calls as Array<[{ input: Record<string, unknown> }]>;
    const command = calls[0][0];
    expect(command).toBeInstanceOf(SendEmailCommand);
    expect(command.input).toEqual({
      Source: 'Test Sender <messmer@cryfs.org>',
      Destination: { ToAddresses: ['messmer@cryfs.org'] },
      Message: {
        Subject: { Data: 'Test Subject' },
        Body: { Text: { Data: 'Test message body' } },
      },
    });
  });

  test('includes reply_to when provided', async () => {
    await email_myself('Sender', 'Subject', 'Message', 'reply@example.com');

    const calls = mockSend.mock.calls as Array<[{ input: Record<string, unknown> }]>;
    const command = calls[0][0];
    expect(command.input.ReplyToAddresses).toEqual(['reply@example.com']);
  });

  test('excludes reply_to when undefined', async () => {
    await email_myself('Sender', 'Subject', 'Message', undefined);

    const calls = mockSend.mock.calls as Array<[{ input: Record<string, unknown> }]>;
    const command = calls[0][0];
    expect(command.input).not.toHaveProperty('ReplyToAddresses');
  });

  test('excludes reply_to when empty string', async () => {
    await email_myself('Sender', 'Subject', 'Message', '');

    const calls = mockSend.mock.calls as Array<[{ input: Record<string, unknown> }]>;
    const command = calls[0][0];
    expect(command.input).not.toHaveProperty('ReplyToAddresses');
  });
});
