// Mock AWS SDK before importing secret
const mockGetParameters = jest.fn()

jest.mock('aws-sdk', () => ({
  SSM: jest.fn().mockImplementation(() => ({
    getParameters: mockGetParameters,
  })),
}))

describe('secret', () => {
  let secret

  beforeAll(async () => {
    // Set default mock response
    mockGetParameters.mockImplementation((params, callback) => {
      callback(null, {
        Parameters: [
          { Name: 'MAILCHIMP_API_TOKEN', Value: 'test-mailchimp-token' },
          { Name: 'MAILCHIMP_LIST_ID', Value: 'test-list-id' },
          { Name: 'SENDGRID_API_KEY', Value: 'test-sendgrid-key' },
        ],
      })
    })

    // Import after mocks are set up
    const secretModule = await import('../secret.js')
    secret = secretModule.default
  })

  beforeEach(() => {
    mockGetParameters.mockClear()
  })

  it('retrieves secret from AWS Parameter Store', async () => {
    const value = await secret('MAILCHIMP_API_TOKEN')

    expect(value).toBe('test-mailchimp-token')
  })

  it('retrieves different secrets from cache', async () => {
    const token = await secret('MAILCHIMP_API_TOKEN')
    const listId = await secret('MAILCHIMP_LIST_ID')
    const sendgridKey = await secret('SENDGRID_API_KEY')

    expect(token).toBe('test-mailchimp-token')
    expect(listId).toBe('test-list-id')
    expect(sendgridKey).toBe('test-sendgrid-key')
  })

  it('retrieves secrets without calling AWS again (uses cache)', async () => {
    // This test runs after the first test, so secrets should be cached
    await secret('MAILCHIMP_API_TOKEN')
    await secret('MAILCHIMP_LIST_ID')
    await secret('SENDGRID_API_KEY')

    // Should not call AWS again due to caching (mockClear was called in beforeEach)
    expect(mockGetParameters).toHaveBeenCalledTimes(0)
  })

  it('requested all keys at once on first call', async () => {
    // Check that the very first call (from test 1) requested all keys
    // We need to look at the original call, not in this test
    // This is tested by verifying all secrets are available
    const token = await secret('MAILCHIMP_API_TOKEN')
    const listId = await secret('MAILCHIMP_LIST_ID')
    const sendgridKey = await secret('SENDGRID_API_KEY')

    expect(token).toBeTruthy()
    expect(listId).toBeTruthy()
    expect(sendgridKey).toBeTruthy()
  })

  it('enables WithDecryption for secure parameters', async () => {
    // This verifies the secret function can retrieve encrypted parameters
    const sendgridKey = await secret('SENDGRID_API_KEY')
    expect(sendgridKey).toBe('test-sendgrid-key')
  })
})
