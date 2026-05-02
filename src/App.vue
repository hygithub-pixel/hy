<template>
  <a-config-provider :theme="themeStore.antTheme">
    <div id="live-region" aria-live="polite" class="sr-only-live-region"></div>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </a-config-provider>
</template>

<script setup lang="ts">
import { useThemeStore } from './stores/themeStore';

const themeStore = useThemeStore();

const liveRegion = ref<HTMLElement | null>(null);

const updateLiveRegion = (message: string) => {
  if (liveRegion.value) {
    liveRegion.value.textContent = message;
    setTimeout(() => {
      if (liveRegion.value) {
        liveRegion.value.textContent = '';
      }
    }, 3000);
  }
};

onMounted(() => {
  themeStore.init();
  liveRegion.value = document.getElementById('live-region');
  window.announceToScreenReader = updateLiveRegion;
});

onUnmounted(() => {
  window.announceToScreenReader = undefined;
});
</script>

<style>
.sr-only-live-region {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
