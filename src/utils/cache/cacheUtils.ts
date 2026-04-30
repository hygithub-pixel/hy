import { Cache } from './Cache';

export const cacheUtils = {
  generateKey(prefix: string, ...args: any[]): string {
    return `${prefix}_${args
      .map(arg => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg);
        }
        return String(arg);
      })
      .join('_')}`;
  },

  withCache<T>(
    cache: Cache<T>,
    key: string,
    fetcher: () => Promise<T>,
    options?: {
      expiry?: number;
      priority?: number;
    }
  ): Promise<T> {
    const cachedData = cache.get(key);
    if (cachedData) {
      return Promise.resolve(cachedData);
    }

    return fetcher().then(data => {
      cache.set(key, data, options);
      return data;
    });
  },

  withCacheBatch<T>(
    cache: Cache<T>,
    keys: string[],
    fetcher: (missingKeys: string[]) => Promise<Map<string, T>>,
    options?: {
      expiry?: number;
      priority?: number;
    }
  ): Promise<Map<string, T>> {
    const result = new Map<string, T>();
    const missingKeys: string[] = [];

    keys.forEach(key => {
      const cachedData = cache.get(key);
      if (cachedData) {
        result.set(key, cachedData);
      } else {
        missingKeys.push(key);
      }
    });

    if (missingKeys.length === 0) {
      return Promise.resolve(result);
    }

    return fetcher(missingKeys).then(fetchedData => {
      fetchedData.forEach((data, key) => {
        cache.set(key, data, options);
        result.set(key, data);
      });
      return result;
    });
  },

  createKeyGenerator(prefix: string) {
    return (...args: any[]) => {
      return cacheUtils.generateKey(prefix, ...args);
    };
  },
};
