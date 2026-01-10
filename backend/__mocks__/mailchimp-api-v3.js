const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();

class MockMailchimp {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.get = mockGet;
    this.post = mockPost;
    this.put = mockPut;
  }
}

MockMailchimp.__mockGet = mockGet;
MockMailchimp.__mockPost = mockPost;
MockMailchimp.__mockPut = mockPut;

module.exports = MockMailchimp;
