import type { MenuItem } from '../types/menu';

export interface ModuleConfigInfo {
  name: string;
  module: string;
  title: string;
  description?: string;
}

const iconMap: Record<string, string> = {
  user: 'UserOutlined',
  role: 'SafetyCertificateOutlined',
  department: 'ApartmentOutlined',
  menu: 'MenuOutlined',
  product: 'AppstoreOutlined',
  order: 'FileTextOutlined',
};

export const getIconByModule = (moduleName: string): string => {
  return iconMap[moduleName] || 'FileOutlined';
};

export const scanModuleConfigs = async (): Promise<ModuleConfigInfo[]> => {
  const modules: ModuleConfigInfo[] = [];
  
  const configFiles = import.meta.glob('../config/*.json', { eager: true });
  
  for (const path in configFiles) {
    if (path === '../config/menu.json') continue;
    
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

export const getModuleConfigNames = async (): Promise<string[]> => {
  const configs = await scanModuleConfigs();
  return configs.map(c => c.name);
};

export const getModuleConfigByName = async (name: string): Promise<ModuleConfigInfo | undefined> => {
  const configs = await scanModuleConfigs();
  return configs.find(c => c.name === name);
};

export const generateMenusFromConfigs = async (): Promise<MenuItem[]> => {
  const modules = await scanModuleConfigs();
  const menus: MenuItem[] = [];

  const systemModules = modules.filter(c => 
    ['user', 'role', 'department', 'menu'].includes(c.name)
  );
  if (systemModules.length > 0) {
    menus.push({
      key: 'system',
      title: '系统管理',
      icon: 'SettingOutlined',
      children: systemModules.map(m => ({
        key: `/${m.name}s`,
        title: m.title,
        icon: getIconByModule(m.name),
        path: `/${m.name}s`,
        config: m.name,
      })),
    });
  }

  const businessModules = modules.filter(c =>
    ['product', 'order'].includes(c.name)
  );
  if (businessModules.length > 0) {
    menus.push({
      key: 'business',
      title: '业务管理',
      icon: 'ShoppingCartOutlined',
      children: businessModules.map(m => ({
        key: `/${m.name}s`,
        title: m.title,
        icon: getIconByModule(m.name),
        path: `/${m.name}s`,
        config: m.name,
      })),
    });
  }

  return menus;
};
