<template>
  <div>
    <div
      v-if="hasDraft && !isRestored"
      class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <WarningOutlined class="text-yellow-600" />
          <span class="text-yellow-800"
            >检测到未保存的草稿（{{ formatDraftTime(draftSavedAt) }}）</span
          >
        </div>
        <div class="flex items-center gap-2">
          <a-button size="small" @click="restoreDraft">恢复草稿</a-button>
          <a-button size="small" danger @click="clearDraft">丢弃草稿</a-button>
        </div>
      </div>
    </div>

    <a-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-col="{ span: config.labelPosition === 'left' ? 6 : 24 }"
      :wrapper-col="{ span: config.labelPosition === 'left' ? 18 : 24 }"
      class="w-full"
    >
      <template v-for="item in config.items" :key="item.field">
        <template v-if="shouldShowFormItem(item) && !item.children">
          <a-form-item
            :label="item.label"
            :name="item.field"
            :rules="getItemRules(item)"
          >
            <component
              :is="getComponent(item)"
              v-model:value="formData[item.field]"
              v-bind="getComponentProps(item)"
            >
              <template v-if="item.type === 'select' && item.options">
                <a-select-option
                  v-for="option in item.options"
                  :key="String(option.value)"
                  :value="option.value"
                >
                  {{ option.label }}
                </a-select-option>
              </template>
            </component>
          </a-form-item>
        </template>

        <template v-else-if="item.children && shouldShowFormItem(item)">
          <div class="my-5 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div class="text-lg font-medium mb-2">{{ item.label }}</div>
            <div class="pl-4 border-l-2 border-gray-200">
              <template v-for="subItem in item.children" :key="subItem.field">
                <a-form-item
                  v-show="shouldShowFormItem(subItem)"
                  :label="subItem.label"
                  :name="subItem.field"
                  :rules="getItemRules(subItem)"
                >
                  <component
                    :is="getComponent(subItem)"
                    v-model:value="formData[subItem.field]"
                    v-bind="getComponentProps(subItem)"
                  >
                    <template v-if="subItem.type === 'select' && subItem.options">
                      <a-select-option
                        v-for="option in subItem.options"
                        :key="String(option.value)"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </a-select-option>
                    </template>
                  </component>
                </a-form-item>
              </template>
            </div>
          </div>
        </template>
      </template>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { WarningOutlined } from '@ant-design/icons-vue';
import { FormConfig, FormData, FormItem, FormFieldValue } from '../../types/FormConfig';
import { debounceWithCancel } from '../../utils/debounceThrottle';
import { buildValidationRule } from '../../utils/validationRules';
import type { Rule } from 'ant-design-vue/lib/form';

const props = defineProps<{
  config: FormConfig;
  initialData?: FormData;
  draftKey?: string;
  enableAutoSave?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: FormData): void;
  (e: 'draft-saved', data: FormData): void;
}>();

const formRef = ref();
const formData = ref<Record<string, any>>({});
const draftData = ref<FormData | null>(null);
const draftSavedAt = ref<number | null>(null);
const isRestored = ref(false);
const isMounted = ref(false);

const draftKey = computed(
  () => props.draftKey || `form-draft-${props.config.items.map(i => i.field).join('-')}`
);
const hasDraft = computed(() => draftData.value !== null);

const componentMap: Record<string, string> = {
  // 文本输入类
  input: 'a-input',
  text: 'a-input',
  password: 'a-input-password',
  number: 'a-input-number',
  email: 'a-input',
  tel: 'a-input',
  url: 'a-input',
  
  // 文本域类
  textarea: 'a-textarea',
  
  // 选择类
  select: 'a-select',
  multiSelect: 'a-select',
  radio: 'a-radio-group',
  checkbox: 'a-checkbox-group',
  switch: 'a-switch',
  
  // 日期时间类
  date: 'a-date-picker',
  datetime: 'a-date-picker',
  dateTime: 'a-date-picker',
  time: 'a-time-picker',
  dateRange: 'a-range-picker',
  
  // 文件上传类
  upload: 'a-upload',
  image: 'a-upload',
  imageUpload: 'a-upload',
  
  // 特殊组件
  cascader: 'a-cascader',
  treeSelect: 'a-tree-select',
  slider: 'a-slider',
  rate: 'a-rate',
  autoComplete: 'a-auto-complete',
};

const initializeFormData = (items: FormItem[], initialData: FormData) => {
  items.forEach(item => {
    if (item.value !== undefined) {
      initialData[item.field] = item.value as FormFieldValue;
    } else if (initialData[item.field] === undefined) {
      if (item.type === 'switch') {
        initialData[item.field] = false;
      } else if (item.type === 'select' && item.options && item.options.length > 0) {
        initialData[item.field] = item.options[0].value;
      } else {
        initialData[item.field] = '';
      }
    }

    if (item.children) {
      initializeFormData(item.children, initialData);
    }
  });
};

const createInitialFormData = () => {
  const data: FormData = {};
  initializeFormData(props.config.items, data);
  return data;
};

const formRules = computed(() => {
  const rules: Record<string, Rule[]> = {};
  props.config.items.forEach(item => {
    if (item.rules) {
      rules[item.field] = item.rules.map(rule => buildValidationRule(rule) as Rule);
    }
  });
  return rules;
});

const getItemRules = (item: FormItem) => {
  if (!item.rules) return undefined;
  return item.rules.map(rule => buildValidationRule(rule) as Rule);
};

const shouldShowFormItem = (item: FormItem): boolean => {
  if (!item.dependencies || item.dependencies.length === 0) {
    return true;
  }

  return item.dependencies.some(dep => {
    const fieldValue = formData.value[dep.field] as string | number | undefined;
    if (dep.condition === 'equal') {
      return fieldValue === dep.values[0];
    } else if (dep.condition === 'notEqual') {
      return fieldValue !== dep.values[0];
    } else if (dep.condition === 'contains') {
      return (
        Array.isArray(dep.values) &&
        fieldValue !== undefined &&
        dep.values.includes(fieldValue as string | number)
      );
    }
    return true;
  });
};

const getComponent = (item: FormItem) => {
  if (item.type === 'component' && item.component) {
    if (typeof item.component === 'string') {
      return item.component;
    }
    return item.component.type;
  }
  return componentMap[item.type] || 'a-input';
};

const getComponentProps = (item: FormItem): Record<string, any> => {
  const baseProps: Record<string, any> = {
    placeholder: item.placeholder,
  };

  if (item.type === 'upload') {
    return {
      ...baseProps,
      'max-count': 1,
      'show-upload-list': true,
    };
  } else if (item.type === 'textarea') {
    return {
      ...baseProps,
      rows: 4,
    };
  } else if (item.type === 'date') {
    return {
      ...baseProps,
      class: 'w-full',
    };
  }

  return baseProps;
};

const formatDraftTime = (timestamp: number | null): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const saveDraft = debounceWithCancel(() => {
  if (!props.enableAutoSave || !isMounted.value) return;
  try {
    localStorage.setItem(
      draftKey.value,
      JSON.stringify({
        data: formData.value,
        savedAt: Date.now(),
      })
    );
    draftSavedAt.value = Date.now();
    emit('draft-saved', formData.value);
  } catch (error) {
    console.warn('保存草稿失败:', error);
  }
}, 2000);

const loadDraft = () => {
  try {
    const saved = localStorage.getItem(draftKey.value);
    if (saved) {
      const parsed = JSON.parse(saved);
      draftData.value = parsed.data;
      draftSavedAt.value = parsed.savedAt;
    }
  } catch {
    clearDraft();
  }
};

const restoreDraft = () => {
  if (draftData.value) {
    formData.value = { ...draftData.value };
    isRestored.value = true;
  }
};

const clearDraft = () => {
  try {
    localStorage.removeItem(draftKey.value);
  } catch {
    // ignore
  }
  draftData.value = null;
  draftSavedAt.value = null;
};

const validateForm = async (): Promise<boolean> => {
  if (!formRef.value) return false;
  try {
    await formRef.value.validate();
    return true;
  } catch {
    return false;
  }
};

watch(
  formData,
  () => {
    if (props.enableAutoSave && isMounted.value) {
      saveDraft();
    }
  },
  { deep: true }
);

watch(
  () => props.initialData,
  newData => {
    if (newData) {
      initializeFormData(props.config.items, newData);
      formData.value = newData;
    }
  }
);

onMounted(() => {
  isMounted.value = true;
  
  if (props.initialData) {
    initializeFormData(props.config.items, props.initialData);
    formData.value = props.initialData;
  } else {
    formData.value = createInitialFormData();
  }
  
  if (props.enableAutoSave) {
    loadDraft();
  }
});

onBeforeUnmount(() => {
  isMounted.value = false;
  if (saveDraft.flush) {
    saveDraft.flush();
  }
});

defineExpose({
  validateForm,
  formData,
  clearDraft,
});
</script>
