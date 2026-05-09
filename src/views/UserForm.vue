<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div class="flex items-center gap-3">
        <a-button type="text" @click="handleBack">
          <ArrowLeftOutlined />
        </a-button>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ formTitle }}</h2>
          <p class="text-sm text-gray-500 mt-1">填写用户基本信息，带 * 为必填项</p>
        </div>
      </div>
    </div>

    <div class="p-6">
      <DynamicForm
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
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  record: null,
});

const { loadConfig } = useConfigLoader();
const { executeHook } = useModuleHooks();

const config = ref<ModuleConfig>({} as ModuleConfig);
const formRef = ref();

const formData = reactive<Record<string, any>>({
  status: 1,
  gender: '男',
  loginType: ['username'],
});

const formTitle = computed(() => {
  switch (props.mode) {
    case 'edit':
      return '编辑用户';
    case 'view':
      return '查看用户';
    default:
      return '新增用户';
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

onMounted(async () => {
  config.value = await loadConfig('user');
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
