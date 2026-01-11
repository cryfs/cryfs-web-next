const mockSend = jest.fn().mockResolvedValue({});

class SESClient {
  constructor() {}
  send(command) {
    return mockSend(command);
  }
}

class SendEmailCommand {
  constructor(input) {
    this.input = input;
  }
}

module.exports = {
  SESClient,
  SendEmailCommand,
  __mockSend: mockSend,
};
