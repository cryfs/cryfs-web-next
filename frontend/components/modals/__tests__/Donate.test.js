import React from 'react'
import { render, screen } from '@testing-library/react'
import Donate from '../Donate'

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript(props) {
    return <script {...props} />
  }
})

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
  return function MockRouteHashBasedModal({ children, hash }) {
    return (
      <div data-testid="modal" data-hash={hash}>
        {children}
      </div>
    )
  }
})

describe('Donate Modal', () => {
  it('renders donate modal', () => {
    render(<Donate />)
    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('uses correct hash for route-based modal', () => {
    render(<Donate />)
    expect(screen.getByTestId('modal')).toHaveAttribute('data-hash', '#donate')
  })

  it('loads donorbox widget script', () => {
    const { container } = render(<Donate />)
    const script = container.querySelector('script[src="https://donorbox.org/widget.js"]')
    expect(script).toBeInTheDocument()
  })

  it('renders donorbox iframe', () => {
    const { container } = render(<Donate />)
    const iframe = container.querySelector('iframe[name="donorbox"]')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', expect.stringContaining('donorbox.org/embed/cryfs'))
  })

  it('iframe has correct default amount', () => {
    const { container } = render(<Donate />)
    const iframe = container.querySelector('iframe[name="donorbox"]')
    expect(iframe).toHaveAttribute('src', expect.stringContaining('amount=25'))
  })

  it('iframe has recurring enabled', () => {
    const { container } = render(<Donate />)
    const iframe = container.querySelector('iframe[name="donorbox"]')
    expect(iframe).toHaveAttribute('src', expect.stringContaining('recurring=true'))
  })

  it('iframe allows payment request', () => {
    const { container } = render(<Donate />)
    const iframe = container.querySelector('iframe[name="donorbox"]')
    expect(iframe).toHaveAttribute('allowpaymentrequest', 'allowpaymentrequest')
  })
})
