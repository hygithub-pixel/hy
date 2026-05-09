<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">{{ config.title }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ config.description }}</p>
      </div>
    </div>

    <div class="p-6">
      <slot name="toolbar">
        <div class="flex items-center gap-3 mb-4">
          <template v-for="btn in toolbarButtons" :key="btn.action">
            <component
              :is="getButtonComponent(btn)"
              v-bind="getButtonProps(btn)"
              :disabled="getButtonDisabled(btn)"
              @click="handleAction(btn.action)"
            >
              {{ btn.text }}
            </component>
          </template>
        </div>
      </slot>

      <slot name="search">
        <div class="flex items-center gap-4 mb-6">
          <template v-for="field in searchFields" :key="field.name">
            <component
              :is="getComponent(field.component)"
              v-model:value="searchData[field.name]"
              v-bind="getFieldProps(field)"
            >
              <template v-if="hasOptions(field.component)">
                <component
                  :is="getOptionComponent(field.component)"
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </component>
              </template>
            </component>
          </template>

          <template v-for="btn in searchActions" :key="btn.action">
            <component
              :is="getButtonComponent(btn)"
              v-bind="getButtonProps(btn)"
              @click="handleAction(btn.action)"
            >
              {{ btn.text }}
            </component>
          </template>
        </div>
      </slot>

      <slot name="table">
        <DynamicTable
          :columns="config.columns"
          :data-source="tableData"
          :pagination="pagination"
          :row-selection="rowSelection"
          :row-actions="rowActionButtons"
          :loading="loading"
          @change="handleTableChange"
          @action="handleRowAction"
        />
      </slot>
    </div>

    <slot name="form"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import type { ModuleConfig, ButtonItem } from '../types/moduleConfig';
import DynamicTable from './DynamicTable.vue';
import { useModuleHooks } from '../composables/useModuleHooks';

interface Props {
  config: ModuleConfig;
}

const props = defineProps<Props>();

const { executeHook } = useModuleHooks();

const loading = ref(false);
const tableData = ref<any[]>([]);
const selectedRowKeys = ref<any[]>([]);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const searchData = reactive<Record<string, any>>({});

const toolbarButtons = computed(() => props.config.buttons?.toolbar || []);
const rowActionButtons = computed(() => props.config.buttons?.rowActions || []);
const searchFields = computed(() => props.config.search?.fields || []);
const searchActions = computed(() => props.config.search?.actions || []);

const componentMap: Record<string, any> = {
  'a-input': 'a-input',
  'a-input-password': 'a-input-password',
  'a-textarea': 'a-textarea',
  'a-select': 'a-select',
  'a-radio-group': 'a-radio-group',
  'a-checkbox-group': 'a-checkbox-group',
  'a-date-picker': 'a-date-picker',
  'a-range-picker': 'a-range-picker',
  'a-upload': 'a-upload',
  'a-switch': 'a-switch',
};

const buttonComponentMap: Record<string, string> = {
  'a-button': 'a-button',
};

const optionComponents: Record<string, string> = {
  'a-select': 'a-select-option',
  'a-radio-group': 'a-radio',
  'a-checkbox-group': 'a-checkbox',
};

const getComponent = (componentName: string) => {
  return componentMap[componentName] || 'a-input';
};

const getButtonComponent = (btn: ButtonItem) => {
  return buttonComponentMap[btn.component] || 'a-button';
};

const getOptionComponent = (componentName: string) => {
  return optionComponents[componentName] || 'a-select-option';
};

const hasOptions = (componentName: string) => {
  return ['a-select', 'a-radio-group', 'a-checkbox-group'].includes(componentName);
};

const getFieldProps = (field: any) => {
  const { component, name, label, rules, options, ...rest } = field;
  return rest;
};

const getButtonProps = (btn: ButtonItem) => {
  const { component, text, action, disabledWhen, ...rest } = btn;
  return rest;
};

const getButtonDisabled = (btn: ButtonItem) => {
  if (!btn.disabledWhen) return false;
  if (btn.disabledWhen === 'noSelection') {
    return selectedRowKeys.value.length === 0;
  }
  return false;
};

const rowSelection = computed(() => ({
  type: 'checkbox' as const,
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: any[]) => {
    selectedRowKeys.value = keys;
  },
}));

const mockData = [
  { id: 1, username: 'admin', nickname: '管理员', email: 'admin@example.com', department: '技术部', role: '超级管理员', status: 1, createTime: '2024-05-20 10:30:00' },
  { id: 2, username: 'zhangsan', nickname: '张三', email: 'zhangsan@example.com', department: '产品部', role: '产品经理', status: 1, createTime: '2024-05-19 09:15:00' },
  { id: 3, username: 'lisi', nickname: '李四', email: 'lisi@example.com', department: '设计部', role: '设计师', status: 1, createTime: '2024-05-18 14:22:00' },
  { id: 4, username: 'wangwu', nickname: '王五', email: 'wangwu@example.com', department: '运营部', role: '运营专员', status: 1, createTime: '2024-05-17 11:05:00' },
  { id: 5, username: 'zhaoliu', nickname: '赵六', email: 'zhaoliu@example.com', department: '技术部', role: '开发工程师', status: 0, createTime: '2024-05-16 16:40:00' },
  { id: 6, username: 'sunqi', nickname: '孙七', email: 'sunqi@example.com', department: '测试部', role: '测试工程师', status: 0, createTime: '2024-05-15 10:20:00' },
];

const loadData = async () => {
  loading.value = true;
  try {
    let params = { ...searchData };
    
    if (props.config.hooks?.beforeLoad) {
      params = executeHook(props.config.hooks.beforeLoad, params) || params;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    tableData.value = mockData;
    pagination.total = mockData.length;
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  loadData();
};

const handleAction = (action: string) => {
  switch (action) {
    case 'create':
      emit('create');
      break;
    case 'search':
      loadData();
      break;
    case 'reset':
      Object.keys(searchData).forEach(key => {
        searchData[key] = undefined;
      });
      loadData();
      break;
    case 'batchDelete':
      console.log('Batch delete:', selectedRowKeys.value);
      break;
    case 'export':
      console.log('Export');
      break;
  }
};

const handleRowAction = (action: string, record: any) => {
  switch (action) {
    case 'edit':
      emit('edit', record);
      break;
    case 'delete':
      console.log('Delete:', record);
      break;
    case 'view':
      emit('view', record);
      break;
  }
};

const emit = defineEmits<{
  (e: 'create'): void;
  (e: 'edit', record: any): void;
  (e: 'view', record: any): void;
}>();

onMounted(() => {
  loadData();
});

defineExpose({
  loadData,
  getSearchData: () => ({ ...searchData }),
});
</script>
