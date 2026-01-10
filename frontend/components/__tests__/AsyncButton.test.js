import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AsyncButton from '../AsyncButton'

describe('AsyncButton', () => {
  it('renders children when not running', () => {
    render(<AsyncButton onClick={jest.fn()}>Click Me</AsyncButton>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('disables button while async operation is running', async () => {
    const slowOperation = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<AsyncButton onClick={slowOperation}>Submit</AsyncButton>)

    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()

    fireEvent.click(button)

    await waitFor(() => {
      expect(button).toBeDisabled()
    })

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    }, { timeout: 200 })
  })

  it('shows spinner while async operation is running', async () => {
    const slowOperation = jest.fn(() => new Promise(resolve => setTimeout(resolve, 50)))
    render(<AsyncButton onClick={slowOperation}>Submit</AsyncButton>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(button.querySelector('.fa-pulse')).toBeInTheDocument()
    })
  })

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn(() => Promise.resolve())
    render(<AsyncButton onClick={handleClick}>Click Me</AsyncButton>)

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  it('prevents default event behavior', async () => {
    const handleClick = jest.fn(() => Promise.resolve())
    render(<AsyncButton onClick={handleClick}>Submit</AsyncButton>)

    const event = {
      preventDefault: jest.fn(),
      target: screen.getByRole('button')
    }

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(handleClick).toHaveBeenCalled()
    })
  })

  it('ignores double clicks while operation is running', async () => {
    const slowOperation = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<AsyncButton onClick={slowOperation}>Submit</AsyncButton>)

    const button = screen.getByRole('button')

    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    await waitFor(() => {
      expect(slowOperation).toHaveBeenCalledTimes(1)
    }, { timeout: 200 })
  })

  it('re-enables button after async operation completes', async () => {
    const handleClick = jest.fn(() => Promise.resolve())
    render(<AsyncButton onClick={handleClick}>Submit</AsyncButton>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })

  it('re-enables button even if async operation throws error', async () => {
    const handleClick = jest.fn(() => Promise.reject(new Error('Test error')))
    render(<AsyncButton onClick={handleClick}>Submit</AsyncButton>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })

  it('forwards props to underlying Button component', () => {
    render(
      <AsyncButton onClick={jest.fn()} color="primary" className="test-class">
        Submit
      </AsyncButton>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn-primary')
    expect(button).toHaveClass('test-class')
  })
})
