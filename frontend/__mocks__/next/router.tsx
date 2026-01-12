import React from 'react';

interface MockRouterEvents {
  on: jest.Mock;
  off: jest.Mock;
  emit: jest.Mock;
}

interface MockRouter {
  asPath: string;
  pathname: string;
  query: Record<string, string | string[] | undefined>;
  push: jest.Mock<Promise<boolean>>;
  replace: jest.Mock<Promise<boolean>>;
  prefetch: jest.Mock<Promise<void>>;
  back: jest.Mock;
  forward: jest.Mock;
  reload: jest.Mock;
  events: MockRouterEvents;
  isFallback: boolean;
  isReady: boolean;
  isPreview: boolean;
}

const mockRouter: MockRouter = {
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

const withRouter = <P extends { router?: MockRouter }>(Component: React.ComponentType<P>) => {
  const WithRouterWrapper = (props: Omit<P, 'router'>) => {
    return React.createElement(Component, { ...props, router: mockRouter } as P);
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

export { useRouter, withRouter, Router, mockRouter };
export default Router;

module.exports = {
  useRouter,
  withRouter,
  Router,
  default: Router,
  mockRouter,
};
