const React = require('react');

const mockRouter = {
  asPath: '/',
  pathname: '/',
  query: {},
  push: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  back: jest.fn(),
  forward: jest.fn(),
  reload: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isReady: true,
  isPreview: false,
};

const useRouter = jest.fn(() => mockRouter);

const withRouter = (Component) => {
  const WithRouterWrapper = (props) => {
    return React.createElement(Component, { ...props, router: mockRouter });
  };
  WithRouterWrapper.displayName = `withRouter(${Component.displayName || Component.name || 'Component'})`;
  return WithRouterWrapper;
};

const Router = {
  ...mockRouter,
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
};

module.exports = {
  useRouter,
  withRouter,
  Router,
  default: Router,
  mockRouter,
};
