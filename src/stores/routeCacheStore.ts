import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useRouteCacheStore = defineStore('routeCache', () => {
  const cachedRoutes = ref<Set<string>>(new Set());

  const isCached = computed(() => {
    return (path: string) => cachedRoutes.value.has(path);
  });

  const addRoute = (path: string) => {
    cachedRoutes.value.add(path);
  };

  const removeRoute = (path: string) => {
    cachedRoutes.value.delete(path);
  };

  const clearCache = (path?: string) => {
    if (path) {
      cachedRoutes.value.delete(path);
    } else {
      cachedRoutes.value.clear();
    }
  };

  const getCachedRoutes = () => {
    return Array.from(cachedRoutes.value);
  };

  return {
    cachedRoutes,
    isCached,
    addRoute,
    removeRoute,
    clearCache,
    getCachedRoutes,
  };
});
