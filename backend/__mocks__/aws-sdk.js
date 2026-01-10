const mockGetParameters = jest.fn((params, callback) => {
  // Default implementation that can be overridden in tests
  callback(null, { Parameters: [] });
});

class SSM {
  constructor() {
    this.getParameters = mockGetParameters;
  }
}

// Reset helper
const resetMock = () => {
  mockGetParameters.mockClear();
  mockGetParameters.mockImplementation((params, callback) => {
    callback(null, { Parameters: [] });
  });
};

module.exports = {
  SSM,
  __mockGetParameters: mockGetParameters,
  __resetMock: resetMock,
};
