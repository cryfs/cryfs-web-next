import { timeout, promiseWithTimeout } from './Timeout';

describe('Timeout utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('timeout', () => {
    it('returns a promise', () => {
      const result = timeout(1000);
      expect(result).toBeInstanceOf(Promise);
    });

    it('resolves after specified delay', async () => {
      const promise = timeout(1000);

      // Promise should not be resolved yet
      let resolved = false;
      void promise.then(() => {
        resolved = true;
      });

      expect(resolved).toBe(false);

      // Advance time by 1000ms
      jest.advanceTimersByTime(1000);

      // Now the promise should resolve
      await promise;
      expect(resolved).toBe(true);
    });

    it('resolves with undefined', async () => {
      const promise = timeout(500);
      jest.advanceTimersByTime(500);
      const result = await promise;
      expect(result).toBeUndefined();
    });

    it('works with zero delay', async () => {
      const promise = timeout(0);
      jest.advanceTimersByTime(0);
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('promiseWithTimeout', () => {
    it('resolves if promise completes before timeout', async () => {
      const fastPromise = Promise.resolve('success');
      const result = await promiseWithTimeout(fastPromise, 1000);
      expect(result).toBe('success');
    });

    it('rejects with timeout message if promise takes longer than timeout', async () => {
      const slowPromise = new Promise<string>((resolve) => {
        setTimeout(() => resolve('too late'), 2000);
      });

      const resultPromise = promiseWithTimeout(slowPromise, 1000);

      // Advance time past the timeout
      jest.advanceTimersByTime(1000);

      await expect(resultPromise).rejects.toThrow('Timeout waiting for promise');
    });

    it('clears timeout when promise resolves quickly', async () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const fastPromise = Promise.resolve('quick');
      await promiseWithTimeout(fastPromise, 5000);

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('preserves the type of the resolved value', async () => {
      const numberPromise = Promise.resolve(42);
      const result = await promiseWithTimeout(numberPromise, 1000);
      expect(result).toBe(42);
      expect(typeof result).toBe('number');
    });

    it('preserves rejection from original promise', async () => {
      const failingPromise = Promise.reject(new Error('Original error'));

      await expect(promiseWithTimeout(failingPromise, 1000)).rejects.toThrow('Original error');
    });

    it('handles promise that resolves just before timeout', async () => {
      let resolvePromise: (value: string) => void;
      const promise = new Promise<string>((resolve) => {
        resolvePromise = resolve;
      });

      const resultPromise = promiseWithTimeout(promise, 1000);

      // Advance time to just before timeout
      jest.advanceTimersByTime(999);

      // Resolve the promise
      resolvePromise!('just in time');

      await expect(resultPromise).resolves.toBe('just in time');
    });
  });
});
