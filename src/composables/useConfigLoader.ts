import type { ModuleConfig } from '../types/moduleConfig';

const configCache = new Map<string, ModuleConfig>();

export const useConfigLoader = () => {
  const loadConfig = async (moduleName: string): Promise<ModuleConfig> => {
    if (configCache.has(moduleName)) {
      return configCache.get(moduleName)!;
    }

    const config = await import(`../config/${moduleName}.json`) as ModuleConfig;
    configCache.set(moduleName, config);
    return config;
  };

  const clearCache = (moduleName?: string) => {
    if (moduleName) {
      configCache.delete(moduleName);
    } else {
      configCache.clear();
    }
  };

  return {
    loadConfig,
    clearCache
  };
};
