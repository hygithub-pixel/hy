import { CacheItem, CacheConfig, CacheStats } from './types';

export class Cache<T = any> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private config: Required<CacheConfig>;
  private stats: CacheStats;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: CacheConfig = {}) {
    this.config = {
      defaultExpiry: config.defaultExpiry || 5 * 60 * 1000,
      maxSize: config.maxSize || 100,
      cleanupInterval: config.cleanupInterval || 60 * 1000,
      defaultPriority: config.defaultPriority || 5,
    };

    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      evictions: 0,
      hitRate: 0,
    };

    this.startCleanupTimer();
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanExpired();
    }, this.config.cleanupInterval);
  }

  public stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  set(
    key: string,
    data: T,
    options?: {
      expiry?: number;
      priority?: number;
    }
  ): void {
    const now = Date.now();
    const expiry = options?.expiry || this.config.defaultExpiry;
    const priority = options?.priority || this.config.defaultPriority;

    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiry,
      priority,
      accessCount: 0,
      lastAccess: now,
    });

    this.updateStats();
  }

  get(key: string): T | null {
    const now = Date.now();
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    if (now - item.timestamp > item.expiry!) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    item.accessCount++;
    item.lastAccess = now;

    this.stats.hits++;
    this.updateStats();

    return item.data;
  }

  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.updateStats();
    return result;
  }

  clear(): void {
    this.cache.clear();
    this.updateStats();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    if (Date.now() - item.timestamp > item.expiry!) {
      this.cache.delete(key);
      this.updateStats();
      return false;
    }

    return true;
  }

  size(): number {
    this.cleanExpired();
    return this.cache.size;
  }

  cleanExpired(): void {
    const now = Date.now();
    let deleted = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiry!) {
        this.cache.delete(key);
        deleted++;
      }
    }

    if (deleted > 0) {
      this.updateStats();
    }
  }

  private evict(): void {
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      item,
    }));

    items.sort((a, b) => {
      if (b.item.priority! !== a.item.priority!) {
        return b.item.priority! - a.item.priority!;
      }
      if (b.item.accessCount !== a.item.accessCount) {
        return b.item.accessCount - a.item.accessCount;
      }
      return b.item.lastAccess - a.item.lastAccess;
    });

    if (items.length > 0) {
      const itemToRemove = items[items.length - 1];
      this.cache.delete(itemToRemove.key);
      this.stats.evictions++;
      this.updateStats();
    }
  }

  private updateStats(): void {
    this.stats.size = this.cache.size;
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  prewarm(
    key: string,
    data: T,
    options?: {
      expiry?: number;
      priority?: number;
    }
  ): void {
    this.set(key, data, options);
  }

  setBatch(
    items: Array<{
      key: string;
      data: T;
      options?: {
        expiry?: number;
        priority?: number;
      };
    }>
  ): void {
    items.forEach(item => {
      this.set(item.key, item.data, item.options);
    });
  }

  getBatch(keys: string[]): Map<string, T | null> {
    const result = new Map<string, T | null>();
    keys.forEach(key => {
      result.set(key, this.get(key));
    });
    return result;
  }
}
