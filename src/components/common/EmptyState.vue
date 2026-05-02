<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div class="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-elevated">
      <FileTextOutlined style="font-size: 48px; color: var(--ant-text-color-secondary);" />
    </div>
    <h3 class="text-lg font-semibold text-base-color mb-2">{{ title }}</h3>
    <p class="text-secondary mb-6 max-w-md">{{ description }}</p>
    <slot name="actions"></slot>
  </div>
</template>

<script setup lang="ts">
import { FileTextOutlined } from '@ant-design/icons-vue';

defineProps({
  title: {
    type: String,
    default: '暂无数据',
  },
  description: {
    type: String,
    default: '当前没有可用数据，请稍后再试',
  },
  icon: {
    type: [String, Object],
    default: FileTextOutlined,
  },
});
</script>
