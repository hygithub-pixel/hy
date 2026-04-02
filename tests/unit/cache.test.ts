import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Cache, cacheUtils } from '../../src/utils/cache';

describe('Cache', () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache({ defaultExpiry: 100, maxSize: 2 });
  });

  it('should set and get data', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return null for non-existent key', () => {
    expect(cache.get('non-existent')).toBeNull();
  });

  it('should expire data after default expiry', async () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');

    // 模拟时间流逝
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 150);
    expect(cache.get('key1')).toBeNull();
  });

  it('should respect custom expiry', async () => {
    cache.set('key1', 'value1', 50);
    expect(cache.get('key1')).toBe('value1');

    // 模拟时间流逝，未到过期时间
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 30);
    expect(cache.get('key1')).toBe('value1');

    // 模拟时间流逝，已到过期时间
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 60);
    expect(cache.get('key1')).toBeNull();
  });

  it('should evict oldest item when max size is reached', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');

    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe('value2');
    expect(cache.get('key3')).toBe('value3');
  });

  it('should delete item', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
    
    cache.delete('key1');
    expect(cache.get('key1')).toBeNull();
  });

  it('should clear all items', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    cache.clear();
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
  });

  it('should check if item exists', () => {
    cache.set('key1', 'value1');
    expect(cache.has('key1')).toBe(true);
    expect(cache.has('key2')).toBe(false);
  });

  it('should return correct size', () => {
    expect(cache.size()).toBe(0);
    
    cache.set('key1', 'value1');
    expect(cache.size()).toBe(1);
    
    cache.set('key2', 'value2');
    expect(cache.size()).toBe(2);
  });

  it('should clean expired items', async () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    // 模拟时间流逝
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 150);
    
    cache.cleanExpired();
    expect(cache.size()).toBe(0);
  });
});

describe('cacheUtils', () => {
  it('should generate cache key', () => {
    const key = cacheUtils.generateKey('prefix', 'param1', { key: 'value' });
    expect(key).toBe('prefix_param1_{"key":"value"}');
  });

  it('should use cache when data exists', async () => {
    const mockCache = {
      get: vi.fn().mockReturnValue('cached-value'),
      set: vi.fn()
    } as any;
    
    const fetcher = vi.fn().mockResolvedValue('fetched-value');
    
    const result = await cacheUtils.withCache(mockCache, 'key', fetcher);
    
    expect(result).toBe('cached-value');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should fetch data when cache misses', async () => {
    const mockCache = {
      get: vi.fn().mockReturnValue(null),
      set: vi.fn()
    } as any;
    
    const fetcher = vi.fn().mockResolvedValue('fetched-value');
    
    const result = await cacheUtils.withCache(mockCache, 'key', fetcher);
    
    expect(result).toBe('fetched-value');
    expect(fetcher).toHaveBeenCalled();
    expect(mockCache.set).toHaveBeenCalledWith('key', 'fetched-value', undefined);
  });
});
