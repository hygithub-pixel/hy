<template>
  <div class="module-page">
    <a-row :gutter="20">
      <a-col :span="24">
        <a-card class="mb-4">
          <template #title>
            <div class="flex justify-between items-center">
              <div>
                <div class="text-xl font-bold">{{ config?.title || '数据管理' }}</div>
                <div class="text-gray-500 text-sm mt-1">{{ config?.description || '管理和维护系统数据' }}</div>
              </div>
              <a-button
                v-if="canCreate"
                type="primary"
                @click="handleAdd"
              >
                <template #icon><PlusOutlined /></template>
                新增数据
              </a-button>
            </div>
          </template>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="20">
      <a-col :span="24">
        <a-card>
          <template v-if="tableConfig">
            <TableComponent
              :config="tableConfigWithDefaults"
              :data="tableData"
              :loading="loading"
              @edit="handleEdit"
              @delete="handleDelete"
              @page-change="handlePageChange"
            />
          </template>
          <template v-else>
            <a-empty description="暂无数据">
              <a-button
                v-if="canCreate"
                type="primary"
                @click="handleAdd"
              >
                <template #icon><PlusOutlined /></template>
                开始添加
              </a-button>
            </a-empty>
          </template>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      v-model:open="dialogVisible"
      :title="dialogType === 'add' ? '新增数据' : '编辑数据'"
      width="600px"
      :maskClosable="false"
      @ok="handleFormSubmit"
    >
      <template v-if="formConfig">
        <FormComponent
          ref="formComponentRef"
          :config="formConfig"
          :initial-data="formData"
        />
      </template>
      <template #footer>
        <a-button @click="dialogVisible = false">取消</a-button>
        <a-button type="primary" :loading="submitting" @click="handleFormSubmit">
          确定
        </a-button>
      </template>
    </a-modal>

    <a-modal
      v-model:open="deleteDialogVisible"
      title="确认删除"
      width="400px"
      :maskClosable="false"
      @ok="handleDeleteConfirm"
    >
      <div class="py-4">
        <a-alert
          message="确定要删除此数据吗？此操作无法撤销。"
          type="warning"
          show-icon
        />
      </div>
      <template #footer>
        <a-button @click="deleteDialogVisible = false">取消</a-button>
        <a-button danger type="primary" :loading="deleting" @click="handleDeleteConfirm">
          删除
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useModuleConfig } from '../composables/useModuleConfig';
import { useModuleActions } from '../composables/useModuleActions';
import FormComponent from '../components/form/FormComponent.vue';
import TableComponent from '../components/table/TableComponent.vue';

const {
  config,
  loading: configLoading,
  tableConfig,
  formConfig,
  canCreate,
} = useModuleConfig();

const {
  loading: actionLoading,
  setConfig,
  loadData,
  createData,
  updateData,
  deleteData,
} = useModuleActions({
  onSuccess: (action, data) => {
    console.log(`[ModulePage] Action "${action}" success:`, data);
  },
  onError: (action, error) => {
    console.error(`[ModulePage] Action "${action}" error:`, error);
  },
});

const tableData = ref<any[]>([]);
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const dialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const currentRow = ref<any>(null);
const formData = ref<any>({});
const formComponentRef = ref<InstanceType<typeof FormComponent> | null>(null);
const submitting = ref(false);
const deleting = ref(false);

const loading = computed(() => configLoading.value || actionLoading.value);

const tableConfigWithDefaults = computed(() => {
  if (!tableConfig.value) return null;
  return {
    ...tableConfig.value,
    data: tableData.value,
  } as any;
});

interface LoadResult {
  dataList?: any[];
  data?: any[];
  pagination?: {
    currentPage?: number;
    pageSize?: number;
    total?: number;
  };
}

const fetchTableData = async () => {
  if (!config.value) return;

  try {
    const result = await loadData({
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    }) as LoadResult | undefined;

    if (result) {
      tableData.value = result.dataList || result.data || [];
      if (result.pagination) {
        pagination.value = {
          currentPage: result.pagination.currentPage || 1,
          pageSize: result.pagination.pageSize || 10,
          total: result.pagination.total || 0,
        };
      }
    }
  } catch (error) {
    console.error('[ModulePage] Fetch data error:', error);
  }
};

const handleAdd = () => {
  dialogType.value = 'add';
  formData.value = {};
  dialogVisible.value = true;
};

const handleEdit = (row: any) => {
  dialogType.value = 'edit';
  currentRow.value = row;
  formData.value = { ...row };
  dialogVisible.value = true;
};

const handleDelete = (row: any) => {
  currentRow.value = row;
  deleteDialogVisible.value = true;
};

const handleFormSubmit = async () => {
  if (!config.value || !formComponentRef.value) return;

  try {
    const isValid = await formComponentRef.value.validateForm();
    if (!isValid) return;

    submitting.value = true;

    if (dialogType.value === 'add') {
      await createData(formComponentRef.value.formData);
    } else if (dialogType.value === 'edit' && currentRow.value) {
      await updateData(currentRow.value.id, formComponentRef.value.formData);
    }

    await fetchTableData();
    dialogVisible.value = false;
  } catch (error) {
    console.error('[ModulePage] Form submit error:', error);
  } finally {
    submitting.value = false;
  }
};

const handleDeleteConfirm = async () => {
  if (!currentRow.value) return;

  try {
    deleting.value = true;
    await deleteData(currentRow.value.id);
    await fetchTableData();
    deleteDialogVisible.value = false;
  } catch (error) {
    console.error('[ModulePage] Delete error:', error);
  } finally {
    deleting.value = false;
  }
};

const handlePageChange = (current: number, size: number) => {
  pagination.value.currentPage = current;
  pagination.value.pageSize = size;
  fetchTableData();
};

watch(config, (newConfig) => {
  if (newConfig) {
    setConfig(newConfig);
    fetchTableData();
  }
});

onMounted(() => {
  if (config.value) {
    setConfig(config.value);
    fetchTableData();
  }
});
</script>

<style scoped>
.module-page {
  padding: 20px;
}
</style>
