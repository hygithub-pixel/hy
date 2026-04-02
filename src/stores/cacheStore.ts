import { defineStore } from 'pinia';

export interface CacheConfig {
  defaultExpiry?: number;
  maxSize?: number;
  cleanupInterval?: number;
  defaultPriority?: number;
}

export const useCacheStore = defineStore('cache', {
  state: () => ({
    initialized: false
  }),
  actions: {
    initCache() {
      this.initialized = true;
    }
  },
  persist: {
    key: 'cache-store',
    storage: localStorage,
    paths: []
  }
});
