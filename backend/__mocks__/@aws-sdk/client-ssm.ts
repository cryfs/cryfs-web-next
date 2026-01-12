type SSMResponse = { Parameters: Array<{ Name: string; Value: string }> };

export const __mockSend = jest.fn<Promise<SSMResponse>, [GetParametersCommand]>();

export class SSMClient {
  send(command: GetParametersCommand): Promise<SSMResponse> {
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
