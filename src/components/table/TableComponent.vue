<template>
  <div class="table-component">
    <div class="flex-between mb-4">
      <div class="flex-start gap-2">
        <el-button v-if="selectedRows.length > 0" type="danger" size="small" @click="handleBatchDelete">
          批量删除 ({{ selectedRows.length }})
        </el-button>
        <el-button v-if="selectedRows.length > 0" type="primary" size="small" @click="handleBatchExport">
          批量导出选中
        </el-button>
      </div>
      <div class="flex-end gap-2">
        <el-button size="small" @click="showColumnSetting = true" @keydown.enter="showColumnSetting = true" @keydown.space="showColumnSetting = true" aria-label="列设置">
          <el-icon><Setting /></el-icon>
          列设置
        </el-button>
        <el-button size="small" @click="handleExportAll" @keydown.enter="handleExportAll" @keydown.space="handleExportAll" aria-label="导出全部">
          <el-icon><Download /></el-icon>
          导出全部
        </el-button>
      </div>
    </div>

    <div v-if="props.loading" class="table-loading">
      <div class="flex flex-col items-center justify-center gap-4">
        <el-icon class="is-loading text-indigo-600" style="font-size: 32px;">
          <Refresh />
        </el-icon>
        <span class="text-slate-600">加载中...</span>
        <el-skeleton :rows="5" animated class="w-full max-w-2xl" />
      </div>
    </div>
    <el-table
      v-else
      ref="tableRef"
      :data="tableData"
      :max-height="config.maxHeight || 'calc(100vh - 300px)'"
      :size="config.size || 'default'"
      :border="config.border ?? false"
      :stripe="config.stripe ?? false"
      :show-header="config.showHeader ?? true"
      :show-summary="config.showSummary ?? false"
      :fit="true"
      :virtual="config.virtual ?? true"
      :item-height="config.itemHeight || 50"
      :overscan-count="config.overscan || 30"
      :scrollbar-always-on="false"
      @selection-change="handleSelectionChange"
      class="w-full"
    >
      <el-table-column type="selection" width="55" />
      
      <template v-for="column in visibleColumns" :key="column.prop">
        <el-table-column
          v-if="column.type !== 'actions'"
          :type="column.type === 'index' || column.type === 'selection' || column.type === 'expand' ? column.type : undefined"
          :prop="column.type !== 'index' && column.type !== 'selection' && column.type !== 'expand' ? column.prop : undefined"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :fixed="column.fixed"
          :show-overflow-tooltip="column.showOverflowTooltip ?? true"
        >
          <template #default="scope" v-if="column.type === 'image'">
            <el-image
              :src="scope.row[column.prop]"
              :preview-src-list="[scope.row[column.prop]]"
              fit="cover"
              lazy
              class="w-12 h-12 rounded-md"
              width="48"
              height="48"
            />
          </template>
          <template #default="scope" v-else-if="column.type === 'date' || column.type === 'datetime'">
            <span>{{ formatDate(scope.row[column.prop]) }}</span>
          </template>
          <template #default="scope" v-else-if="column.type === 'switch' || (column.type === 'component' && column.component === 'el-switch')">
            <el-switch
              v-model="scope.row[column.prop]"
              size="small"
            />
          </template>
          <template #default="scope" v-else-if="column.type === 'badge'">
            <el-tag
              :type="column.props?.type || 'info'"
              size="small"
            >
              {{ scope.row[column.prop] }}
            </el-tag>
          </template>
          <template #default="scope" v-else-if="column.formatter">
            <span>{{ formatWithFormatter(column.formatter, scope.row, column, scope.row[column.prop], scope.$index) }}</span>
          </template>
          <template #default="scope" v-else>
            <span>{{ scope.row[column.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="column.prop"
          :label="column.label"
          :width="column.width || '140px'"
          :min-width="column.minWidth"
          :align="column.align || 'center'"
          :fixed="column.fixed"
        >
          <template #default="scope">
            <el-button
              v-for="action in column.actions"
              :key="action.label"
              :type="action.type"
              :size="config.size === 'small' ? 'small' : 'small'"
              link
              @click="handleAction(action.label, scope.row)"
            >
              {{ action.label }}
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    
    <div v-if="config.pagination" class="mt-4 flex justify-end">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        :layout="(pagination as any).layout || 'total, sizes, prev, pager, next'"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
      />
    </div>

    <el-dialog v-model="showColumnSetting" title="列设置" width="400px">
      <el-checkbox-group v-model="visibleColumnProps">
        <div class="space-y-2">
          <el-checkbox v-for="column in config.columns" :key="column.prop" :label="column.prop">
            {{ column.label }}
          </el-checkbox>
        </div>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="showColumnSetting = false">取消</el-button>
        <el-button type="primary" @click="saveColumnSetting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { Setting, Download, Refresh } from '@element-plus/icons-vue';
import { loadXLSX } from '../../utils/lazyLoad';
import { TableConfig, TableRowData, TableColumn } from '../../types/TableConfig';

const props = defineProps<{
  config: TableConfig;
  data?: TableRowData[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'edit', row: TableRowData): void;
  (e: 'delete', row: TableRowData): void;
  (e: 'page-change', page: number, pageSize: number): void;
  (e: 'batch-delete', rows: TableRowData[]): void;
}>();

// 响应式数据
const tableRef = ref();
const tableData = ref<TableRowData[]>([]);
const selectedRows = ref<TableRowData[]>([]);
const showColumnSetting = ref(false);
const visibleColumnProps = ref<string[]>([]);

// 分页配置
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  total: 0
});

// 计算属性
const columnSettingKey = computed(() => `table-columns-${props.config.columns.map(c => c.prop).join('-')}`);

const visibleColumns = computed(() => {
  if (visibleColumnProps.value.length === 0) {
    return props.config.columns;
  }
  return props.config.columns.filter(col => visibleColumnProps.value.includes(col.prop));
});

// 工具函数
const formatDate = (value: any): string => {
  if (!value) return '';
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  return String(value);
};

const formatWithFormatter = (formatter: any, row: any, column: TableColumn, cellValue: any, index: number): string => {
  if (typeof formatter === 'function') {
    return formatter(row, column, cellValue, index);
  }
  if (typeof formatter === 'string') {
    try {
      const fn = new Function('row', 'column', 'cellValue', 'index', `return (${formatter})(row, column, cellValue, index)`);
      return fn(row, column, cellValue, index);
    } catch (error) {
      console.error('Error evaluating formatter:', error);
      return cellValue;
    }
  }
  return cellValue;
};

// 表格操作处理
const handleAction = (label: string, row: TableRowData) => {
  if (label === '编辑') {
    emit('edit', row);
  } else if (label === '删除') {
    emit('delete', row);
  }
};

const handleSelectionChange = (selection: TableRowData[]) => {
  selectedRows.value = selection;
};

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条数据吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    emit('batch-delete', selectedRows.value);
    selectedRows.value = [];
    ElMessage.success('删除成功');
  } catch {
    // 取消删除操作
  }
};

const prepareExportData = (data: TableRowData[]) => {
  return data.map(row => {
    const result: Record<string, any> = {};
    visibleColumns.value.forEach(col => {
      if (col.type !== 'actions' && col.prop) {
        result[col.label] = row[col.prop];
      }
    });
    return result;
  });
};

const exportToExcel = async (data: TableRowData[], filename: string) => {
  try {
    const XLSX = await loadXLSX();
    const exportData = prepareExportData(data);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('Export failed:', error);
    ElMessage.error('导出失败，请重试');
  }
};

const handleExportAll = async () => {
  await exportToExcel(tableData.value, '导出数据');
};

const handleBatchExport = async () => {
  await exportToExcel(selectedRows.value, '选中数据');
};

// 列设置
const saveColumnSetting = () => {
  localStorage.setItem(columnSettingKey.value, JSON.stringify(visibleColumnProps.value));
  showColumnSetting.value = false;
  ElMessage.success('列设置已保存');
};

const loadColumnSetting = () => {
  const saved = localStorage.getItem(columnSettingKey.value);
  if (saved) {
    try {
      visibleColumnProps.value = JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse column settings:', error);
      visibleColumnProps.value = props.config.columns.map(col => col.prop);
    }
  } else {
    visibleColumnProps.value = props.config.columns.map(col => col.prop);
  }
};

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  emit('page-change', pagination.value.currentPage, size);
};

const handleCurrentChange = (current: number) => {
  pagination.value.currentPage = current;
  emit('page-change', current, pagination.value.pageSize);
};

// 响应式更新
watch(() => props.data || props.config.data, (newData) => {
  tableData.value = newData || [];
}, { deep: true, immediate: true });

watch(() => props.config.pagination, (newPagination) => {
  if (newPagination && typeof newPagination === 'object') {
    pagination.value = {
      ...pagination.value,
      ...newPagination
    };
  }
}, { deep: true });

watch(() => props.config.columns, () => {
  loadColumnSetting();
}, { deep: true });

// 生命周期
onMounted(() => {
  if (props.config.pagination && typeof props.config.pagination === 'object') {
    pagination.value = {
      ...pagination.value,
      ...props.config.pagination
    };
  }
  loadColumnSetting();
});
</script>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .table-component {
    padding: 0 12px;
  }
  
  .flex-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .flex-start,
  .flex-end {
    width: 100%;
    justify-content: space-between;
  }
  
  .el-table {
    font-size: 14px;
  }
  
  .el-table-column {
    min-width: 80px;
  }
  
  .el-pagination {
    justify-content: center !important;
  }
}

@media (max-width: 480px) {
  .el-table {
    font-size: 12px;
  }
  
  .el-button {
    font-size: 12px;
    padding: 4px 8px;
  }
  
  .el-table-column {
    min-width: 60px;
  }
  
  .el-table__header-wrapper,
  .el-table__body-wrapper {
    overflow-x: auto;
  }
}
</style>
