import { computed, ref, watch } from 'vue';
import { useMenuStore } from '../stores/menuStore';
import { useTableStore } from '../stores/tableStore';
import { TableRowData } from '../types/TableConfig';

import { ComputedRef } from 'vue';

export interface UseTableOptions {
  menuId: string | ComputedRef<string>;
  initialParams?: { page?: number; pageSize?: number };
  autoLoad?: boolean;
}

export interface UseTableReturn {
  tableData: ComputedRef<TableRowData[]>;
  pagination: ComputedRef<any>;
  loading: ComputedRef<boolean>;
  error: ComputedRef<string | null>;
  fetchData: (params?: { page?: number; pageSize?: number }, forceRefresh?: boolean) => Promise<void>;
  handlePageChange: (page: number, pageSize: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTable(options: UseTableOptions): UseTableReturn {
  const { menuId, initialParams = { page: 1, pageSize: 10 }, autoLoad = true } = options;
  const menuStore = useMenuStore();
  const tableStore = useTableStore();

  // 维护独立的表格状态
  const tableData = ref<TableRowData[]>([]);
  const pagination = ref({
    currentPage: initialParams.page || 1,
    pageSize: initialParams.pageSize || 10,
    pageSizes: [10, 20, 50, 100],
    total: 0
  });
  const loading = computed(() => tableStore.loading);
  const error = computed(() => tableStore.error);
  
  // 获取实际的 menuId 值
  const getMenuId = (): string => {
    return typeof menuId === 'string' ? menuId : menuId.value;
  };

  const fetchData = async (params?: { page?: number; pageSize?: number }, forceRefresh: boolean = false) => {
    const currentMenuId = getMenuId();
    if (!currentMenuId) {
      return;
    }
    
    try {
      const menu = menuStore.getMenuById(currentMenuId) || menuStore.currentMenu;
      const response = await tableStore.fetchTableData(
        currentMenuId,
        menu?.api,
        params || initialParams,
        forceRefresh
      );
      
      if (response) {
        // 按照用户要求，从dataList获取表格数据
        const responseAny = response as any;
        tableData.value = responseAny.dataList || response.data || [];
        
        // 确保pagination.total是数字
        if (response.pagination?.total) {
          pagination.value.total = response.pagination.total;
        } else {
          pagination.value.total = 0;
        }
      }
    } catch (error) {
      console.error('Failed to fetch table data:', error);
      tableData.value = [];
    }
  };

  const handlePageChange = async (page: number, pageSize: number) => {
    pagination.value.currentPage = page;
    pagination.value.pageSize = pageSize;
    await fetchData({ page, pageSize });
  };

  const refresh = async () => {
    await fetchData(initialParams, true);
  };

  // 监听 menuId 变化，重新加载数据
  if (autoLoad) {
    watch(() => getMenuId(), (newMenuId) => {
      if (newMenuId) {
        fetchData(initialParams, true);
      }
    });

    // 自动加载数据
    fetchData(initialParams);
  }

  return {
    tableData: computed(() => tableData.value),
    pagination: computed(() => pagination.value),
    loading,
    error,
    fetchData,
    handlePageChange,
    refresh
  };
}
