<template>
  <a-table
    :columns="processedColumns"
    :data-source="dataSource"
    :pagination="pagination"
    :row-selection="rowSelection"
    :scroll="{ x: scrollX }"
    :loading="loading"
    row-key="id"
    @change="handleTableChange"
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import {
  CheckCircleOutlined,
  CiCircleOutlined,
} from '@ant-design/icons-vue';
import { Tag, Space, Button } from 'ant-design-vue';
import type { ColumnConfig } from '../types/moduleConfig';

interface Props {
  columns: ColumnConfig[];
  dataSource: any[];
  pagination?: any;
  rowSelection?: any;
  loading?: boolean;
  rowActions?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  dataSource: () => [],
  pagination: false,
  rowSelection: undefined,
  loading: false,
  rowActions: () => [],
});

const emit = defineEmits<{
  (e: 'change', pagination: any, filters: any, sorter: any): void;
  (e: 'action', action: string, record: any): void;
}>();

const processedColumns = computed(() => {
  const cols = [...props.columns];
  
  const actionIndex = cols.findIndex(col => col.key === 'action');
  if (actionIndex !== -1 && props.rowActions.length > 0) {
    cols[actionIndex] = {
      ...cols[actionIndex],
      customRender: ({ record }: any) => {
        return h(Space, {}, () =>
          props.rowActions.map((btn: any) =>
            h(Button, {
              size: btn.size || 'small',
              type: 'text',
              danger: btn.danger,
              onClick: () => emit('action', btn.action, record),
            }, () => btn.text)
          )
        );
      },
    };
  }

  return cols.map(col => {
    if (col.dataIndex === 'status') {
      return {
        ...col,
        customRender: ({ text }: any) => {
          const status = text === 1;
          return h('span', {
            class: `flex items-center gap-1 ${status ? 'text-green-500' : 'text-gray-400'}`,
          }, [
            h(status ? CheckCircleOutlined : CiCircleOutlined),
            h('span', {}, status ? '启用' : '禁用'),
          ]);
        },
      };
    }
    
    if (col.dataIndex === 'role') {
      return {
        ...col,
        customRender: ({ text }: any) => {
          const colorMap: Record<string, string> = {
            '超级管理员': 'purple',
            '产品经理': 'cyan',
            '设计师': 'green',
            '运营专员': 'blue',
            '开发工程师': 'orange',
            '测试工程师': 'geekblue',
          };
          return h(Tag, { color: colorMap[text] || 'default' }, () => text);
        },
      };
    }

    return col;
  });
});

const scrollX = computed(() => {
  let total = 0;
  props.columns.forEach(col => {
    if (col.width) {
      total += typeof col.width === 'number' ? col.width : 150;
    }
  });
  return Math.max(total, 800);
});

const handleTableChange = (pag: any, filters: any, sorter: any) => {
  emit('change', pag, filters, sorter);
};
</script>
