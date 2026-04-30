import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface CacheConfig {
  defaultExpiry?: number;
  maxSize?: number;
  cleanupInterval?: number;
  defaultPriority?: number;
}

export const useCacheStore = defineStore(
  'cache',
  () => {
    const initialized = ref(false);

    function initCache() {
      initialized.value = true;
    }

    return {
      initialized,
      initCache,
    };
  },
  {
    persist: {
      key: 'cache-store',
      storage: localStorage,
      paths: [],
    },
  }
);
