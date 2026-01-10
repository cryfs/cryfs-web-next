"use strict";

import CachedValue from './cached_value';

describe('CachedValue', () => {
  test('creator is called only once on first access', async () => {
    const creator = jest.fn().mockResolvedValue('test-value');
    const cached = new CachedValue(creator);

    const result = await cached.get();

    expect(result).toBe('test-value');
    expect(creator).toHaveBeenCalledTimes(1);
  });

  test('value is cached for subsequent accesses', async () => {
    const creator = jest.fn().mockResolvedValue('cached-value');
    const cached = new CachedValue(creator);

    const result1 = await cached.get();
    const result2 = await cached.get();
    const result3 = await cached.get();

    expect(result1).toBe('cached-value');
    expect(result2).toBe('cached-value');
    expect(result3).toBe('cached-value');
    expect(creator).toHaveBeenCalledTimes(1);
  });

  test('concurrent access calls creator only once', async () => {
    let callCount = 0;
    const creator = jest.fn(async () => {
      callCount++;
      // Simulate async work
      await new Promise(resolve => setTimeout(resolve, 10));
      return `value-${callCount}`;
    });
    const cached = new CachedValue(creator);

    // Call get() multiple times concurrently
    const results = await Promise.all([
      cached.get(),
      cached.get(),
      cached.get(),
    ]);

    expect(creator).toHaveBeenCalledTimes(1);
    expect(results).toEqual(['value-1', 'value-1', 'value-1']);
  });

  test('creator returning different types works correctly', async () => {
    const objectValue = { foo: 'bar', count: 42 };
    const creator = jest.fn().mockResolvedValue(objectValue);
    const cached = new CachedValue(creator);

    const result = await cached.get();

    expect(result).toEqual(objectValue);
    expect(result).toBe(objectValue); // Same reference
  });

  test('creator error propagates correctly', async () => {
    const error = new Error('Creator failed');
    const creator = jest.fn().mockRejectedValue(error);
    const cached = new CachedValue(creator);

    await expect(cached.get()).rejects.toThrow('Creator failed');
  });
});
