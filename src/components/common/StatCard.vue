<template>
  <div class="bg-container rounded-lg p-4 transition-all hover:shadow-lg border border-main">
    <div class="flex items-start gap-4">
      <div
        class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
        :style="{ background: 'var(--ant-primary-color-outline)' }"
      >
        <component :is="icon" :style="{ fontSize: '24px', color: 'var(--ant-primary-color)' }" />
      </div>
      <div class="flex-1">
        <div class="text-sm text-secondary mb-1">{{ title }}</div>
        <div class="text-2xl font-bold text-base-color mb-2">
          <span v-if="prefix">{{ prefix }}</span>
          {{ value }}
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

withDefaults(defineProps<StatCardProps>(), {
  prefix: '',
});
</script>
