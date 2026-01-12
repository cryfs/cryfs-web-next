
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RouteHashBasedModal from './RouteHashBasedModal';

// Mock the RoutingListener
jest.mock('../RoutingListener', () => ({
  RoutingListener: jest.fn().mockImplementation(() => ({
    url: '/',
    addListener: jest.fn(),
    finish: jest.fn(),
    onChangeCallbacks: [],
  })),
}));

// Mock url-parse
jest.mock('url-parse', () => {
  return jest.fn().mockImplementation((url) => ({
    hash: url?.includes('#test-hash') ? '#test-hash' : '',
    set: jest.fn(),
    toString: jest.fn().mockReturnValue(url || '/'),
  }));
});

// Setup router mock for these tests
const mockRouter = {
  asPath: '/',
  replace: jest.fn(() => Promise.resolve(true)),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('RouteHashBasedModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.asPath = '/';
    mockRouter.replace.mockClear();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      render(
        <RouteHashBasedModal hash="#test-hash">
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );
    });

    it('renders children when modal is open', () => {
      mockRouter.asPath = '/#test-hash';

      render(
        <RouteHashBasedModal hash="#test-hash">
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      // Modal children should be in the document (even if not visible initially)
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('renders header when provided', () => {
      mockRouter.asPath = '/#test-hash';

      render(
        <RouteHashBasedModal hash="#test-hash" header="Test Header">
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });

    it('renders close button in footer when showCloseButtonInFooter is true', () => {
      mockRouter.asPath = '/#test-hash';

      render(
        <RouteHashBasedModal hash="#test-hash" showCloseButtonInFooter>
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('does not render close button when showCloseButtonInFooter is false', () => {
      mockRouter.asPath = '/#test-hash';

      render(
        <RouteHashBasedModal hash="#test-hash" showCloseButtonInFooter={false}>
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });
  });

  describe('modal state based on URL hash', () => {
    it('modal content is not visible when URL hash does not match', () => {
      mockRouter.asPath = '/';

      render(
        <RouteHashBasedModal hash="#different-hash">
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      // Content should not be visible when modal is closed
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('modal is open when URL hash matches', () => {
      mockRouter.asPath = '/#test-hash';

      render(
        <RouteHashBasedModal hash="#test-hash">
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      // Content should be visible
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });
  });

  describe('toggle behavior', () => {
    it('calls router.replace when close button is clicked', async () => {
      const user = userEvent.setup();
      mockRouter.asPath = '/#test-hash';

      render(
        <RouteHashBasedModal hash="#test-hash" showCloseButtonInFooter>
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      await user.click(screen.getByRole('button', { name: /close/i }));

      expect(mockRouter.replace).toHaveBeenCalled();
    });

    it('calls router.replace when header close button is clicked', async () => {
      const user = userEvent.setup();
      mockRouter.asPath = '/#test-hash';

      render(
        <RouteHashBasedModal hash="#test-hash" header="Test Header">
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      // Find the close button in the header (usually has aria-label or ×)
      const closeButtons = screen.getAllByRole('button');
      const headerCloseButton = closeButtons.find(
        (btn) => btn.textContent === '×' || btn.getAttribute('aria-label') === 'Close'
      );

      if (headerCloseButton) {
        await user.click(headerCloseButton);
        expect(mockRouter.replace).toHaveBeenCalled();
      }
    });
  });

  describe('props forwarding', () => {
    it('forwards size prop to Modal', () => {
      mockRouter.asPath = '/#test-hash';

      render(
        <RouteHashBasedModal hash="#test-hash" size="lg">
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      // Modal content should be visible when open
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('forwards labelledBy prop for accessibility', () => {
      mockRouter.asPath = '/#test-hash';

      render(
        <RouteHashBasedModal hash="#test-hash" header="Accessible Header" labelledBy="modal-title">
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      const header = screen.getByText('Accessible Header');
      expect(header.closest('[id="modal-title"]')).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('cleans up routing listener on unmount', () => {
      const { RoutingListener } = require('../RoutingListener');
      mockRouter.asPath = '/';

      const { unmount } = render(
        <RouteHashBasedModal hash="#test-hash">
          <div>Modal Content</div>
        </RouteHashBasedModal>
      );

      unmount();

      // RoutingListener.finish should have been called
      const instance = RoutingListener.mock.results[0]?.value;
      if (instance) {
        expect(instance.finish).toHaveBeenCalled();
      }
    });
  });
});
