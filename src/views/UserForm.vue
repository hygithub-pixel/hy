<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <ArrowLeftOutlined />
        </a-button>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ formTitle }}</h2>
          <p class="text-sm text-gray-500 mt-1">填写{{ config.title }}基本信息，带 * 为必填项</p>
        </div>
      </div>
    </div>

    <div class="p-6">
      <DynamicForm
        v-if="config.fields"
        ref="formRef"
        :fields="config.fields"
        :initial-data="formData"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        @submit="handleSubmit"
        @cancel="handleBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import DynamicForm from '../components/DynamicForm.vue';
import { useConfigLoader } from '../composables/useConfigLoader';
import { useModuleHooks } from '../composables/useModuleHooks';
import type { ModuleConfig } from '../types/moduleConfig';

interface Props {
  mode?: 'create' | 'edit' | 'view';
  record?: any;
  configName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  record: null,
  configName: 'user',
});

const { loadConfig } = useConfigLoader();
const { executeHook } = useModuleHooks();

const config = ref<ModuleConfig>({} as ModuleConfig);
const formRef = ref();

const formData = reactive<Record<string, any>>({});

const formTitle = computed(() => {
  switch (props.mode) {
    case 'edit':
      return `编辑${config.value.title || ''}`;
    case 'view':
      return `查看${config.value.title || ''}`;
    default:
      return `新增${config.value.title || ''}`;
  }
});

watch(
  () => props.record,
  (newRecord) => {
    if (newRecord) {
      Object.assign(formData, newRecord);
    }
  },
  { immediate: true }
);

watch(
  () => props.configName,
  async (newConfigName) => {
    if (newConfigName) {
      config.value = await loadConfig(newConfigName);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  config.value = await loadConfig(props.configName || 'user');
});

const handleSubmit = async (values: Record<string, any>) => {
  console.log('Submit values:', values);
  
  if (config.value.hooks?.beforeSubmit) {
    executeHook(config.value.hooks.beforeSubmit, values);
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (config.value.hooks?.afterSubmit) {
    executeHook(config.value.hooks.afterSubmit);
  }
  
  emit('success');
};

const handleBack = () => {
  emit('cancel');
};

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();
</script>
