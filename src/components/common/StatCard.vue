<template>
  <div class="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg">
    <div class="flex items-start gap-4">
      <div
        class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
        :style="{ background: iconBg }"
      >
        <component :is="icon" :style="{ fontSize: '24px', color: iconColor }" />
      </div>
      <div class="flex-1">
        <div class="text-sm text-text-secondary mb-1">{{ title }}</div>
        <div class="text-2xl font-bold text-text-primary mb-2">
          <span v-if="prefix">{{ prefix }}</span>
          {{ value }}
        </div>
        <div v-if="trend !== undefined" class="flex items-center gap-1 text-sm" :class="trendClass">
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
  iconBg?: string;
  iconColor?: string;
  trend?: number;
}

const props = withDefaults(defineProps<StatCardProps>(), {
  prefix: '',
  iconBg: '#f3f4f6',
  iconColor: '#6b7280',
});

const trendClass = computed(() => {
  if (props.trend === undefined) return '';
  return props.trend > 0 ? 'text-green-500' : 'text-red-500';
});
</script>
