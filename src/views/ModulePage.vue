<template>
  <div class="flex h-screen">
    <Sidebar />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <TopNav />
      
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <DynamicRenderer
          v-if="!showForm && config.module"
          ref="rendererRef"
          :config="config"
          @create="handleCreate"
          @edit="handleEdit"
          @view="handleView"
        />

        <UserForm
          v-if="showForm"
          :mode="formMode"
          :record="currentRecord"
          :config-name="currentConfigName"
          @success="handleFormSuccess"
          @cancel="handleFormCancel"
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
import UserForm from './UserForm.vue';
import { useConfigLoader } from '../composables/useConfigLoader';
import type { ModuleConfig } from '../types/moduleConfig';

const route = useRoute();
const { loadConfig } = useConfigLoader();

const config = ref<ModuleConfig>({} as ModuleConfig);
const rendererRef = ref();
const showForm = ref(false);
const formMode = ref<'create' | 'edit' | 'view'>('create');
const currentRecord = ref<any>(null);
const currentConfigName = ref('');

const loadModuleConfig = async () => {
  const configName = route.meta.config as string;
  if (configName) {
    currentConfigName.value = configName;
    config.value = await loadConfig(configName);
  }
};

onMounted(() => {
  loadModuleConfig();
});

watch(
  () => route.path,
  () => {
    showForm.value = false;
    loadModuleConfig();
  }
);

const handleCreate = () => {
  formMode.value = 'create';
  currentRecord.value = null;
  showForm.value = true;
};

const handleEdit = (record: any) => {
  formMode.value = 'edit';
  currentRecord.value = record;
  showForm.value = true;
};

const handleView = (record: any) => {
  formMode.value = 'view';
  currentRecord.value = record;
  showForm.value = true;
};

const handleFormSuccess = () => {
  showForm.value = false;
  rendererRef.value?.loadData();
};

const handleFormCancel = () => {
  showForm.value = false;
};
</script>
