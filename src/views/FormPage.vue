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
            <a-button type="primary" :loading="submitting" @click="handleSubmit">保存</a-button>
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
import { get, post, put } from '../utils/request';
import type { ModuleConfig } from '../types/moduleConfig';

const route = useRoute();
const router = useRouter();
const { loadConfig } = useConfigLoader();

const config = ref<ModuleConfig>({} as ModuleConfig);
const formRef = ref();
const submitting = ref(false);
const loading = ref(false);

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

const loadDetail = async () => {
  if (!route.params.id) return;
  
  const apiConfig = config.value.apis?.list;
  if (!apiConfig) return;

  loading.value = true;
  try {
    const response = await get<any>(apiConfig.path, { id: route.params.id });
    if (response.data) {
      Object.assign(formData, response.data);
    }
  } catch (error: any) {
    message.error(error.message || '加载数据失败');
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;

    const apiConfig = config.value.apis;
    if (!apiConfig) {
      message.error('未配置API');
      return;
    }

    if (isEditMode.value) {
      const url = apiConfig.update?.path.replace('{id}', route.params.id as string);
      await put(url!, formData);
      message.success('更新成功');
    } else {
      await post(apiConfig.create?.path!, formData);
      message.success('新增成功');
    }
    handleBack();
  } catch (error: any) {
    if (error.message) {
      message.error(error.message);
    }
  } finally {
    submitting.value = false;
  }
};

const handleReset = () => {
  formRef.value?.resetFields();
};

const handleBack = () => {
  router.back();
};

onMounted(async () => {
  const configName = route.meta.config as string;
  if (configName) {
    config.value = await loadConfig(configName);
    
    if (route.params.id) {
      await loadDetail();
    }
  }
});
</script>
