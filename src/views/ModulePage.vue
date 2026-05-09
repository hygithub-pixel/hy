<template>
  <div class="flex h-screen">
    <Sidebar />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <TopNav />
      
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <DynamicRenderer
          v-if="config.module"
          ref="rendererRef"
          :config="config"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';
import DynamicRenderer from '../components/DynamicRenderer.vue';
import { useConfigLoader } from '../composables/useConfigLoader';
import type { ModuleConfig } from '../types/moduleConfig';

const route = useRoute();
const { loadConfig } = useConfigLoader();

const config = ref<ModuleConfig>({} as ModuleConfig);
const rendererRef = ref();

const loadModuleConfig = async () => {
  const configName = route.meta.config as string;
  if (configName) {
    config.value = await loadConfig(configName);
  }
};

onMounted(loadModuleConfig);
watch(() => route.path, loadModuleConfig);

defineExpose({
  loadData: () => rendererRef.value?.loadData(),
});
</script>
