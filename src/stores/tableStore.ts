import { defineStore } from 'pinia';
import { TableRowData } from '../types/TableConfig';
import { dynamicApi } from '../api/dynamicApi';
import { commonRequest } from '../api/request';
import { ApiConfig } from '../types/MenuConfig';
import { ErrorHandler } from '../utils/errorHandler';
import { showMessage } from '../utils/message';
import { eventBus, AppEvents } from '../utils/eventBus';
import { showLoading, hideLoading } from '../utils/loading';

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

export const useTableStore = defineStore('table', {
  state: () => ({
    loading: false,
    error: null as string | null,
    tableDataCache: {} as Record<string, CachedData>,
    cacheStats: {
      total: 0,
      hits: 0,
      misses: 0,
      hitRate: 0,
      size: 0
    } as CacheStats
  }),
  getters: {
    getCacheStats: (state): CacheStats => {
      const stats = { ...state.cacheStats };
      stats.size = Object.keys(state.tableDataCache).length;
      stats.hitRate = stats.total > 0 ? stats.hits / stats.total : 0;
      return stats;
    }
  },
  actions: {
    updateCacheStats(isHit: boolean) {
      this.$patch((state) => {
        state.cacheStats.total++;
        if (isHit) {
          state.cacheStats.hits++;
        } else {
          state.cacheStats.misses++;
        }
        state.cacheStats.size = Object.keys(state.tableDataCache).length;
        state.cacheStats.hitRate = state.cacheStats.total > 0 
          ? state.cacheStats.hits / state.cacheStats.total 
          : 0;
      });
    },
    
    async fetchTableData(
      menuId: string, 
      apiConfig: ApiConfig | undefined, 
      params?: { page?: number; pageSize?: number }, 
      forceRefresh?: boolean,
      priority?: number
    ) {
      const cacheKey = `${menuId}_${params?.page || 1}_${params?.pageSize || 10}`;
      const now = Date.now();
      const cachePriority = priority || DEFAULT_PRIORITY;
      
      if (!forceRefresh && this.tableDataCache[cacheKey]) {
        const cached = this.tableDataCache[cacheKey];
        if (now - cached.timestamp < CACHE_TTL) {
          this.$patch((state) => {
            state.tableDataCache[cacheKey].accessCount++;
            state.tableDataCache[cacheKey].lastAccess = now;
            state.loading = false;
          });
          this.updateCacheStats(true);
          hideLoading();
          return cached;
        }
      }

      this.updateCacheStats(false);
      
      this.$patch((state) => {
        state.loading = true;
        state.error = null;
      });
      
      showLoading();
      
      try {
        let responseData: { data: TableRowData[]; pagination: any };
        
        if (apiConfig && apiConfig.query) {
          const res = await commonRequest({
            tradeName: apiConfig.query,
            params: {
              page: params?.page || 1,
              pageSize: params?.pageSize || 10
            },
            showLoading: false
          });
          responseData = res.data;
        } else {
          const defaultApiConfig = dynamicApi.getDefaultApiConfig(menuId);
          const res = await dynamicApi.getList(defaultApiConfig, params);
          responseData = res.data;
        }
        
        this.$patch((state) => {
          const cacheKeys = Object.keys(state.tableDataCache);
          if (cacheKeys.length >= MAX_CACHE_SIZE) {
            const sortedKeys = cacheKeys.sort((a, b) => {
              const itemA = state.tableDataCache[a];
              const itemB = state.tableDataCache[b];
              
              if (itemA.priority !== itemB.priority) {
                return itemA.priority - itemB.priority;
              }
              if (itemA.accessCount !== itemB.accessCount) {
                return itemA.accessCount - itemB.accessCount;
              }
              return itemA.lastAccess - itemB.lastAccess;
            });
            const keysToRemove = sortedKeys.slice(0, Math.ceil(MAX_CACHE_SIZE * 0.2));
            keysToRemove.forEach(key => delete state.tableDataCache[key]);
          }
          
          state.tableDataCache[cacheKey] = {
            ...responseData,
            timestamp: now,
            lastAccess: now,
            accessCount: 1,
            priority: cachePriority
          };
        });
        
        eventBus.emit(AppEvents.TABLE_DATA_UPDATED, { menuId, cacheKey, data: responseData });
        
        return responseData;
        
      } catch (error) {
        const errorMessage = '获取表格数据失败';
        this.$patch((state) => {
          state.error = errorMessage;
        });
        ErrorHandler.handleApiError(error, { showMessage: true, logError: true });
        throw error;
      } finally {
        this.$patch((state) => {
          state.loading = false;
        });
        hideLoading();
      }
    },
    
    clearTableDataCache(menuId: string) {
      Object.keys(this.tableDataCache).forEach(key => {
        if (key.startsWith(menuId)) {
          delete this.tableDataCache[key];
        }
      });
      eventBus.emit(AppEvents.TABLE_DATA_CLEARED, { menuId });
    },
    
    clearExpiredCache() {
      const now = Date.now();
      Object.keys(this.tableDataCache).forEach(key => {
        if (now - this.tableDataCache[key].timestamp > CACHE_TTL) {
          delete this.tableDataCache[key];
        }
      });
    },
    
    async prewarmCache(
      menuId: string,
      apiConfig: ApiConfig | undefined,
      pages: number[] = [1, 2],
      priority: number = 10
    ) {
      const promises = pages.map(page => 
        this.fetchTableData(menuId, apiConfig, { page, pageSize: 10 }, false, priority)
      );
      await Promise.allSettled(promises);
    },
    
    resetCacheStats() {
      this.$patch((state) => {
        state.cacheStats = {
          total: 0,
          hits: 0,
          misses: 0,
          hitRate: 0,
          size: 0
        };
      });
    },
    
    clearAllCache() {
      this.$patch((state) => {
        state.tableDataCache = {};
      });
      this.resetCacheStats();
    },
    
    async executeApiOperation(
      menuId: string, 
      apiConfig: ApiConfig | undefined,
      operation: (apiConfig: ApiConfig) => Promise<void>,
      successMessage: string,
      errorMessage: string
    ) {
      this.$patch((state) => {
        state.loading = true;
        state.error = null;
      });
      
      showLoading();
      
      try {
        const config = apiConfig || dynamicApi.getDefaultApiConfig(menuId);
        await operation(config);
        
        this.clearTableDataCache(menuId);
        showMessage.success(successMessage);
      } catch (error) {
        this.$patch((state) => {
          state.error = errorMessage;
        });
        ErrorHandler.handleApiError(error, { showMessage: true, logError: true });
        throw error;
      } finally {
        this.$patch((state) => {
          state.loading = false;
        });
        hideLoading();
      }
    }
  },
  persist: {
    key: 'table-store',
    storage: localStorage,
    paths: ['tableDataCache']
  }
});
