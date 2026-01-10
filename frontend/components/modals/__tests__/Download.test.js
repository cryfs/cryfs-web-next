import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Download from '../Download'
import * as Analytics from '../../Analytics'

// Mock the Analytics module
jest.mock('../../Analytics', () => ({
  logAnalyticsEvent: jest.fn(() => Promise.resolve()),
}))

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}))

// Mock RouteHashBasedModal
jest.mock('../RouteHashBasedModal', () => {
  return function MockRouteHashBasedModal({ children, header }) {
    return (
      <div data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        {children}
      </div>
    )
  }
})

describe('Download Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders download modal with correct header', () => {
    render(<Download />)
    expect(screen.getByTestId('modal-header')).toHaveTextContent('Download CryFS 1.0.1')
  })

  it('renders operating system selection prompt', () => {
    render(<Download />)
    expect(screen.getByText('Select your operating system')).toBeInTheDocument()
  })

  it('renders all three OS tabs (Ubuntu, Debian, Other)', () => {
    render(<Download />)
    expect(screen.getByText('Ubuntu')).toBeInTheDocument()
    expect(screen.getByText('Debian')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
  })

  it('displays Ubuntu tab content by default', () => {
    render(<Download />)
    expect(screen.getByText('Easy Install')).toBeInTheDocument()
    expect(screen.getByText('For Ubuntu 17.04 and later')).toBeInTheDocument()
    expect(screen.getByText('sudo apt install cryfs')).toBeInTheDocument()
  })

  it('switches to Debian tab when clicked', async () => {
    render(<Download />)

    const debianTab = screen.getByText('Debian')
    fireEvent.click(debianTab)

    await waitFor(() => {
      expect(screen.getByText('For Debian Stretch and later')).toBeInTheDocument()
    })

    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('download', 'click_debian_tab')
  })

  it('switches to Other tab when clicked', async () => {
    render(<Download />)

    const otherTab = screen.getByText('Other')
    fireEvent.click(otherTab)

    await waitFor(() => {
      expect(screen.getByText('Other Linux')).toBeInTheDocument()
      expect(screen.getByText('Mac OS X')).toBeInTheDocument()
      expect(screen.getByText('Windows')).toBeInTheDocument()
    })

    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('download', 'click_other_tab')
  })

  it('logs analytics when Ubuntu tab is clicked', async () => {
    render(<Download />)

    const ubuntuTab = screen.getByText('Ubuntu')
    fireEvent.click(ubuntuTab)

    await waitFor(() => {
      expect(Analytics.logAnalyticsEvent).toHaveBeenCalledWith('download', 'click_ubuntu_tab')
    })
  })

  it('displays Mac OS X installation instructions in Other tab', async () => {
    render(<Download />)

    const otherTab = screen.getByText('Other')
    fireEvent.click(otherTab)

    await waitFor(() => {
      expect(screen.getByText('brew install --cask macfuse')).toBeInTheDocument()
      expect(screen.getByText('brew install cryfs/tap/cryfs')).toBeInTheDocument()
    })
  })

  it('displays Windows installation instructions in Other tab', async () => {
    render(<Download />)

    const otherTab = screen.getByText('Other')
    fireEvent.click(otherTab)

    await waitFor(() => {
      expect(screen.getByText(/Windows support is highly experimental/i)).toBeInTheDocument()
      expect(screen.getByText(/DokanY/i)).toBeInTheDocument()
    })
  })

  it('displays link to older releases', () => {
    render(<Download />)
    const link = screen.getByText('here')
    expect(link).toHaveAttribute('href', 'https://github.com/cryfs/cryfs/releases')
  })

  it('displays alternative build from source option', () => {
    render(<Download />)
    expect(screen.getByText(/Alternative: Build from source/i)).toBeInTheDocument()
  })

  it('maintains active tab state when switching between tabs', async () => {
    render(<Download />)

    // Switch to Debian
    fireEvent.click(screen.getByText('Debian'))
    await waitFor(() => {
      expect(screen.getByText('For Debian Stretch and later')).toBeInTheDocument()
    })

    // Switch to Other
    fireEvent.click(screen.getByText('Other'))
    await waitFor(() => {
      expect(screen.getByText('Mac OS X')).toBeInTheDocument()
    })

    // Switch back to Ubuntu
    fireEvent.click(screen.getByText('Ubuntu'))
    await waitFor(() => {
      expect(screen.getByText('For Ubuntu 17.04 and later')).toBeInTheDocument()
    })

    expect(Analytics.logAnalyticsEvent).toHaveBeenCalledTimes(3)
  })
})
