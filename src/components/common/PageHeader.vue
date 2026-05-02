<template>
  <div class="flex items-center justify-between w-full py-4 px-6 border-b border-main bg-container">
    <div class="flex items-center gap-4">
      <slot name="back"></slot>
      <div>
        <h1 class="text-xl font-bold text-base-color">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-secondary mt-1">{{ subtitle }}</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
});
</script>
