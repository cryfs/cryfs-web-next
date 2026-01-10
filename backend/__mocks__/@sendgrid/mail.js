const mockSend = jest.fn().mockResolvedValue([{ statusCode: 202 }]);
const mockSetApiKey = jest.fn();

module.exports = {
  setApiKey: mockSetApiKey,
  send: mockSend,
  __mockSend: mockSend,
  __mockSetApiKey: mockSetApiKey,
};
