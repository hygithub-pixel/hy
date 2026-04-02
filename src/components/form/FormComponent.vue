<template>
  <div class="form-wrapper">
    <div v-if="hasDraft && !isRestored" class="draft-notice mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex-between">
        <div class="flex-start gap-2">
          <el-icon class="text-yellow-600"><Warning /></el-icon>
          <span class="text-yellow-800">检测到未保存的草稿（{{ formatDraftTime(draftSavedAt) }}）</span>
        </div>
        <div class="flex-end gap-2">
          <el-button size="small" @click="restoreDraft">恢复草稿</el-button>
          <el-button size="small" type="danger" @click="clearDraft">丢弃草稿</el-button>
        </div>
      </div>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-position="config.labelPosition || 'top'"
      :size="config.size || 'large'"
      :validate-on-rule-change="false"
      @validate="handleValidation"
    >
      <template v-for="item in config.items" :key="item.field">
        <el-form-item
          v-if="shouldShowFormItem(item) && !item.children"
          :label="item.label"
          :prop="item.field"
          :rules="getItemRules(item)"
          v-show="evaluateExpression(item.vShow)"
          :validate-event="true"
        >
          <component
            :is="getComponentName(item)"
            v-bind="getComponentProps(item)"
            v-model="formData[item.field]"
            v-show="evaluateExpression(item.vShow)"
            v-if="evaluateExpression(item.vIf)"
            :aria-label="item.label"
          >
            <template v-if="item.type === 'upload'" #default>
              <el-icon class="el-icon--upload"><Upload /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </template>
          </component>
        </el-form-item>
        
        <div
          v-else-if="item.children && shouldShowFormItem(item)"
          v-show="evaluateExpression(item.vShow)"
          v-if="evaluateExpression(item.vIf)"
          class="nested-form-item"
        >
          <div class="text-lg font-medium mb-2">{{ item.label }}</div>
          <div class="pl-4 border-l-2 border-gray-200">
            <template v-for="subItem in item.children" :key="subItem.field">
              <el-form-item
                v-show="shouldShowFormItem(subItem) && evaluateExpression(subItem.vShow)"
                v-if="evaluateExpression(subItem.vIf)"
                :label="subItem.label"
                :prop="subItem.field"
                :rules="getItemRules(subItem)"
                :validate-event="true"
              >
                <component
                  :is="getComponentName(subItem)"
                  v-bind="getComponentProps(subItem)"
                  v-model="formData[subItem.field]"
                  v-show="evaluateExpression(subItem.vShow)"
                  v-if="evaluateExpression(subItem.vIf)"
                  :aria-label="subItem.label"
                >
                  <template v-if="subItem.type === 'upload'" #default>
                    <el-icon class="el-icon--upload"><Upload /></el-icon>
                    <div class="el-upload__text">
                      将文件拖到此处，或<em>点击上传</em>
                    </div>
                  </template>
                </component>
              </el-form-item>
            </template>
          </div>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { Upload, Warning } from '@element-plus/icons-vue';
import { FormConfig, FormData, FormItem, FormFieldValue } from '../../types/FormConfig';
import { uploadApi } from '../../api/uploadApi';
import { debounceWithCancel } from '../../utils/debounceThrottle';
import { buildValidationRule } from '../../utils/validationRules';
import type { FormInstance, FormRules, FormItemProp } from 'element-plus';

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

const formRef = ref<FormInstance | null>(null);
const formData = ref<FormData>({});
const draftData = ref<FormData | null>(null);
const draftSavedAt = ref<number | null>(null);
const isRestored = ref(false);

const draftKey = computed(() => props.draftKey || `form-draft-${props.config.items.map(i => i.field).join('-')}`);
const hasDraft = computed(() => draftData.value !== null);

const initializeFormData = (items: FormItem[], initialData: FormData) => {
  items.forEach(item => {
    if (item.value !== undefined) {
      initialData[item.field] = item.value as FormFieldValue;
    } else if (!initialData[item.field]) {
      initialData[item.field] = '';
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
  const rules: FormRules = {};
  props.config.items.forEach(item => {
    if (item.rules) {
      rules[item.field] = item.rules;
    }
  });
  return rules;
});

const getItemRules = (item: FormItem) => {
  if (!item.rules) return undefined;
  return item.rules.map(rule => buildValidationRule(rule));
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
      return Array.isArray(dep.values) && fieldValue !== undefined && dep.values.includes(fieldValue as string | number);
    } else if (dep.condition === 'notContains') {
      return Array.isArray(dep.values) && fieldValue !== undefined && !dep.values.includes(fieldValue as string | number);
    }
    return true;
  });
};

const evaluateExpression = (expression?: string): boolean => {
  if (!expression) return true;
  try {
    return new Function('formData', `return (${expression})`)(formData.value);
  } catch (error) {
    console.error('表达式评估错误:', error);
    return true;
  }
};

const getComponentName = (item: FormItem): string => {
  if (item.type === 'component' && item.component) {
    if (typeof item.component === 'string') {
      return props.config.components?.[item.component] || item.component;
    } else {
      return props.config.components?.[item.component.type] || item.component.type;
    }
  }
  if (item.type === 'upload') {
    return 'el-upload';
  } else if (item.type === 'richText') {
    return 'el-input';
  }
  return 'el-input';
};

const getComponentProps = (item: FormItem): Record<string, any> => {
  const props: Record<string, any> = { ...(item.props || {}) };
  
  if (item.type === 'upload') {
    return {
      ...props,
      action: '',
      'http-request': (params: any) => handleUpload(params, item.field),
      multiple: props.multiple || false,
      limit: props.maxCount || 1,
      'show-file-list': props.showFileList !== false,
      'auto-upload': props.autoUpload !== false,
      drag: true
    };
  } else if (item.type === 'richText') {
    return {
      ...props,
      placeholder: item.placeholder,
      type: 'textarea',
      rows: 4
    };
  } else if (item.type === 'component' && item.component && typeof item.component !== 'string' && item.component.props) {
    return { ...item.component.props };
  }
  
  return props;
};

const formatDraftTime = (timestamp: number | null) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN');
};

const saveDraft = debounceWithCancel(() => {
  if (!props.enableAutoSave) return;
  localStorage.setItem(draftKey.value, JSON.stringify({
    data: formData.value,
    savedAt: Date.now()
  }));
  draftSavedAt.value = Date.now();
  emit('draft-saved', formData.value);
}, 2000);

const loadDraft = () => {
  const saved = localStorage.getItem(draftKey.value);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      draftData.value = parsed.data;
      draftSavedAt.value = parsed.savedAt;
    } catch {
      clearDraft();
    }
  }
};

const restoreDraft = () => {
  if (draftData.value) {
    formData.value = { ...draftData.value };
    isRestored.value = true;
    ElMessage.success('草稿已恢复');
  }
};

const clearDraft = () => {
  localStorage.removeItem(draftKey.value);
  draftData.value = null;
  draftSavedAt.value = null;
  ElMessage.info('草稿已丢弃');
};

const validateForm = async (): Promise<boolean> => {
  if (formRef.value) {
    try {
      await formRef.value.validate();
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
};

const handleUpload = async (params: any, field: string) => {
  const file = params.file;
  try {
    const response = await uploadApi.uploadFile(file);
    formData.value[field] = response.data.url;
    params.onSuccess(response);
    ElMessage.success('文件上传成功');
  } catch (error) {
    console.error('文件上传失败:', error);
    params.onError(error);
    ElMessage.error('文件上传失败');
  }
};

const handleValidation = (prop: FormItemProp, isValid: boolean, message: string) => {
  if (isValid) {
    console.log(`Field ${prop} is valid`);
  } else {
    console.log(`Field ${prop} is invalid: ${message}`);
  }
};

watch(formData, () => {
  if (props.enableAutoSave) {
    saveDraft();
  }
}, { deep: true });

watch(() => props.initialData, (newData) => {
  if (newData) {
    const updatedData: FormData = { ...newData };
    initializeFormData(props.config.items, updatedData);
    formData.value = updatedData;
  }
});

defineExpose({
  validateForm,
  formData,
  clearDraft
});

onMounted(() => {
  if (props.initialData) {
    const updatedData: FormData = { ...props.initialData };
    initializeFormData(props.config.items, updatedData);
    formData.value = updatedData;
  } else {
    formData.value = createInitialFormData();
  }
  if (props.enableAutoSave) {
    loadDraft();
  }
});

onBeforeUnmount(() => {
  saveDraft.flush();
});
</script>

<style scoped>
.nested-form-item {
  margin: 20px 0;
  padding: var(--space-md);
  background-color: var(--bg-muted);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.nested-form-item .nested-form-item {
  margin: 12px 0;
  padding: 12px;
  background-color: var(--bg-muted);
}

@media (max-width: 768px) {
  .form-wrapper {
    padding: 0 12px;
  }
  
  .nested-form-item {
    padding: 12px;
  }
  
  .nested-form-item .nested-form-item {
    padding: 8px;
  }
}
</style>