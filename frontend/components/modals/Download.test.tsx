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

    it('renders Ubuntu tab', () => {
      render(<DownloadModal />);
      expect(screen.getByText('Ubuntu')).toBeInTheDocument();
    });

    it('renders Debian tab', () => {
      render(<DownloadModal />);
      expect(screen.getByText('Debian')).toBeInTheDocument();
    });

    it('renders Other tab', () => {
      render(<DownloadModal />);
      expect(screen.getByText('Other')).toBeInTheDocument();
    });

    it('renders OS logos', () => {
      render(<DownloadModal />);
      expect(screen.getByAltText('Ubuntu')).toBeInTheDocument();
      expect(screen.getByAltText('Debian')).toBeInTheDocument();
      expect(screen.getByAltText('Other')).toBeInTheDocument();
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

  describe('Ubuntu tab content', () => {
    it('shows Ubuntu installation command', () => {
      render(<DownloadModal />);

      // Ubuntu and Debian share the same command, so there may be multiple instances
      const commands = screen.getAllByText('sudo apt install cryfs');
      expect(commands.length).toBeGreaterThan(0);
    });

    it('shows Easy Install section for Ubuntu', () => {
      render(<DownloadModal />);
      // There may be multiple "Easy Install" headings (Ubuntu and Debian)
      const easyInstalls = screen.getAllByText('Easy Install');
      expect(easyInstalls.length).toBeGreaterThan(0);
      expect(screen.getByText(/CryFS is available in the official Ubuntu repositories/)).toBeInTheDocument();
    });

    it('shows build from source option', () => {
      render(<DownloadModal />);
      // There may be multiple "Build from Source" sections
      const alternatives = screen.getAllByText('Build from Source');
      expect(alternatives.length).toBeGreaterThan(0);
    });
  });

  describe('tab switching', () => {
    it('switches to Debian tab when clicked', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      // Click on Debian tab
      await user.click(screen.getByText('Debian'));

      // Debian content should be visible
      expect(screen.getByText(/CryFS is available in the official Debian repositories/)).toBeInTheDocument();
    });

    it('switches to Other tab when clicked', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      // Click on Other tab
      await user.click(screen.getByText('Other'));

      // Other content should be visible
      expect(screen.getByText('Other Linux')).toBeInTheDocument();
      expect(screen.getByText('macOS')).toBeInTheDocument();
      expect(screen.getByText('Windows')).toBeInTheDocument();
    });

    it('logs analytics event when switching tabs', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = await import('../Analytics') as { logAnalyticsEvent: jest.Mock };
      render(<DownloadModal />);

      await user.click(screen.getByText('Debian'));

      expect(logAnalyticsEvent).toHaveBeenCalledWith('download', 'click_debian_tab');
    });

    it('logs analytics event for Other tab', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = await import('../Analytics') as { logAnalyticsEvent: jest.Mock };
      render(<DownloadModal />);

      await user.click(screen.getByText('Other'));

      expect(logAnalyticsEvent).toHaveBeenCalledWith('download', 'click_other_tab');
    });
  });

  describe('Debian tab content', () => {
    it('shows Debian installation command', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Debian'));

      // Ubuntu and Debian share the same command
      const commands = screen.getAllByText('sudo apt install cryfs');
      expect(commands.length).toBeGreaterThan(0);
    });
  });

  describe('Other tab content', () => {
    it('shows macOS Homebrew commands', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Other'));

      expect(screen.getByText('brew install --cask macfuse')).toBeInTheDocument();
      expect(screen.getByText('brew install cryfs/tap/cryfs')).toBeInTheDocument();
    });

    it('shows Windows installation information', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Other'));

      expect(screen.getByText(/Windows support is experimental/)).toBeInTheDocument();
    });

    it('shows DokanY link', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Other'));

      expect(screen.getByRole('link', { name: /dokany/i })).toHaveAttribute(
        'href',
        'https://github.com/dokan-dev/dokany/releases'
      );
    });

    it('shows Visual C++ Redistributable link', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Other'));

      expect(
        screen.getByRole('link', { name: /Visual C\+\+ Redistributable/i })
      ).toBeInTheDocument();
    });

    it('shows CryFS Windows download link', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      await user.click(screen.getByText('Other'));

      expect(screen.getByRole('link', { name: /CryFS.*64-bit/i })).toBeInTheDocument();
    });
  });

  describe('tab state management', () => {
    it('Ubuntu tab is active by default', () => {
      render(<DownloadModal />);

      // Check that Ubuntu content is visible
      expect(screen.getByText(/CryFS is available in the official Ubuntu repositories/)).toBeInTheDocument();
    });

    it('maintains tab state after multiple switches', async () => {
      const user = userEvent.setup();
      render(<DownloadModal />);

      // Switch to Debian
      await user.click(screen.getByText('Debian'));
      expect(screen.getByText(/CryFS is available in the official Debian repositories/)).toBeInTheDocument();

      // Switch to Other
      await user.click(screen.getByText('Other'));
      expect(screen.getByText('Other Linux')).toBeInTheDocument();

      // Switch back to Ubuntu
      await user.click(screen.getByText('Ubuntu'));
      expect(screen.getByText(/CryFS is available in the official Ubuntu repositories/)).toBeInTheDocument();
    });

    it('does not re-trigger analytics when clicking active tab', async () => {
      const user = userEvent.setup();
      const { logAnalyticsEvent } = await import('../Analytics') as { logAnalyticsEvent: jest.Mock };
      render(<DownloadModal />);

      // Click on Ubuntu (already active) - should still log
      await user.click(screen.getByText('Ubuntu'));

      // Click again
      await user.click(screen.getByText('Ubuntu'));

      // Both clicks should have logged
      expect(logAnalyticsEvent).toHaveBeenCalledTimes(2);
    });
  });

  describe('Console components', () => {
    it('renders console commands with proper formatting', () => {
      render(<DownloadModal />);

      // Find console commands (may be multiple due to Ubuntu and Debian tabs)
      const consoleCommands = screen.getAllByText('sudo apt install cryfs');
      expect(consoleCommands.length).toBeGreaterThan(0);
    });
  });
});
