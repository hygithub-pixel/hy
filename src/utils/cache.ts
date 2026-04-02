// 缓存项接口
interface CacheItem<T> {
  data: T;
  timestamp: number;       // 创建/访问时间戳
  expiry?: number;         // 过期时间（毫秒）
  priority?: number;       // 优先级 (1-10, 10最高)
  accessCount: number;     // 访问次数
  lastAccess: number;      // 最后访问时间
}

// 缓存配置接口
interface CacheConfig {
  defaultExpiry?: number; // 默认过期时间（毫秒）
  maxSize?: number;       // 最大缓存项数量
  cleanupInterval?: number; // 自动清理间隔（毫秒）
  defaultPriority?: number; // 默认优先级
}

// 缓存统计接口
export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  evictions: number;
  hitRate: number;
}

// 智能缓存类
export class Cache<T = any> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private config: Required<CacheConfig>;
  private stats: CacheStats;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  
  constructor(config: CacheConfig = {}) {
    this.config = {
      defaultExpiry: config.defaultExpiry || 5 * 60 * 1000, // 默认5分钟
      maxSize: config.maxSize || 100, // 默认100个缓存项
      cleanupInterval: config.cleanupInterval || 60 * 1000, // 默认1分钟
      defaultPriority: config.defaultPriority || 5 // 默认优先级
    };
    
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      evictions: 0,
      hitRate: 0
    };
    
    // 启动自动清理定时器
    this.startCleanupTimer();
  }
  
  // 启动自动清理定时器
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanExpired();
    }, this.config.cleanupInterval);
  }
  
  // 停止自动清理定时器
  public stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
  
  // 设置缓存
  set(key: string, data: T, options?: {
    expiry?: number;
    priority?: number;
  }): void {
    const now = Date.now();
    const expiry = options?.expiry || this.config.defaultExpiry;
    const priority = options?.priority || this.config.defaultPriority;
    
    // 检查缓存大小
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry,
      priority,
      accessCount: 0,
      lastAccess: now
    });
    
    this.updateStats();
  }
  
  // 获取缓存
  get(key: string): T | null {
    const now = Date.now();
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }
    
    // 检查是否过期
    if (now - item.timestamp > item.expiry!) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }
    
    // 更新访问信息
    item.accessCount++;
    item.lastAccess = now;
    
    this.stats.hits++;
    this.updateStats();
    
    return item.data;
  }
  
  // 删除缓存
  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.updateStats();
    return result;
  }
  
  // 清除所有缓存
  clear(): void {
    this.cache.clear();
    this.updateStats();
  }
  
  // 检查缓存是否存在
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }
    
    // 检查是否过期
    if (Date.now() - item.timestamp > item.expiry!) {
      this.cache.delete(key);
      this.updateStats();
      return false;
    }
    
    return true;
  }
  
  // 获取缓存大小
  size(): number {
    // 先清理过期缓存
    this.cleanExpired();
    return this.cache.size;
  }
  
  // 清理过期缓存
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
  
  // 智能缓存淘汰策略
  private evict(): void {
    // 按优先级和访问频率排序
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      item
    }));
    
    // 排序：优先级高的、访问频率高的、最近访问的排在前面
    items.sort((a, b) => {
      // 先按优先级排序
      if (b.item.priority! !== a.item.priority!) {
        return b.item.priority! - a.item.priority!;
      }
      // 再按访问频率排序
      if (b.item.accessCount !== a.item.accessCount) {
        return b.item.accessCount - a.item.accessCount;
      }
      // 最后按最近访问时间排序
      return b.item.lastAccess - a.item.lastAccess;
    });
    
    // 删除最末尾的缓存项
    if (items.length > 0) {
      const itemToRemove = items[items.length - 1];
      this.cache.delete(itemToRemove.key);
      this.stats.evictions++;
      this.updateStats();
    }
  }
  
  // 更新统计信息
  private updateStats(): void {
    this.stats.size = this.cache.size;
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }
  
  // 获取缓存统计信息
  getStats(): CacheStats {
    return { ...this.stats };
  }
  
  // 预热缓存
  prewarm(key: string, data: T, options?: {
    expiry?: number;
    priority?: number;
  }): void {
    this.set(key, data, options);
  }
  
  // 批量设置缓存
  setBatch(items: Array<{
    key: string;
    data: T;
    options?: {
      expiry?: number;
      priority?: number;
    };
  }>): void {
    items.forEach(item => {
      this.set(item.key, item.data, item.options);
    });
  }
  
  // 批量获取缓存
  getBatch(keys: string[]): Map<string, T | null> {
    const result = new Map<string, T | null>();
    keys.forEach(key => {
      result.set(key, this.get(key));
    });
    return result;
  }
}

// 创建不同类型的缓存实例
export const apiCache = new Cache({ defaultExpiry: 5 * 60 * 1000, maxSize: 100 });
export const userCache = new Cache({ defaultExpiry: 30 * 60 * 1000, maxSize: 50 });
export const menuCache = new Cache({ defaultExpiry: 10 * 60 * 1000, maxSize: 50 });

// 通用缓存工具
export const cacheUtils = {
  // 生成缓存键
  generateKey(prefix: string, ...args: any[]): string {
    return `${prefix}_${args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg);
      }
      return String(arg);
    }).join('_')}`;
  },
  
  // 缓存包装器
  withCache<T>(
    cache: Cache<T>,
    key: string,
    fetcher: () => Promise<T>,
    options?: {
      expiry?: number;
      priority?: number;
    }
  ): Promise<T> {
    // 尝试从缓存获取
    const cachedData = cache.get(key);
    if (cachedData) {
      return Promise.resolve(cachedData);
    }
    
    // 从数据源获取
    return fetcher().then(data => {
      cache.set(key, data, options);
      return data;
    });
  },
  
  // 批量缓存包装器
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
    
    // 先从缓存获取
    keys.forEach(key => {
      const cachedData = cache.get(key);
      if (cachedData) {
        result.set(key, cachedData);
      } else {
        missingKeys.push(key);
      }
    });
    
    // 如果所有数据都在缓存中，直接返回
    if (missingKeys.length === 0) {
      return Promise.resolve(result);
    }
    
    // 从数据源获取缺失的数据
    return fetcher(missingKeys).then(fetchedData => {
      // 更新缓存并合并结果
      fetchedData.forEach((data, key) => {
        cache.set(key, data, options);
        result.set(key, data);
      });
      return result;
    });
  },
  
  // 缓存键生成器
  createKeyGenerator(prefix: string) {
    return (...args: any[]) => {
      return cacheUtils.generateKey(prefix, ...args);
    };
  }
};
