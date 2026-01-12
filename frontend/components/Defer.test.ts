import Defer from './Defer';

describe('Defer', () => {
  it('creates a deferred object with promise, resolve, and reject', () => {
    const deferred = Defer<string>();

    expect(deferred.promise).toBeInstanceOf(Promise);
    expect(typeof deferred.resolve).toBe('function');
    expect(typeof deferred.reject).toBe('function');
  });

  it('can be externally resolved', async () => {
    const deferred = Defer<string>();

    deferred.resolve('test value');

    await expect(deferred.promise).resolves.toBe('test value');
  });

  it('can be externally rejected', async () => {
    const deferred = Defer<string>();

    deferred.reject(new Error('test error'));

    await expect(deferred.promise).rejects.toThrow('test error');
  });

  it('works with different types - number', async () => {
    const deferred = Defer<number>();

    deferred.resolve(42);

    await expect(deferred.promise).resolves.toBe(42);
  });

  it('works with different types - object', async () => {
    const deferred = Defer<{ name: string; value: number }>();
    const testObj = { name: 'test', value: 123 };

    deferred.resolve(testObj);

    await expect(deferred.promise).resolves.toEqual(testObj);
  });

  it('works with different types - array', async () => {
    const deferred = Defer<number[]>();

    deferred.resolve([1, 2, 3]);

    await expect(deferred.promise).resolves.toEqual([1, 2, 3]);
  });

  it('can only be resolved once', async () => {
    const deferred = Defer<string>();

    deferred.resolve('first');
    deferred.resolve('second'); // This should be ignored

    await expect(deferred.promise).resolves.toBe('first');
  });

  it('can only be rejected once', async () => {
    const deferred = Defer<string>();

    deferred.reject(new Error('first error'));
    deferred.reject(new Error('second error')); // This should be ignored

    await expect(deferred.promise).rejects.toThrow('first error');
  });

  it('resolve takes precedence if called before reject', async () => {
    const deferred = Defer<string>();

    deferred.resolve('resolved');
    deferred.reject(new Error('rejected'));

    await expect(deferred.promise).resolves.toBe('resolved');
  });

  it('reject takes precedence if called before resolve', async () => {
    const deferred = Defer<string>();

    deferred.reject(new Error('rejected'));
    deferred.resolve('resolved');

    await expect(deferred.promise).rejects.toThrow('rejected');
  });

  it('allows async usage patterns', async () => {
    const deferred = Defer<string>();

    // Simulate async operation
    setTimeout(() => {
      deferred.resolve('async result');
    }, 0);

    const result = await deferred.promise;
    expect(result).toBe('async result');
  });

  it('can be used to coordinate multiple async operations', async () => {
    const deferred1 = Defer<number>();
    const deferred2 = Defer<number>();

    deferred1.resolve(10);
    deferred2.resolve(20);

    const results = await Promise.all([deferred1.promise, deferred2.promise]);
    expect(results).toEqual([10, 20]);
  });
});
