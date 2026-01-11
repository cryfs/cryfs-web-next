import { Mutex } from 'async-mutex';

class CachedValue<T> {
  private mutex: Mutex;
  private creator: () => Promise<T>;
  private value: T | undefined;

  constructor(creator: () => Promise<T>) {
    this.mutex = new Mutex();
    this.creator = creator;
  }

  get = async (): Promise<T> => {
    return await this.mutex.runExclusive(async () => {
      if (typeof this.value === 'undefined') {
        this.value = await this.creator();
      }
      return this.value;
    });
  };
}

export default CachedValue;
