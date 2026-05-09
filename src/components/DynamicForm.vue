<template>
  <a-form
    ref="formRef"
    :model="formData"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
    <template v-for="group in fields" :key="group.group">
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
          :required="field.required"
          :rules="field.rules"
          :class="field.colspan === 'full' ? 'col-span-2' : ''"
        >
          <component
            :is="getComponent(field.component)"
            v-model:value="formData[field.name]"
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
        </a-form-item>
      </div>
    </template>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button @click="handleReset">重置</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FieldGroup, FieldConfig } from '../types/moduleConfig';

interface Props {
  fields: FieldGroup[];
  initialData?: Record<string, any>;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: { span: number };
  wrapperCol?: { span: number };
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [],
  initialData: () => ({}),
  layout: 'horizontal',
  labelCol: () => ({ span: 8 }),
  wrapperCol: () => ({ span: 16 }),
});

const emit = defineEmits<{
  (e: 'submit', values: Record<string, any>): void;
  (e: 'cancel'): void;
  (e: 'reset'): void;
}>();

const formRef = ref();

const formData = reactive<Record<string, any>>(
  props.initialData || {}
);

const componentMap: Record<string, string> = {
  'a-input': 'a-input',
  'a-input-password': 'a-input-password',
  'a-textarea': 'a-textarea',
  'a-select': 'a-select',
  'a-radio-group': 'a-radio-group',
  'a-checkbox-group': 'a-checkbox-group',
  'a-date-picker': 'a-date-picker',
  'a-upload': 'a-upload',
  'a-switch': 'a-switch',
};

const optionComponents: Record<string, string> = {
  'a-select': 'a-select-option',
  'a-radio-group': 'a-radio',
  'a-checkbox-group': 'a-checkbox',
};

const getComponent = (componentName: string) => {
  return componentMap[componentName] || 'a-input';
};

const getOptionComponent = (componentName: string) => {
  return optionComponents[componentName] || 'a-select-option';
};

const hasOptions = (componentName: string) => {
  return ['a-select', 'a-radio-group', 'a-checkbox-group'].includes(componentName);
};

const getFieldProps = (field: FieldConfig) => {
  const { component, name, label, rules, options, ...rest } = field;
  return rest;
};

const handleSubmit = async () => {
  try {
    const values = await formRef.value?.validate();
    emit('submit', values);
  } catch (error) {
    console.error('Validation failed:', error);
  }
};

const handleCancel = () => {
  emit('cancel');
};

const handleReset = () => {
  formRef.value?.resetFields();
  emit('reset');
};

const getFormData = () => {
  return { ...formData };
};

defineExpose({
  getFormData,
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
});
</script>

<style scoped>
.col-span-2 {
  grid-column: span 2 / span 2;
}
</style>
