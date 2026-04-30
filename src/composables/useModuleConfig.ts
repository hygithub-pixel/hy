import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { configManager } from '../config/schema/config-manager';
import type { ModuleConfig } from '../config/schema/types';

export interface UseModuleConfigOptions {
  moduleId?: string;
  autoLoad?: boolean;
}

export function useModuleConfig(options: UseModuleConfigOptions = {}) {
  const route = useRoute();
  const { moduleId, autoLoad = true } = options;

  const config = ref<ModuleConfig | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentModuleId = computed(() => {
    if (moduleId) return moduleId;
    if (route.meta?.configId) return route.meta.configId as string;
    return null;
  });

  const loadConfig = async (id?: string) => {
    const targetId = id || currentModuleId.value;
    if (!targetId) {
      error.value = new Error('Module ID is required');
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const moduleConfig = await configManager.getModule(targetId);
      if (moduleConfig) {
        config.value = moduleConfig;
      } else {
        error.value = new Error(`Module config not found: ${targetId}`);
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value = false;
    }
  };

  const tableConfig = computed(() => config.value?.table);
  const formConfig = computed(() => config.value?.form);
  const apiConfig = computed(() => config.value?.api);
  const permissionsConfig = computed(() => config.value?.permissions);

  const canCreate = computed(() => permissionsConfig.value?.canCreate ?? true);
  const canUpdate = computed(() => permissionsConfig.value?.canUpdate ?? true);
  const canDelete = computed(() => permissionsConfig.value?.canDelete ?? true);

  watch(currentModuleId, (newId, oldId) => {
    if (newId && newId !== oldId && autoLoad) {
      loadConfig(newId);
    }
  });

  onMounted(() => {
    if (autoLoad && currentModuleId.value) {
      loadConfig();
    }
  });

  return {
    config,
    loading,
    error,
    currentModuleId,
    loadConfig,
    tableConfig,
    formConfig,
    apiConfig,
    permissionsConfig,
    canCreate,
    canUpdate,
    canDelete,
  };
}
