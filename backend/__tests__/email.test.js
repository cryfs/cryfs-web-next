// Mock dependencies before importing the module
const mockSend = jest.fn()
const mockSetApiKey = jest.fn()

jest.mock('@sendgrid/mail', () => ({
  setApiKey: mockSetApiKey,
  send: mockSend,
}))

jest.mock('../secret', () => jest.fn(() => Promise.resolve('test-sendgrid-key')))

import { email_myself } from '../email'
import secret from '../secret'

describe('email', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSend.mockResolvedValue([{ statusCode: 202 }])
  })

  it('sends email with correct parameters', async () => {
    await email_myself('Test User', 'Test Subject', 'Test message body')

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'messmer@cryfs.org',
        from: {
          email: 'messmer@cryfs.org',
          name: 'Test User',
        },
        subject: 'Test Subject',
        text: 'Test message body',
      })
    )
  })

  it('sets SendGrid API key on first use', async () => {
    await email_myself('User', 'Subject', 'Message')

    expect(secret).toHaveBeenCalledWith('SENDGRID_API_KEY')
    expect(mockSetApiKey).toHaveBeenCalledWith('test-sendgrid-key')
  })

  it('includes reply_to when provided', async () => {
    await email_myself('Test User', 'Subject', 'Message', 'reply@example.com')

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        reply_to: 'reply@example.com',
      })
    )
  })

  it('does not include reply_to when not provided', async () => {
    await email_myself('Test User', 'Subject', 'Message')

    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.reply_to).toBeUndefined()
  })

  it('does not include reply_to when empty string', async () => {
    await email_myself('Test User', 'Subject', 'Message', '')

    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.reply_to).toBeUndefined()
  })

  it('handles SendGrid errors', async () => {
    const sendgridError = new Error('SendGrid API error')
    mockSend.mockRejectedValueOnce(sendgridError)

    await expect(
      email_myself('User', 'Subject', 'Message')
    ).rejects.toThrow('SendGrid API error')
  })

  it('sends emails with different from names', async () => {
    await email_myself('Alice', 'First Subject', 'First message')
    await email_myself('Bob', 'Second Subject', 'Second message')

    expect(mockSend).toHaveBeenNthCalledWith(1, expect.objectContaining({
      from: { email: 'messmer@cryfs.org', name: 'Alice' },
      subject: 'First Subject',
      text: 'First message',
    }))

    expect(mockSend).toHaveBeenNthCalledWith(2, expect.objectContaining({
      from: { email: 'messmer@cryfs.org', name: 'Bob' },
      subject: 'Second Subject',
      text: 'Second message',
    }))
  })

  it('always sends to messmer@cryfs.org', async () => {
    await email_myself('Test User', 'Subject', 'Message')

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'messmer@cryfs.org',
      })
    )
  })

  it('handles long message bodies', async () => {
    const longMessage = 'a'.repeat(10000)
    await email_myself('User', 'Subject', longMessage)

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        text: longMessage,
      })
    )
  })

  it('handles special characters in message', async () => {
    const specialMessage = 'Message with special chars: \n\t"\'<>&'
    await email_myself('User', 'Subject', specialMessage)

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        text: specialMessage,
      })
    )
  })
})
