import React from 'react'
import { render, screen } from '@testing-library/react'
import Index from '../index'

// Mock all child components
jest.mock('../../components/Layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="layout">{children}</div>
  }
})

jest.mock('../../components/AlternatingSections', () => {
  return function MockAlternatingSections({ children }) {
    return <div data-testid="alternating-sections">{children}</div>
  }
})

jest.mock('../../components/modals/Donate', () => {
  return function MockDonateModal() {
    return <div data-testid="donate-modal">Donate Modal</div>
  }
})

jest.mock('../../components/modals/Download', () => {
  return function MockDownloadModal() {
    return <div data-testid="download-modal">Download Modal</div>
  }
})

jest.mock('../../components/Teaser', () => {
  return function MockTeaser() {
    return <div data-testid="teaser">Teaser</div>
  }
})

jest.mock('../../components/sections/NewsletterSection', () => {
  return function MockNewsletterSection() {
    return <div data-testid="newsletter-section">Newsletter Section</div>
  }
})

jest.mock('../../components/sections/BulletsSection', () => {
  return function MockBulletsSection() {
    return <div data-testid="bullets-section">Bullets Section</div>
  }
})

jest.mock('../../components/sections/ContactSection', () => {
  return function MockContactSection() {
    return <div data-testid="contact-section">Contact Section</div>
  }
})

jest.mock('../../components/MetaTags', () => {
  return function MockMetaTags({ title, url, description }) {
    return (
      <div data-testid="meta-tags" data-title={title} data-url={url} data-description={description} />
    )
  }
})

describe('Index Page', () => {
  it('renders the page layout', () => {
    render(<Index />)
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })

  it('renders meta tags with correct information', () => {
    render(<Index />)
    const metaTags = screen.getByTestId('meta-tags')
    expect(metaTags).toHaveAttribute('data-title', 'CryFS: A cryptographic filesystem for the cloud')
    expect(metaTags).toHaveAttribute('data-url', 'https://www.cryfs.org')
    expect(metaTags).toHaveAttribute('data-description', expect.stringContaining('CryFS encrypts your Dropbox'))
  })

  it('renders the teaser section', () => {
    render(<Index />)
    expect(screen.getByTestId('teaser')).toBeInTheDocument()
  })

  it('renders the download modal', () => {
    render(<Index />)
    expect(screen.getByTestId('download-modal')).toBeInTheDocument()
  })

  it('renders the donate modal', () => {
    render(<Index />)
    expect(screen.getByTestId('donate-modal')).toBeInTheDocument()
  })

  it('renders all sections in alternating sections container', () => {
    render(<Index />)
    expect(screen.getByTestId('alternating-sections')).toBeInTheDocument()
    expect(screen.getByTestId('bullets-section')).toBeInTheDocument()
    expect(screen.getByTestId('newsletter-section')).toBeInTheDocument()
    expect(screen.getByTestId('contact-section')).toBeInTheDocument()
  })

  it('renders sections in correct order', () => {
    render(<Index />)
    const sections = screen.getAllByRole('generic')
    const bulletsSectionIndex = sections.findIndex(s => s.getAttribute('data-testid') === 'bullets-section')
    const newsletterSectionIndex = sections.findIndex(s => s.getAttribute('data-testid') === 'newsletter-section')
    const contactSectionIndex = sections.findIndex(s => s.getAttribute('data-testid') === 'contact-section')

    expect(bulletsSectionIndex).toBeLessThan(newsletterSectionIndex)
    expect(newsletterSectionIndex).toBeLessThan(contactSectionIndex)
  })
})
