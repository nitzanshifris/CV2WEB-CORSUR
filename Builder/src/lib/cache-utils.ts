interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string;
}

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

const DEFAULT_TTL = 3600; // 1 hour
const DEFAULT_KEY_PREFIX = 'app_cache_';

class Cache {
  private storage: Storage;
  private prefix: string;

  constructor(storage: Storage = localStorage, prefix: string = DEFAULT_KEY_PREFIX) {
    this.storage = storage;
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): void {
    const item: CacheItem<T> = {
      value,
      expiresAt: Date.now() + ttl * 1000,
    };

    try {
      this.storage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.error('Error setting cache item:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const itemStr = this.storage.getItem(this.getKey(key));
      if (!itemStr) return null;

      const item: CacheItem<T> = JSON.parse(itemStr);

      if (Date.now() > item.expiresAt) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error getting cache item:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      this.storage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing cache item:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(this.storage);
      keys.filter(key => key.startsWith(this.prefix)).forEach(key => this.storage.removeItem(key));
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const cache = new Cache();

export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = DEFAULT_TTL, keyPrefix } = options;
  const cacheInstance = keyPrefix ? new Cache(localStorage, keyPrefix) : cache;

  const cachedValue = cacheInstance.get<T>(key);
  if (cachedValue !== null) {
    return cachedValue;
  }

  const value = await fn();
  cacheInstance.set(key, value, ttl);
  return value;
}

export function createCacheKey(...parts: (string | number)[]): string {
  return parts.join(':');
}

export function invalidateCache(pattern: string): void {
  const keys = Object.keys(localStorage);
  const regex = new RegExp(pattern);

  keys.filter(key => regex.test(key)).forEach(key => localStorage.removeItem(key));
}
