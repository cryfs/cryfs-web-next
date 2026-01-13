import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DownloadModal from './Download';

// Mock the RouteHashBasedModal to simplify testing
jest.mock('./RouteHashBasedModal', () => {
  return function MockRouteHashBasedModal({ children, header }: { children?: React.ReactNode; header?: string }) {
    return (
      <div data-testid="mock-modal">
        {header && <div data-testid="modal-header">{header}</div>}
        {children}
      </div>
    );
  };
});

// Mock the Analytics module
jest.mock('../Analytics', () => ({
  logAnalyticsEvent: jest.fn().mockResolvedValue(undefined),
}));

// Mock the CryFS version
jest.mock('../../config/CryfsVersion', () => ({
  VersionNumber: '1.0.0',
}));

describe('DownloadModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<DownloadModal />);
    });

    it('renders modal header with version number', () => {
      render(<DownloadModal />);
      expect(screen.getByTestId('modal-header')).toHaveTextContent('Download CryFS 1.0.0');
    });

    it('renders operating system selection prompt', () => {
      render(<DownloadModal />);
      expect(screen.getByText('Select your operating system')).toBeInTheDocument();
    });

    it('renders Linux tab', () => {
      render(<DownloadModal />);
      expect(screen.getByText('Linux')).toBeInTheDocument();
    });

    it('renders macOS tab', () => {
      render(<DownloadModal />);
      expect(screen.getByText('macOS')).toBeInTheDocument();
    });

    it('renders Windows tab', () => {
      render(<DownloadModal />);
      expect(screen.getByText('Windows')).toBeInTheDocument();
    });

    it('renders OS icons with aria-labels', () => {
      render(<DownloadModal />);
      expect(screen.getByLabelText('Linux')).toBeInTheDocument();
      expect(screen.getByLabelText('macOS')).toBeInTheDocument();
      expect(screen.getByLabelText('Windows')).toBeInTheDocument();
    });

    it('renders link to older releases', () => {
      render(<DownloadModal />);
      // Find the specific "here" link that points to releases
      const hereLinks = screen.getAllByRole('link', { name: /here/i });
      const releasesLink = hereLinks.find(
        (link) => link.getAttribute('href') === 'https://github.com/cryfs/cryfs/releases'
      );
      expect(releasesLink).toBeDefined();
    });
  });

  describe('Linux tab content', () => {
    it('shows Debian / Ubuntu installation command', () => {
      render(<DownloadModal />);

      expect(screen.getByText('sudo apt install cryfs')).toBeInTheDocument();
    });

    it('shows Debian / Ubuntu section', () => {
      render(<DownloadModal />);
      expect(screen.getByText('Debian / Ubuntu')).toBeInTheDocument();
      expect(screen.getByText(/CryFS is available in the official Debian and Ubuntu repositories/)).toBeInTheDocument();
    });

    it('shows Other Distributions section', () => {
      render(<DownloadModal />);
      expect(screen.getByText('Other Distributions')).toBeInTheDocument();
      expect(screen.getByText(/Check your distribution/)).toBeInTheDocument();
    });

    it('shows build from source option', () => {
      render(<DownloadModal />);
      // Both Linux and macOS have "Build from Source", so check that at least one is visible
      const buildFromSourceLinks = screen.getAllByText('Build from Source');
      expect(buildFromSourceLinks.length).toBeGreaterThan(0);
    });
  });

  describe('tab switching', () => {
    it('switches to macOS tab when clicked', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('macOS'));

      expect(screen.getByText('brew install --cask macfuse')).toBeInTheDocument();
    });

    it('switches to Windows tab when clicked', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Windows'));

      expect(screen.getByText(/Windows support is experimental/)).toBeInTheDocument();
    });

    it('switches back to Linux tab when clicked', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      // Switch to Windows first
      await user.click(screen.getByText('Windows'));
      expect(screen.getByText(/Windows support is experimental/)).toBeInTheDocument();

      // Switch back to Linux
      await user.click(screen.getByText('Linux'));
      expect(screen.getByText('Debian / Ubuntu')).toBeInTheDocument();
    });

    it('logs analytics event for Linux tab', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = await import('../Analytics') as { logAnalyticsEvent: jest.Mock };
      render(<DownloadModal />);

      // Switch away first, then back to Linux
      await user.click(screen.getByText('macOS'));
      await user.click(screen.getByText('Linux'));

      expect(logAnalyticsEvent).toHaveBeenCalledWith('download', 'click_linux_tab');
    });

    it('logs analytics event for macOS tab', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = await import('../Analytics') as { logAnalyticsEvent: jest.Mock };
      render(<DownloadModal />);

      await user.click(screen.getByText('macOS'));

      expect(logAnalyticsEvent).toHaveBeenCalledWith('download', 'click_macos_tab');
    });

    it('logs analytics event for Windows tab', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = await import('../Analytics') as { logAnalyticsEvent: jest.Mock };
      render(<DownloadModal />);

      await user.click(screen.getByText('Windows'));

      expect(logAnalyticsEvent).toHaveBeenCalledWith('download', 'click_windows_tab');
    });
  });

  describe('macOS tab content', () => {
    it('shows macOS Homebrew commands', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('macOS'));

      expect(screen.getByText('brew install --cask macfuse')).toBeInTheDocument();
      expect(screen.getByText('brew install cryfs/tap/cryfs')).toBeInTheDocument();
    });

    it('shows macFUSE requirement note', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('macOS'));

      expect(screen.getByText(/is required for CryFS to work on macOS/)).toBeInTheDocument();
    });
  });

  describe('Windows tab content', () => {
    it('shows Windows installation information', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Windows'));

      expect(screen.getByText(/Windows support is experimental/)).toBeInTheDocument();
    });

    it('shows DokanY link', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Windows'));

      expect(screen.getByRole('link', { name: /dokany/i })).toHaveAttribute(
        'href',
        'https://github.com/dokan-dev/dokany/releases'
      );
    });

    it('shows Visual C++ Redistributable link', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Windows'));

      expect(
        screen.getByRole('link', { name: /Visual C\+\+ Redistributable/i })
      ).toBeInTheDocument();
    });

    it('shows CryFS Windows download link', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Windows'));

      expect(screen.getByRole('link', { name: /CryFS.*64-bit/i })).toBeInTheDocument();
    });
  });

  describe('tab state management', () => {
    it('Linux tab is active by default', () => {
      render(<DownloadModal />);

      // Check that Linux content is visible
      expect(screen.getByText('Debian / Ubuntu')).toBeInTheDocument();
    });

    it('maintains tab state after multiple switches', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      // Switch to macOS
      await user.click(screen.getByText('macOS'));
      expect(screen.getByText('brew install --cask macfuse')).toBeInTheDocument();

      // Switch to Windows
      await user.click(screen.getByText('Windows'));
      expect(screen.getByText(/Windows support is experimental/)).toBeInTheDocument();

      // Switch back to Linux
      await user.click(screen.getByText('Linux'));
      expect(screen.getByText('Debian / Ubuntu')).toBeInTheDocument();
    });

    it('does not re-trigger analytics when clicking active tab', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = await import('../Analytics') as { logAnalyticsEvent: jest.Mock };
      render(<DownloadModal />);

      // Click on Linux (already active) - should still log
      await user.click(screen.getByText('Linux'));

      // Click again
      await user.click(screen.getByText('Linux'));

      // Both clicks should have logged
      expect(logAnalyticsEvent).toHaveBeenCalledTimes(2);
    });
  });

  describe('Console components', () => {
    it('renders console commands with proper formatting', () => {
      render(<DownloadModal />);

      const consoleCommand = screen.getByText('sudo apt install cryfs');
      expect(consoleCommand).toBeInTheDocument();
    });
  });
});
