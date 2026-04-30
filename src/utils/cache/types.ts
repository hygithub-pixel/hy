interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry?: number;
  priority?: number;
  accessCount: number;
  lastAccess: number;
}

interface CacheConfig {
  defaultExpiry?: number;
  maxSize?: number;
  cleanupInterval?: number;
  defaultPriority?: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  evictions: number;
  hitRate: number;
}

export type { CacheItem, CacheConfig };
