<template>
  <div class="bg-container rounded-lg p-4 transition-all hover:shadow-lg border border-main">
    <div class="flex items-start gap-4">
      <div
        class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
        :style="{ background: 'var(--ant-primary-color-outline)' }"
      >
        <component :is="icon" :style="{ fontSize: '24px', color: 'var(--ant-primary-color)' }" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm text-secondary mb-1 truncate">{{ title }}</div>
        <div class="mb-2">
          <span v-if="prefix" class="text-secondary">{{ prefix }}</span>
          <span
            class="font-bold text-base-color font-tabular-nums"
            :style="{ fontSize: `${valueFontSize}px` }"
          >{{ formattedValue }}</span>
        </div>
        <div v-if="trend !== undefined" class="flex items-center gap-1 text-sm" :style="{ color: trend > 0 ? 'var(--ant-success-color)' : 'var(--ant-error-color)' }">
          <RiseOutlined />
          {{ Math.abs(trend) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { RiseOutlined } from '@ant-design/icons-vue';

interface StatCardProps {
  title: string;
  value: string | number;
  prefix?: string;
  icon: string | Component;
  trend?: number;
}

const props = withDefaults(defineProps<StatCardProps>(), {
  prefix: '',
});

const valueLength = computed(() => {
  const str = String(props.value);
  return str.length + (props.prefix ? props.prefix.length : 0);
});

const valueFontSize = computed(() => {
  const length = valueLength.value;
  if (length <= 6) return 24;
  if (length <= 8) return 20;
  if (length <= 10) return 16;
  if (length <= 12) return 14;
  return 12;
});

const formattedValue = computed(() => {
  return String(props.value);
});
</script>
