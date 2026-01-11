const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();

class MockMailchimp {
  apiToken: string;
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.get = mockGet;
    this.post = mockPost;
    this.put = mockPut;
  }

  static __mockGet = mockGet;
  static __mockPost = mockPost;
  static __mockPut = mockPut;
}

export default MockMailchimp;
