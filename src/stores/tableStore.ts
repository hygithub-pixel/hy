import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TableRowData } from '../types/TableConfig';
import { apiService } from '../services/apiService';
import { ApiConfig } from '../types/MenuConfig';
import { ErrorHandler } from '../utils/errorHandler';
import { showMessage } from '../utils/message';

interface CachedData {
  data: TableRowData[];
  pagination: any;
  timestamp: number;
  lastAccess: number;
  accessCount: number;
  priority: number;
}

interface CacheStats {
  total: number;
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
}

const CACHE_TTL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 50;
const DEFAULT_PRIORITY = 5;

const getTradeNameFromUrl = (url: string): string => {
  return url.replace(/^\//, '');
};

const getDefaultApiConfig = (menuId: string): ApiConfig => ({
  list: `/menu/${menuId}/data`,
  create: `/menu/${menuId}/data`,
  update: `/menu/${menuId}/data`,
  delete: `/menu/${menuId}/data`,
});

export const useTableStore = defineStore(
  'table',
  () => {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const tableDataCache = ref<Record<string, CachedData>>({});
    const cacheStats = ref<CacheStats>({
      total: 0,
      hits: 0,
      misses: 0,
      hitRate: 0,
      size: 0,
    });

    const getCacheStats = computed((): CacheStats => {
      const stats = { ...cacheStats.value };
      stats.size = Object.keys(tableDataCache.value).length;
      stats.hitRate = stats.total > 0 ? stats.hits / stats.total : 0;
      return stats;
    });

    function updateCacheStats(isHit: boolean) {
      cacheStats.value.total++;
      if (isHit) {
        cacheStats.value.hits++;
      } else {
        cacheStats.value.misses++;
      }
      cacheStats.value.size = Object.keys(tableDataCache.value).length;
      cacheStats.value.hitRate =
        cacheStats.value.total > 0 ? cacheStats.value.hits / cacheStats.value.total : 0;
    }

    async function fetchTableData(
      menuId: string,
      apiConfig: ApiConfig | undefined,
      params?: { page?: number; pageSize?: number },
      forceRefresh?: boolean,
      priority?: number
    ) {
      const cacheKey = `${menuId}_${params?.page || 1}_${params?.pageSize || 10}`;
      const now = Date.now();
      const cachePriority = priority || DEFAULT_PRIORITY;

      if (!forceRefresh && tableDataCache.value[cacheKey]) {
        const cached = tableDataCache.value[cacheKey];
        if (now - cached.timestamp < CACHE_TTL) {
          tableDataCache.value[cacheKey].accessCount++;
          tableDataCache.value[cacheKey].lastAccess = now;
          loading.value = false;
          updateCacheStats(true);
          return cached;
        }
      }

      updateCacheStats(false);

      loading.value = true;
      error.value = null;

      try {
        let responseData: { data: TableRowData[]; pagination: any };

        if (apiConfig && apiConfig.query) {
          const res = await apiService.get(apiConfig.query, {
            page: params?.page || 1,
            pageSize: params?.pageSize || 10,
          });
          responseData = res.data;
        } else {
          const defaultConfig = getDefaultApiConfig(menuId);
          const tradeName = getTradeNameFromUrl(defaultConfig.list || '');
          const res = await apiService.get(tradeName, params);
          responseData = res.data;
        }

        const cacheKeys = Object.keys(tableDataCache.value);
        if (cacheKeys.length >= MAX_CACHE_SIZE) {
          const sortedKeys = cacheKeys.sort((a, b) => {
            const itemA = tableDataCache.value[a];
            const itemB = tableDataCache.value[b];

            if (itemA.priority !== itemB.priority) {
              return itemA.priority - itemB.priority;
            }
            if (itemA.accessCount !== itemB.accessCount) {
              return itemA.accessCount - itemB.accessCount;
            }
            return itemA.lastAccess - itemB.lastAccess;
          });
          const keysToRemove = sortedKeys.slice(0, Math.ceil(MAX_CACHE_SIZE * 0.2));
          keysToRemove.forEach(key => delete tableDataCache.value[key]);
        }

        tableDataCache.value[cacheKey] = {
          ...responseData,
          timestamp: now,
          lastAccess: now,
          accessCount: 1,
          priority: cachePriority,
        };

        return responseData;
      } catch (err) {
        const errorMessage = '获取表格数据失败';
        error.value = errorMessage;
        ErrorHandler.handleApiError(err, { showMessage: true, logError: true });
        throw err;
      } finally {
        loading.value = false;
      }
    }

    function clearTableDataCache(menuId: string) {
      Object.keys(tableDataCache.value).forEach(key => {
        if (key.startsWith(menuId)) {
          delete tableDataCache.value[key];
        }
      });
    }

    function clearExpiredCache() {
      const now = Date.now();
      Object.keys(tableDataCache.value).forEach(key => {
        if (now - tableDataCache.value[key].timestamp > CACHE_TTL) {
          delete tableDataCache.value[key];
        }
      });
    }

    async function prewarmCache(
      menuId: string,
      apiConfig: ApiConfig | undefined,
      pages: number[] = [1, 2],
      priority: number = 10
    ) {
      const promises = pages.map(page =>
        fetchTableData(menuId, apiConfig, { page, pageSize: 10 }, false, priority)
      );
      await Promise.allSettled(promises);
    }

    function resetCacheStats() {
      cacheStats.value = {
        total: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
        size: 0,
      };
    }

    function clearAllCache() {
      tableDataCache.value = {};
      resetCacheStats();
    }

    async function executeApiOperation(
      menuId: string,
      apiConfig: ApiConfig | undefined,
      operation: (apiConfig: ApiConfig) => Promise<void>,
      successMessage: string,
      errorMessage: string
    ) {
      loading.value = true;
      error.value = null;

      try {
        const config = apiConfig || getDefaultApiConfig(menuId);
        await operation(config);

        clearTableDataCache(menuId);
        showMessage.success(successMessage);
      } catch (err) {
        error.value = errorMessage;
        ErrorHandler.handleApiError(err, { showMessage: true, logError: true });
        throw err;
      } finally {
        loading.value = false;
      }
    }

    return {
      loading,
      error,
      tableDataCache,
      cacheStats,
      getCacheStats,
      updateCacheStats,
      fetchTableData,
      clearTableDataCache,
      clearExpiredCache,
      prewarmCache,
      resetCacheStats,
      clearAllCache,
      executeApiOperation,
    };
  },
  {
    persist: {
      key: 'table-store',
      storage: localStorage,
      paths: ['tableDataCache'],
    },
  }
);
