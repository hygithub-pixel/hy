<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-2">
        <a-button
          v-if="selectedRows.length > 0"
          danger
          size="small"
          @click="handleBatchDelete"
        >
          批量删除 ({{ selectedRows.length }})
        </a-button>
        <a-button
          v-if="selectedRows.length > 0"
          type="primary"
          size="small"
          @click="handleBatchExport"
        >
          批量导出选中
        </a-button>
      </div>
      <div class="flex items-center gap-2">
        <a-button
          size="small"
          aria-label="列设置"
          @click="showColumnSetting = true"
        >
          <template #icon><SettingOutlined /></template>
          列设置
        </a-button>
        <a-button
          size="small"
          aria-label="导出全部"
          @click="handleExportAll"
        >
          <template #icon><DownloadOutlined /></template>
          导出全部
        </a-button>
      </div>
    </div>

    <div v-if="props.loading" class="py-10" aria-live="polite">
      <div class="flex flex-col items-center justify-center gap-4">
        <LoadingOutlined style="font-size: 32px; color: var(--ant-primary-color);" spin aria-hidden="true" />
        <span class="text-slate-600">加载中...</span>
        <a-skeleton :rows="5" active class="w-full max-w-2xl" />
      </div>
    </div>
    <a-table
      v-else
      :data-source="tableData"
      :scroll="{ y: 500 }"
      :size="config.size || 'middle'"
      :bordered="config.border ?? false"
      :pagination="false"
      :row-key="(record: any) => record.id || record.key || String(Math.random())"
      :row-selection="rowSelection"
      class="w-full"
    >
      <template v-for="column in visibleColumns" :key="column.prop">
        <a-table-column
          v-if="column.type !== 'actions'"
          :title="column.label"
          :data-index="column.prop === 'index' ? undefined : column.prop"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :fixed="column.fixed"
        >
          <template v-if="column.type === 'index'" #default="{ index: rowIndex }">
            <span>{{ (pagination.currentPage - 1) * pagination.pageSize + rowIndex + 1 }}</span>
          </template>
          <template v-else-if="column.type === 'image'" #default="{ record }">
            <a-image
              v-if="record[column.prop]"
              :src="record[column.prop]"
              :preview-mask="false"
              fit="cover"
              fallback="/placeholder.png"
              class="w-12 h-12 rounded-md"
              :width="column.width ? parseInt(column.width) : 48"
              :height="column.width ? parseInt(column.width) : 48"
            />
            <span v-else class="text-gray-400">无图片</span>
          </template>
          <template
            v-else-if="column.type === 'date' || column.type === 'datetime'"
            #default="{ record }"
          >
            <span>{{ formatDate(record[column.prop]) }}</span>
          </template>
          <template
            v-else-if="column.type === 'switch'"
            #default="{ record }"
          >
            <a-switch v-model:checked="record[column.prop]" size="small" disabled />
          </template>
          <template v-else-if="column.type === 'badge'" #default="{ record }">
            <a-tag :color="column.props?.color || 'default'">
              {{ record[column.prop] }}
            </a-tag>
          </template>
          <template v-else-if="column.formatter" #default="{ record, index }">
            <span>{{
              formatWithFormatter(
                column.formatter,
                record,
                column,
                record[column.prop],
                index
              )
            }}</span>
          </template>
          <template v-else #default="{ record }">
            <span>{{ record[column.prop] }}</span>
          </template>
        </a-table-column>
        <a-table-column
          v-else
          :title="column.label"
          :width="column.width || '140px'"
          :min-width="column.minWidth"
          :align="column.align || 'center'"
          :fixed="column.fixed"
        >
          <template #default="{ record }">
            <div class="flex gap-2 justify-center">
              <template v-for="action in column.actions" :key="action.id">
                <a-button
                  :type="action.type === 'primary' ? 'primary' : action.type === 'danger' ? 'danger' : 'link'"
                  size="small"
                  @click="handleAction(action, record)"
                >
                  {{ action.label }}
                </a-button>
              </template>
            </div>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <div v-if="config.pagination" class="mt-4 flex justify-end">
      <a-pagination
        v-model:current="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :show-total="(total: number) => `共 ${total} 条`"
        @change="handlePageChange"
        @showSizeChange="handleSizeChange"
      />
    </div>

    <a-modal v-model:open="showColumnSetting" title="列设置" width="400px">
      <a-checkbox-group v-model:value="visibleColumnProps">
        <div class="space-y-2">
          <a-checkbox v-for="column in config.columns" :key="column.prop" :value="column.prop">
            {{ column.label }}
          </a-checkbox>
        </div>
      </a-checkbox-group>
      <template #footer>
        <a-button @click="showColumnSetting = false">取消</a-button>
        <a-button type="primary" @click="saveColumnSetting">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { SettingOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { loadXLSX } from '../../utils/lazyLoad';
import { showMessage } from '../../utils/message';
import { TableConfig, TableRowData, TableColumn, TableAction } from '../../types/TableConfig';

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

const tableData = ref<TableRowData[]>([]);
const selectedRowKeys = ref<(string | number)[]>([]);
const selectedRows = ref<TableRowData[]>([]);
const showColumnSetting = ref(false);
const visibleColumnProps = ref<string[]>([]);

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100] as (number | string)[],
  total: 0,
});

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: TableRowData[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

const columnSettingKey = computed(
  () => `table-columns-${props.config.columns.map(c => c.prop).join('-')}`
);

const visibleColumns = computed(() => {
  if (visibleColumnProps.value.length === 0) {
    return props.config.columns;
  }
  return props.config.columns.filter(col => visibleColumnProps.value.includes(col.prop));
});

const formatDate = (value: any, options?: Intl.DateTimeFormatOptions): string => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }).format(date);
};

const formatWithFormatter = (
  formatter: any,
  row: any,
  column: TableColumn,
  cellValue: any,
  index: number
): string => {
  if (typeof formatter === 'function') {
    return formatter(row, column, cellValue, index);
  }
  if (typeof formatter === 'string') {
    try {
      const fn = new Function(
        'row',
        'column',
        'cellValue',
        'index',
        `return (${formatter})(row, column, cellValue, index)`
      );
      return fn(row, column, cellValue, index);
    } catch (error) {
      console.error('Error evaluating formatter:', error);
      return cellValue;
    }
  }
  return cellValue;
};

const handleAction = (action: TableAction, row: TableRowData) => {
  if (action.handler) {
    action.handler(row, action);
  } else if (action.id === 'edit') {
    emit('edit', row);
  } else if (action.id === 'delete') {
    emit('delete', row);
  }
};

const handleBatchDelete = async () => {
  emit('batch-delete', selectedRows.value);
  selectedRowKeys.value = [];
  selectedRows.value = [];
  showMessage.success('删除成功');
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
    showMessage.success('导出成功');
  } catch (error) {
    console.error('Export failed:', error);
    showMessage.error('导出失败，请重试');
  }
};

const handleExportAll = async () => {
  await exportToExcel(tableData.value, '导出数据');
};

const handleBatchExport = async () => {
  await exportToExcel(selectedRows.value, '选中数据');
};

const saveColumnSetting = () => {
  try {
    localStorage.setItem(columnSettingKey.value, JSON.stringify(visibleColumnProps.value));
  } catch {
    // ignore
  }
  showColumnSetting.value = false;
  showMessage.success('列设置已保存');
};

const loadColumnSetting = () => {
  try {
    const saved = localStorage.getItem(columnSettingKey.value);
    if (saved) {
      visibleColumnProps.value = JSON.parse(saved);
    } else {
      visibleColumnProps.value = props.config.columns.map(col => col.prop);
    }
  } catch {
    visibleColumnProps.value = props.config.columns.map(col => col.prop);
  }
};

const handleSizeChange = (_current: number, size: number) => {
  pagination.value.pageSize = size;
  emit('page-change', pagination.value.currentPage, size);
};

const handlePageChange = (page: number, pageSize: number) => {
  pagination.value.currentPage = page;
  pagination.value.pageSize = pageSize;
  emit('page-change', page, pageSize);
};

watch(
  () => props.data || props.config.data,
  newData => {
    tableData.value = newData || [];
  },
  { deep: true, immediate: true }
);

watch(
  () => props.config.pagination,
  newPagination => {
    if (newPagination && typeof newPagination === 'object') {
      pagination.value = {
        ...pagination.value,
        ...newPagination,
      };
    }
  },
  { deep: true }
);

onMounted(() => {
  if (props.config.pagination && typeof props.config.pagination === 'object') {
    pagination.value = {
      ...pagination.value,
      ...props.config.pagination,
    };
  }
  loadColumnSetting();
});
</script>
