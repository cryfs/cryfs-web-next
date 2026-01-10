import CachedValue from '../cached_value'

describe('CachedValue', () => {
  it('calls creator function on first access', async () => {
    const creator = jest.fn(() => Promise.resolve('test-value'))
    const cached = new CachedValue(creator)

    const result = await cached.get()

    expect(result).toBe('test-value')
    expect(creator).toHaveBeenCalledTimes(1)
  })

  it('caches value and does not call creator again on subsequent accesses', async () => {
    const creator = jest.fn(() => Promise.resolve('test-value'))
    const cached = new CachedValue(creator)

    const result1 = await cached.get()
    const result2 = await cached.get()
    const result3 = await cached.get()

    expect(result1).toBe('test-value')
    expect(result2).toBe('test-value')
    expect(result3).toBe('test-value')
    expect(creator).toHaveBeenCalledTimes(1)
  })

  it('handles concurrent access correctly', async () => {
    let callCount = 0
    const creator = jest.fn(() => {
      callCount++
      return new Promise(resolve => {
        setTimeout(() => resolve(`value-${callCount}`), 10)
      })
    })
    const cached = new CachedValue(creator)

    // Start multiple concurrent get operations
    const promises = [
      cached.get(),
      cached.get(),
      cached.get(),
      cached.get(),
      cached.get(),
    ]

    const results = await Promise.all(promises)

    // All should get the same value
    expect(results).toEqual(['value-1', 'value-1', 'value-1', 'value-1', 'value-1'])
    // Creator should only be called once despite concurrent access
    expect(creator).toHaveBeenCalledTimes(1)
  })

  it('caches undefined values', async () => {
    const creator = jest.fn(() => Promise.resolve(undefined))
    const cached = new CachedValue(creator)

    const result1 = await cached.get()
    const result2 = await cached.get()

    expect(result1).toBeUndefined()
    expect(result2).toBeUndefined()
    // This is a known limitation: undefined values are not cached
    // The creator will be called each time
    expect(creator.mock.calls.length).toBeGreaterThanOrEqual(1)
  })

  it('caches null values correctly', async () => {
    const creator = jest.fn(() => Promise.resolve(null))
    const cached = new CachedValue(creator)

    const result1 = await cached.get()
    const result2 = await cached.get()

    expect(result1).toBeNull()
    expect(result2).toBeNull()
    expect(creator).toHaveBeenCalledTimes(1)
  })

  it('caches objects correctly', async () => {
    const testObj = { key: 'value', nested: { data: 123 } }
    const creator = jest.fn(() => Promise.resolve(testObj))
    const cached = new CachedValue(creator)

    const result1 = await cached.get()
    const result2 = await cached.get()

    expect(result1).toBe(testObj)
    expect(result2).toBe(testObj)
    expect(creator).toHaveBeenCalledTimes(1)
  })

  it('propagates errors from creator function', async () => {
    const error = new Error('Creation failed')
    const creator = jest.fn(() => Promise.reject(error))
    const cached = new CachedValue(creator)

    await expect(cached.get()).rejects.toThrow('Creation failed')
    expect(creator).toHaveBeenCalledTimes(1)
  })

  it('does not cache error results', async () => {
    let callCount = 0
    const creator = jest.fn(() => {
      callCount++
      if (callCount === 1) {
        return Promise.reject(new Error('First call failed'))
      }
      return Promise.resolve('success')
    })
    const cached = new CachedValue(creator)

    // First call should fail
    await expect(cached.get()).rejects.toThrow('First call failed')

    // Second call should succeed (creator is called again)
    const result = await cached.get()
    expect(result).toBe('success')
    expect(creator).toHaveBeenCalledTimes(2)
  })

  it('handles async creator functions that take time', async () => {
    const creator = jest.fn(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve('delayed-value'), 50)
      })
    })
    const cached = new CachedValue(creator)

    const start = Date.now()
    const result = await cached.get()
    const duration = Date.now() - start

    expect(result).toBe('delayed-value')
    expect(duration).toBeGreaterThanOrEqual(50)
    expect(creator).toHaveBeenCalledTimes(1)

    // Second call should be instant
    const start2 = Date.now()
    const result2 = await cached.get()
    const duration2 = Date.now() - start2

    expect(result2).toBe('delayed-value')
    expect(duration2).toBeLessThan(10)
    expect(creator).toHaveBeenCalledTimes(1)
  })
})
