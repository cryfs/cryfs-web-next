interface MockResponse {
  ok: boolean;
  json: () => Promise<object>;
  text: () => Promise<string>;
}

const mockFetch = jest.fn((): Promise<MockResponse> =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

export default mockFetch;
module.exports = mockFetch;
module.exports.default = mockFetch;
