import type { MenuItem } from '../types/menu';
import type { SystemConfig } from '../types/system';

export interface ModuleConfigInfo {
  name: string;
  module: string;
  title: string;
  description?: string;
}

let systemConfig: SystemConfig | null = null;

export const loadSystemConfig = async (): Promise<SystemConfig> => {
  if (!systemConfig) {
    const config = await import('../config/system.json');
    systemConfig = config.default || config;
  }
  return systemConfig;
};

export const scanModuleConfigs = async (): Promise<ModuleConfigInfo[]> => {
  const modules: ModuleConfigInfo[] = [];
  const configFiles = import.meta.glob('../config/*.json', { eager: true });
  
  for (const path in configFiles) {
    if (path.includes('menu.json') || path.includes('system.json')) continue;
    
    const config = configFiles[path] as any;
    if (config?.module) {
      const fileName = path.replace('../config/', '').replace('.json', '');
      modules.push({
        name: fileName,
        module: config.module,
        title: config.title,
        description: config.description,
      });
    }
  }
  
  return modules;
};

export const getIconByModule = async (moduleName: string): Promise<string> => {
  const system = await loadSystemConfig();
  return system.iconMap[moduleName] || 'FileOutlined';
};

export const getIcon = async (iconKey: string): Promise<string> => {
  const system = await loadSystemConfig();
  return system.iconMap[iconKey] || 'FileOutlined';
};

export const generateMenusFromConfigs = async (): Promise<MenuItem[]> => {
  const system = await loadSystemConfig();
  const modules = await scanModuleConfigs();
  const menus: MenuItem[] = [];

  for (const [categoryKey, category] of Object.entries(system.menuCategories)) {
    const categoryModules = modules.filter(m => category.modules.includes(m.name));
    if (categoryModules.length > 0) {
      menus.push({
        key: categoryKey,
        title: category.title,
        icon: system.iconMap[category.icon] || 'SettingOutlined',
        children: categoryModules.map(m => ({
          key: `/${m.name}s`,
          title: m.title,
          icon: system.iconMap[m.name] || 'FileOutlined',
          path: `/${m.name}s`,
          config: m.name,
        })),
      });
    }
  }

  return menus;
};

export const getHomeRoute = async (): Promise<string> => {
  const system = await loadSystemConfig();
  return system.routes.home;
};
