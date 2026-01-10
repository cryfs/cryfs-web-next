// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Suppress expected console errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Not implemented: HTMLFormElement.prototype.submit') ||
       args[0].includes('Error: Uncaught [Error: Test error]'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
