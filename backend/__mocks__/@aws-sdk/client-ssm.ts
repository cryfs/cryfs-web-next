export const __mockSend = jest.fn();

export class SSMClient {
  send(command: GetParametersCommand): Promise<{ Parameters: Array<{ Name: string; Value: string }> }> {
    return __mockSend(command);
  }
}

export class GetParametersCommand {
  input: { Names: string[]; WithDecryption: boolean };

  constructor(input: { Names: string[]; WithDecryption: boolean }) {
    this.input = input;
  }
}

export const __resetMock = (): void => {
  __mockSend.mockClear();
  __mockSend.mockResolvedValue({ Parameters: [] });
};
