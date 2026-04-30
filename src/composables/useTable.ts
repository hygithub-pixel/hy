import { computed, ref, watch } from 'vue';
import { useMenuStore } from '../stores/menuStore';
import { useTableStore } from '../stores/tableStore';
import { TableRowData } from '../types/TableConfig';

import { ComputedRef } from 'vue';

/**
 * 表格配置选项
 */
export interface UseTableOptions {
  /** 菜单ID，可以是字符串或计算属性 */
  menuId: string | ComputedRef<string>;
  /** 初始参数，包含页码和每页条数 */
  initialParams?: { page?: number; pageSize?: number };
  /** 是否自动加载数据，默认true */
  autoLoad?: boolean;
}

/**
 * 表格返回值
 */
export interface UseTableReturn {
  /** 表格数据 */
  tableData: ComputedRef<TableRowData[]>;
  /** 分页信息 */
  pagination: ComputedRef<any>;
  /** 加载状态 */
  loading: ComputedRef<boolean>;
  /** 错误信息 */
  error: ComputedRef<string | null>;
  /** 加载数据方法 */
  fetchData: (
    params?: { page?: number; pageSize?: number },
    forceRefresh?: boolean
  ) => Promise<void>;
  /** 分页变化处理方法 */
  handlePageChange: (page: number, pageSize: number) => Promise<void>;
  /** 刷新数据方法 */
  refresh: () => Promise<void>;
}

/**
 * 表格相关组合函数
 * @param options - 配置选项
 * @returns 表格相关状态和方法
 * @example
 * ```typescript
 * const { tableData, pagination, loading, fetchData } = useTable({
 *   menuId: 'user-list',
 *   initialParams: { page: 1, pageSize: 20 }
 * });
 * 
 * // 手动加载数据
 * await fetchData({ page: 1, pageSize: 20 });
 * ```
 */
export function useTable(options: UseTableOptions): UseTableReturn {
  const { menuId, initialParams = { page: 1, pageSize: 10 }, autoLoad = true } = options;
  const menuStore = useMenuStore();
  const tableStore = useTableStore();

  /** 表格数据 */
  const tableData = ref<TableRowData[]>([]);
  /** 分页信息 */
  const pagination = ref({
    currentPage: initialParams.page || 1,
    pageSize: initialParams.pageSize || 10,
    pageSizes: [10, 20, 50, 100],
    total: 0,
  });

  /**
   * 获取实际的 menuId 值
   * @returns menuId字符串
   */
  const getMenuId = (): string => {
    return typeof menuId === 'string' ? menuId : menuId.value;
  };

  /**
   * 加载表格数据
   * @param params - 分页参数
   * @param forceRefresh - 是否强制刷新
   */
  const fetchData = async (
    params?: { page?: number; pageSize?: number },
    forceRefresh: boolean = false
  ) => {
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
        const responseData = response as any;
        tableData.value = responseData.data?.dataList || responseData.data?.data || responseData.dataList || [];
        if (responseData.data?.pagination?.total !== undefined) {
          pagination.value.total = responseData.data.pagination.total;
        } else if (responseData.pagination?.total !== undefined) {
          pagination.value.total = responseData.pagination.total;
        } else {
          pagination.value.total = 0;
        }
      }
    } catch (error) {
      console.error('Failed to fetch table data:', error);
      tableData.value = [];
    }
  };

  /**
   * 处理分页变化
   * @param page - 当前页码
   * @param pageSize - 每页条数
   */
  const handlePageChange = async (page: number, pageSize: number) => {
    pagination.value.currentPage = page;
    pagination.value.pageSize = pageSize;
    await fetchData({ page, pageSize });
  };

  /**
   * 刷新表格数据
   */
  const refresh = async () => {
    await fetchData(initialParams, true);
  };

  // 监听 menuId 变化，重新加载数据
  if (autoLoad) {
    watch(
      () => getMenuId(),
      newMenuId => {
        if (newMenuId) {
          fetchData(initialParams, true);
        }
      }
    );

    // 自动加载数据
    fetchData(initialParams);
  }

  return {
    /** 表格数据 */
    tableData: computed(() => tableData.value),
    /** 分页信息 */
    pagination: computed(() => pagination.value),
    /** 加载状态 */
    loading: computed(() => tableStore.loading),
    /** 错误信息 */
    error: computed(() => tableStore.error),
    /** 加载数据方法 */
    fetchData,
    /** 分页变化处理方法 */
    handlePageChange,
    /** 刷新数据方法 */
    refresh,
  };
}
