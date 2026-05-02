<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div v-if="title" class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-text-primary">{{ title }}</h3>
      <slot name="header-actions"></slot>
    </div>
    <slot></slot>
    <div v-if="footer" class="mt-4 pt-4 border-t border-border">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CardProps {
  title?: string;
  footer?: boolean;
}

withDefaults(defineProps<CardProps>(), {
  title: '',
  footer: false,
});
</script>
