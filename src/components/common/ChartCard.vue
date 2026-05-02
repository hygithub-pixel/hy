<template>
  <div class="bg-container rounded-lg shadow-md p-6 border border-main">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-base-color">{{ title }}</h3>
      <slot name="actions"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface ChartCardProps {
  title: string;
}

defineProps<ChartCardProps>();
</script>
