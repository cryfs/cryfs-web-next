import AWS from 'aws-sdk'

// Mock AWS SDK before importing secret
jest.mock('aws-sdk', () => {
  const mockGetParameters = jest.fn()
  return {
    SSM: jest.fn(() => ({
      getParameters: mockGetParameters,
    })),
    __mockGetParameters: mockGetParameters,
  }
})

describe('secret', () => {
  let secret
  let mockGetParameters

  beforeEach(async () => {
    jest.clearAllMocks()
    jest.resetModules()

    mockGetParameters = AWS.__mockGetParameters

    // Default mock response
    mockGetParameters.mockImplementation((params, callback) => {
      callback(null, {
        Parameters: [
          { Name: 'MAILCHIMP_API_TOKEN', Value: 'test-mailchimp-token' },
          { Name: 'MAILCHIMP_LIST_ID', Value: 'test-list-id' },
          { Name: 'SENDGRID_API_KEY', Value: 'test-sendgrid-key' },
        ],
      })
    })

    // Import secret module after setting up mocks
    const secretModule = await import('../secret.js')
    secret = secretModule.default
  })

  it('retrieves secret from AWS Parameter Store', async () => {
    const value = await secret('MAILCHIMP_API_TOKEN')

    expect(value).toBe('test-mailchimp-token')
    expect(mockGetParameters).toHaveBeenCalledWith(
      expect.objectContaining({
        Names: expect.arrayContaining(['MAILCHIMP_API_TOKEN', 'MAILCHIMP_LIST_ID', 'SENDGRID_API_KEY']),
        WithDecryption: true,
      }),
      expect.any(Function)
    )
  })

  it('retrieves different secrets', async () => {
    const token = await secret('MAILCHIMP_API_TOKEN')
    const listId = await secret('MAILCHIMP_LIST_ID')
    const sendgridKey = await secret('SENDGRID_API_KEY')

    expect(token).toBe('test-mailchimp-token')
    expect(listId).toBe('test-list-id')
    expect(sendgridKey).toBe('test-sendgrid-key')
  })

  it('caches secrets and only calls AWS once', async () => {
    await secret('MAILCHIMP_API_TOKEN')
    await secret('MAILCHIMP_LIST_ID')
    await secret('SENDGRID_API_KEY')
    await secret('MAILCHIMP_API_TOKEN')

    // Should only call AWS once due to caching
    expect(mockGetParameters).toHaveBeenCalledTimes(1)
  })

  it('throws error when required secrets are missing', async () => {
    mockGetParameters.mockImplementation((params, callback) => {
      callback(null, {
        Parameters: [
          { Name: 'MAILCHIMP_API_TOKEN', Value: 'test-token' },
          // Missing MAILCHIMP_LIST_ID and SENDGRID_API_KEY
        ],
      })
    })

    // Reset module to use new mock
    jest.resetModules()
    const secretModule = await import('../secret.js')
    secret = secretModule.default

    await expect(secret('MAILCHIMP_API_TOKEN')).rejects.toThrow(/missing keys/)
  })

  it('handles AWS SDK errors', async () => {
    const awsError = new Error('AWS SDK error')
    mockGetParameters.mockImplementation((params, callback) => {
      callback(awsError, null)
    })

    // Reset module to use new mock
    jest.resetModules()
    const secretModule = await import('../secret.js')
    secret = secretModule.default

    await expect(secret('MAILCHIMP_API_TOKEN')).rejects.toThrow('AWS SDK error')
  })

  it('requests all required keys at once', async () => {
    await secret('MAILCHIMP_API_TOKEN')

    expect(mockGetParameters).toHaveBeenCalledWith(
      expect.objectContaining({
        Names: ['MAILCHIMP_API_TOKEN', 'MAILCHIMP_LIST_ID', 'SENDGRID_API_KEY'],
      }),
      expect.any(Function)
    )
  })

  it('enables WithDecryption for secure parameters', async () => {
    await secret('SENDGRID_API_KEY')

    expect(mockGetParameters).toHaveBeenCalledWith(
      expect.objectContaining({
        WithDecryption: true,
      }),
      expect.any(Function)
    )
  })
})
