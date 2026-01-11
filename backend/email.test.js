"use strict";

jest.mock('@aws-sdk/client-ses');

describe('email_myself', () => {
  let SESClient, SendEmailCommand, mockSend;
  let email_myself;

  beforeEach(() => {
    jest.resetModules();
    const ses = require('@aws-sdk/client-ses');
    SESClient = ses.SESClient;
    SendEmailCommand = ses.SendEmailCommand;
    mockSend = ses.__mockSend;
    mockSend.mockClear();
    mockSend.mockResolvedValue({});
    email_myself = require('./email').email_myself;
  });

  test('sends email with correct payload', async () => {
    await email_myself('Test Sender', 'Test Subject', 'Test message body');

    expect(mockSend).toHaveBeenCalledTimes(1);
    const command = mockSend.mock.calls[0][0];
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

    const command = mockSend.mock.calls[0][0];
    expect(command.input.ReplyToAddresses).toEqual(['reply@example.com']);
  });

  test('excludes reply_to when undefined', async () => {
    await email_myself('Sender', 'Subject', 'Message', undefined);

    const command = mockSend.mock.calls[0][0];
    expect(command.input).not.toHaveProperty('ReplyToAddresses');
  });

  test('excludes reply_to when empty string', async () => {
    await email_myself('Sender', 'Subject', 'Message', '');

    const command = mockSend.mock.calls[0][0];
    expect(command.input).not.toHaveProperty('ReplyToAddresses');
  });
});
