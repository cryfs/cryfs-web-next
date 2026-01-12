export const __mockSend = jest.fn<Promise<Record<string, unknown>>, [SendEmailCommand]>().mockResolvedValue({});

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
