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
import type { ModuleConfig } from '../types/moduleConfig';
import { useModuleHooks } from '../composables/useModuleHooks';

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

const generateMockData = () => {
  const module = props.config.module;
  const templates: Record<string, any[]> = {
    user: [
      { id: 1, username: 'admin', nickname: '管理员', email: 'admin@example.com', department: '技术部', role: '超级管理员', status: 1, createTime: '2024-05-20 10:30:00' },
      { id: 2, username: 'zhangsan', nickname: '张三', email: 'zhangsan@example.com', department: '产品部', role: '产品经理', status: 1, createTime: '2024-05-19 09:15:00' },
      { id: 3, username: 'lisi', nickname: '李四', email: 'lisi@example.com', department: '设计部', role: '设计师', status: 1, createTime: '2024-05-18 14:22:00' },
    ],
    role: [
      { id: 1, roleName: '超级管理员', roleCode: 'SUPER_ADMIN', description: '拥有系统所有权限', status: 1, userCount: 2, createTime: '2024-05-01 10:00:00' },
      { id: 2, roleName: '产品经理', roleCode: 'PRODUCT_MANAGER', description: '负责产品规划', status: 1, userCount: 5, createTime: '2024-05-02 10:00:00' },
    ],
    department: [
      { id: 1, deptName: '技术部', deptCode: 'TECH', leader: '张三', phone: '13800138000', userCount: 10, status: 1, sort: 1 },
      { id: 2, deptName: '产品部', deptCode: 'PRODUCT', leader: '李四', phone: '13800138001', userCount: 5, status: 1, sort: 2 },
    ],
    product: [
      { id: 1, productName: 'iPhone 15', productCode: 'SKU001', category: '电子产品', price: 6999, stock: 100, status: 1, sales: 500 },
      { id: 2, productName: 'MacBook Pro', productCode: 'SKU002', category: '电子产品', price: 12999, stock: 50, status: 1, sales: 200 },
    ],
    order: [
      { id: 1, orderNo: 'ORD202405010001', userName: '张三', productName: 'iPhone 15', totalAmount: 6999, orderStatus: '已完成', payStatus: '已支付', createTime: '2024-05-01 10:00:00' },
      { id: 2, orderNo: 'ORD202405010002', userName: '李四', productName: 'MacBook Pro', totalAmount: 12999, orderStatus: '待支付', payStatus: '未支付', createTime: '2024-05-01 11:00:00' },
    ],
  };
  return templates[module] || templates.user;
};

const loadData = async () => {
  loading.value = true;
  try {
    let params = { ...searchData };
    if (props.config.hooks?.beforeLoad) {
      params = await executeHook(props.config.hooks.beforeLoad, params) || params;
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    tableData.value = generateMockData();
    pagination.total = tableData.value.length;
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
      if (record) console.log('Delete:', record);
      break;
    case 'view':
      if (record) router.push({ path: `/${props.config.module}s/view/${record.id}` });
      break;
    case 'batchDelete':
      console.log('Batch delete:', selectedRowKeys.value);
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
