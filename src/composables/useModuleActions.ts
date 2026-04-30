import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { pluginRegistry, type PluginContext } from '../plugins/core/plugin-registry';
import type { ModuleConfig, HookConfig } from '../config/schema/types';
import { dynamicApi } from '../api/dynamicApi';

export interface UseModuleActionsOptions {
  onSuccess?: (action: string, data: any) => void;
  onError?: (action: string, error: any) => void;
}

export function useModuleActions(options: UseModuleActionsOptions = {}) {
  const { onSuccess, onError } = options;

  const loading = ref(false);
  const currentConfig = ref<ModuleConfig | null>(null);

  const setConfig = (config: ModuleConfig) => {
    currentConfig.value = config;
  };

  const executeHook = async <T>(
    hookName: keyof HookConfig,
    data: any,
    ...args: any[]
  ): Promise<T | undefined> => {
    if (!currentConfig.value?.hooks?.[hookName]) {
      return undefined;
    }

    const hook = currentConfig.value.hooks[hookName];
    if (typeof hook === 'function') {
      return await (hook as Function)(data, ...args);
    }
    return undefined;
  };

  const createPluginContext = (data?: any, params?: any): PluginContext => ({
    moduleConfig: currentConfig.value!,
    formData: data,
    params: params,
  });

  const loadData = async (params: any = {}) => {
    if (!currentConfig.value) {
      throw new Error('Module config not set');
    }

    const config = currentConfig.value;
    loading.value = true;

    try {
      let processedParams = await executeHook('beforeLoad', params);
      processedParams = processedParams || params;

      await pluginRegistry.executeBeforeLoad(createPluginContext(undefined, processedParams));

      let result;
      const apiParams = processedParams as { page?: number; pageSize?: number };
      if (config.api.query) {
        result = await dynamicApi.query(config.api, apiParams);
      } else if (config.api.list) {
        result = await dynamicApi.list(config.api, apiParams);
      } else {
        throw new Error('No list or query API configured');
      }

      result = await executeHook('afterLoad', result);
      await pluginRegistry.executeAfterLoad(createPluginContext(undefined, processedParams));

      return result;
    } catch (error) {
      console.error('[useModuleActions] Load error:', error);
      onError?.('load', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createData = async (data: any) => {
    if (!currentConfig.value) {
      throw new Error('Module config not set');
    }

    const config = currentConfig.value;
    loading.value = true;

    try {
      let processedData = await executeHook('beforeCreate', data);
      processedData = processedData || data;

      processedData = await pluginRegistry.executeBeforeCreate(createPluginContext(processedData));

      const result = await dynamicApi.create(config.api, processedData);

      await executeHook('afterCreate', processedData, result);
      await pluginRegistry.executeAfterCreate(createPluginContext(processedData));

      message.success('创建成功');
      onSuccess?.('create', result);
      return result;
    } catch (error) {
      console.error('[useModuleActions] Create error:', error);
      message.error('创建失败');
      onError?.('create', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateData = async (id: any, data: any) => {
    if (!currentConfig.value) {
      throw new Error('Module config not set');
    }

    const config = currentConfig.value;
    loading.value = true;

    try {
      let processedData = await executeHook('beforeUpdate', data);
      processedData = processedData || data;

      processedData = await pluginRegistry.executeBeforeUpdate(createPluginContext(processedData));

      const result = await dynamicApi.update(config.api, id, processedData);

      await executeHook('afterUpdate', processedData, result);
      await pluginRegistry.executeAfterUpdate(createPluginContext(processedData));

      message.success('更新成功');
      onSuccess?.('update', result);
      return result;
    } catch (error) {
      console.error('[useModuleActions] Update error:', error);
      message.error('更新失败');
      onError?.('update', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteData = async (id: any) => {
    if (!currentConfig.value) {
      throw new Error('Module config not set');
    }

    const config = currentConfig.value;
    loading.value = true;

    try {
      const canDelete = await executeHook('beforeDelete', id);
      if (canDelete === false) {
        return false;
      }

      const pluginCanDelete = await pluginRegistry.executeBeforeDelete(createPluginContext(undefined, { id }));
      if (pluginCanDelete === false) {
        return false;
      }

      const result = await dynamicApi.delete(config.api, id);

      await executeHook('afterDelete', id, result);
      await pluginRegistry.executeAfterDelete(createPluginContext(undefined, { id }));

      message.success('删除成功');
      onSuccess?.('delete', result);
      return true;
    } catch (error) {
      console.error('[useModuleActions] Delete error:', error);
      message.error('删除失败');
      onError?.('delete', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    currentConfig,
    setConfig,
    loadData,
    createData,
    updateData,
    deleteData,
  };
}
