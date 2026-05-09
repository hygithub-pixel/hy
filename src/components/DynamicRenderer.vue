<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">{{ config.title }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ config.description }}</p>
      </div>
    </div>

    <div class="p-6">
      <div class="flex items-center gap-4 mb-6">
        <component
          v-for="field in searchFields"
          :key="field.name"
          :is="getComponent(field.component)"
          v-model:value="searchData[field.name]"
          v-bind="getFieldProps(field)"
          :placeholder="field.placeholder"
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

        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button @click="handleReset">重置</a-button>
      </div>

      <div class="flex items-center gap-3 mb-4">
        <a-button
          v-for="btn in toolbarButtons"
          :key="btn.action"
          :type="btn.type"
          :disabled="getButtonDisabled(btn)"
          @click="handleAction(btn.action)"
        >
          {{ btn.text }}
        </a-button>
      </div>

      <a-table
        :columns="config.columns"
        :data-source="tableData"
        :pagination="pagination"
        :loading="loading"
        :row-selection="rowSelection"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <span :class="record.status === 1 ? 'text-green-500' : 'text-gray-400'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button
                v-for="btn in rowActionButtons"
                :key="btn.action"
                type="text"
                :size="btn.size"
                :danger="btn.danger"
                @click="handleAction(btn.action, record)"
              >
                {{ btn.text }}
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import type { ModuleConfig } from '../types/moduleConfig';
import { useModuleHooks } from '../composables/useModuleHooks';
import { get } from '../utils/request';

interface Props {
  config: ModuleConfig;
}

const props = defineProps<Props>();
const router = useRouter();
const { executeHook } = useModuleHooks();

const loading = ref(false);
const tableData = ref<any[]>([]);
const selectedRowKeys = ref<any[]>([]);
const searchData = reactive<Record<string, any>>({});

const searchFields = computed(() => props.config.search?.fields || []);
const toolbarButtons = computed(() => props.config.buttons?.toolbar || []);
const rowActionButtons = computed(() => props.config.buttons?.rowActions || []);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const rowSelection = computed(() => ({
  type: 'checkbox' as const,
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: any[]) => {
    selectedRowKeys.value = keys;
  },
}));

const getComponent = (componentName: string) => componentName || 'a-input';
const getOptionComponent = (componentName: string) => {
  const map: Record<string, string> = {
    'a-select': 'a-select-option',
    'a-radio-group': 'a-radio',
    'a-checkbox-group': 'a-checkbox',
  };
  return map[componentName] || 'a-select-option';
};
const hasOptions = (componentName: string) => ['a-select', 'a-radio-group', 'a-checkbox-group'].includes(componentName);
const getFieldProps = (field: any) => {
  const { component, name, label, rules, options, ...rest } = field;
  return rest;
};

const getButtonDisabled = (btn: any) => {
  if (!btn.disabledWhen) return false;
  if (btn.disabledWhen === 'noSelection') return selectedRowKeys.value.length === 0;
  return false;
};

const loadData = async () => {
  loading.value = true;
  try {
    let params: Record<string, any> = {
      ...searchData,
      current: pagination.current,
      pageSize: pagination.pageSize,
    };

    if (props.config.hooks?.beforeLoad) {
      params = await executeHook(props.config.hooks.beforeLoad, params) || params;
    }

    const apiConfig = props.config.apis?.list;
    if (apiConfig) {
      const response = await get<{ list: any[]; total: number }>(apiConfig.path, params);
      tableData.value = response.data.list;
      pagination.total = response.data.total;
    }
  } catch (error: any) {
    message.error(error.message || '加载数据失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.current = 1;
  loadData();
};

const handleReset = () => {
  Object.keys(searchData).forEach(key => {
    searchData[key] = undefined;
  });
  loadData();
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  loadData();
};

const handleAction = async (action: string, record?: any) => {
  switch (action) {
    case 'create':
      router.push({ path: `/${props.config.module}s/add` });
      break;
    case 'edit':
      if (record) router.push({ path: `/${props.config.module}s/edit/${record.id}` });
      break;
    case 'delete':
      if (record) {
        const apiConfig = props.config.apis?.delete;
        if (apiConfig) {
          const url = apiConfig.path.replace('{id}', record.id);
          const { del } = await import('../utils/request');
          try {
            await del(url);
            message.success('删除成功');
            loadData();
          } catch (error: any) {
            message.error(error.message || '删除失败');
          }
        }
      }
      break;
    case 'view':
      if (record) router.push({ path: `/${props.config.module}s/view/${record.id}` });
      break;
    case 'batchDelete':
      if (selectedRowKeys.value.length > 0) {
        const apiConfig = props.config.apis?.delete;
        if (apiConfig) {
          const { del } = await import('../utils/request');
          try {
            for (const id of selectedRowKeys.value) {
              const url = apiConfig.path.replace('{id}', id);
              await del(url);
            }
            message.success('批量删除成功');
            selectedRowKeys.value = [];
            loadData();
          } catch (error: any) {
            message.error(error.message || '批量删除失败');
          }
        }
      }
      break;
    case 'search':
      handleSearch();
      break;
    case 'reset':
      handleReset();
      break;
  }
};

onMounted(loadData);

defineExpose({ loadData });
</script>
