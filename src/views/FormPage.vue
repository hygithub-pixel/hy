<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b">
      <div class="flex items-center gap-3">
        <button class="p-2 hover:bg-gray-100 rounded" @click="handleBack">
          <ArrowLeftOutlined />
        </button>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ formTitle }}</h2>
          <p class="text-sm text-gray-500 mt-1">填写{{ config.title }}基本信息，带 * 为必填项</p>
        </div>
      </div>
    </div>

    <div class="p-6">
      <a-form
        ref="formRef"
        :model="formData"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <template v-for="group in config.fields" :key="group.group">
          <div class="border-b border-[#e8e8e8] pb-4 mb-6">
            <h3 class="text-base font-medium text-gray-900 flex items-center gap-2">
              <span class="w-1 h-5 bg-blue-500 rounded"></span>
              {{ group.group }}
            </h3>
          </div>

          <div class="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <a-form-item
              v-for="field in group.items"
              :key="field.name"
              :label="field.label"
              :name="field.name"
              :rules="isViewMode ? undefined : field.rules"
            >
              <component
                :is="field.component"
                v-model:value="formData[field.name]"
                v-bind="getFieldProps(field)"
                :disabled="isViewMode"
                :readonly="isViewMode"
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
            </a-form-item>
          </div>
        </template>

        <a-form-item v-if="!isViewMode" :wrapper-col="{ offset: 8, span: 16 }">
          <a-space>
            <a-button @click="handleBack">取消</a-button>
            <a-button @click="handleReset">重置</a-button>
            <a-button type="primary" @click="handleSubmit">保存</a-button>
          </a-space>
        </a-form-item>
        
        <a-form-item v-else :wrapper-col="{ offset: 8, span: 16 }">
          <a-button @click="handleBack">返回</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useConfigLoader } from '../composables/useConfigLoader';
import type { ModuleConfig } from '../types/moduleConfig';

const route = useRoute();
const router = useRouter();
const { loadConfig } = useConfigLoader();

const config = ref<ModuleConfig>({} as ModuleConfig);
const formRef = ref();

const isEditMode = computed(() => route.params.id && route.meta.mode !== 'view');
const isViewMode = computed(() => route.meta.mode === 'view');

const formTitle = computed(() => {
  if (isViewMode.value) return `查看${config.value.title}`;
  if (isEditMode.value) return `编辑${config.value.title}`;
  return `新增${config.value.title}`;
});

const formData = reactive<Record<string, any>>({
  status: 1,
  gender: '男',
  loginType: ['username'],
});

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

const mockEditData: Record<string, any> = {
  user: { id: 1, username: 'admin', nickname: '管理员', email: 'admin@example.com', department: '技术部', role: '超级管理员', status: 1, gender: '男' },
  role: { id: 1, roleName: '超级管理员', roleCode: 'SUPER_ADMIN', description: '拥有系统所有权限', status: 1 },
  department: { id: 1, deptName: '技术部', deptCode: 'TECH', leader: '张三', phone: '13800138000', status: 1, sort: 1 },
  product: { id: 1, productName: 'iPhone 15', productCode: 'SKU001', category: '电子产品', price: 6999, stock: 100, status: 1 },
  order: { id: 1, orderNo: 'ORD202405010001', userName: '张三', productName: 'iPhone 15', totalAmount: 6999, orderStatus: '已完成', payStatus: '已支付' },
};

onMounted(async () => {
  const configName = route.meta.config as string;
  if (configName) {
    config.value = await loadConfig(configName);
    
    if (route.params.id) {
      const moduleKey = configName;
      const editData = mockEditData[moduleKey];
      if (editData) {
        Object.assign(formData, editData);
      }
    }
  }
});

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    message.success('保存成功');
    handleBack();
  } catch (error) {
    console.error('Validation failed:', error);
  }
};

const handleReset = () => {
  formRef.value?.resetFields();
};

const handleBack = () => {
  router.back();
};
</script>
