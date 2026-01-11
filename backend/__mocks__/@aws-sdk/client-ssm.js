const mockSend = jest.fn();

class SSMClient {
  constructor() {}
  send(command) {
    return mockSend(command);
  }
}

class GetParametersCommand {
  constructor(input) {
    this.input = input;
  }
}

// Reset helper
const resetMock = () => {
  mockSend.mockClear();
  mockSend.mockResolvedValue({ Parameters: [] });
};

module.exports = {
  SSMClient,
  GetParametersCommand,
  __mockSend: mockSend,
  __resetMock: resetMock,
};
