<template>
  <a-select
    v-model:value="localStatus"
    size="small"
    style="width: 120px"
    @change="handleChange"
  >
    <a-select-option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
const props = defineProps<{
  row: any;
  action: any;
  options: Array<{ label: string; value: string }>;
}>();

const emit = defineEmits<{
  (e: 'action', data: any): void;
}>();

const localStatus = ref(props.row.status || '');

const handleChange = (value: string) => {
  props.row.status = value;
  emit('action', {
    row: props.row,
    status: value
  });
};
</script>
