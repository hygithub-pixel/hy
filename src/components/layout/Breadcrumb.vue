<template>
  <div
    class="flex items-center gap-2 text-sm text-text-secondary py-4 px-6 bg-white border-b border-border"
  >
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(item, index) in items" :key="index">
        <router-link v-if="(item as any).path" :to="(item as any).path" class="hover:text-primary transition-colors">
          {{ (item as any).label }}
        </router-link>
        <span v-else class="text-text-primary font-medium">{{ (item as any).label }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string;
  path?: string;
}

defineProps({
  items: {
    type: Array as () => BreadcrumbItem[],
    default: () => [],
  },
});
</script>
