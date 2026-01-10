"use strict";

jest.mock('@sendgrid/mail');
jest.mock('./secret', () => jest.fn().mockResolvedValue('test-sendgrid-key'));

describe('email_myself', () => {
  let sendgrid;
  let email_myself;

  beforeEach(() => {
    jest.resetModules();
    sendgrid = require('@sendgrid/mail');
    sendgrid.__mockSend.mockClear();
    sendgrid.__mockSetApiKey.mockClear();
    email_myself = require('./email').email_myself;
  });

  test('sends email with correct payload', async () => {
    await email_myself('Test Sender', 'Test Subject', 'Test message body');

    expect(sendgrid.setApiKey).toHaveBeenCalledWith('test-sendgrid-key');
    expect(sendgrid.send).toHaveBeenCalledWith({
      to: 'messmer@cryfs.org',
      from: {
        email: 'messmer@cryfs.org',
        name: 'Test Sender',
      },
      subject: 'Test Subject',
      text: 'Test message body',
    });
  });

  test('includes reply_to when provided', async () => {
    await email_myself('Sender', 'Subject', 'Message', 'reply@example.com');

    expect(sendgrid.send).toHaveBeenCalledWith({
      to: 'messmer@cryfs.org',
      from: {
        email: 'messmer@cryfs.org',
        name: 'Sender',
      },
      subject: 'Subject',
      text: 'Message',
      reply_to: 'reply@example.com',
    });
  });

  test('excludes reply_to when undefined', async () => {
    await email_myself('Sender', 'Subject', 'Message', undefined);

    const callArgs = sendgrid.send.mock.calls[0][0];
    expect(callArgs).not.toHaveProperty('reply_to');
  });

  test('excludes reply_to when empty string', async () => {
    await email_myself('Sender', 'Subject', 'Message', '');

    const callArgs = sendgrid.send.mock.calls[0][0];
    expect(callArgs).not.toHaveProperty('reply_to');
  });

  test('caches SendGrid instance across calls', async () => {
    // Within this single test, make multiple calls
    await email_myself('Sender1', 'Subject1', 'Message1');
    await email_myself('Sender2', 'Subject2', 'Message2');
    await email_myself('Sender3', 'Subject3', 'Message3');

    // setApiKey should only be called once due to CachedValue
    expect(sendgrid.setApiKey).toHaveBeenCalledTimes(1);
    expect(sendgrid.send).toHaveBeenCalledTimes(3);
  });
});
