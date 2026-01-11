export const __mockSend = jest.fn().mockResolvedValue({});

export class SESClient {
  send(command: SendEmailCommand): Promise<Record<string, unknown>> {
    return __mockSend(command);
  }
}

export class SendEmailCommand {
  input: Record<string, unknown>;

  constructor(input: Record<string, unknown>) {
    this.input = input;
  }
}
