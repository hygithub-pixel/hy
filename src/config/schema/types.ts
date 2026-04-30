import type { FormItem } from '../../types/FormConfig';
import type { TableColumn } from '../../types/TableConfig';

export interface ApiConfig {
  list?: string;
  create?: string;
  update?: string;
  delete?: string;
  query?: string;
  detail?: string;
  export?: string;
  import?: string;
}

export interface TableConfig {
  columns: TableColumn[];
  pagination?: {
    currentPage?: number;
    pageSize?: number;
    pageSizes?: number[];
  };
  showSelection?: boolean;
  showIndex?: boolean;
  stripe?: boolean;
  border?: boolean;
  height?: string | number;
  maxHeight?: string | number;
  rowKey?: string;
  defaultSort?: {
    prop: string;
    order: 'ascending' | 'descending';
  };
}

export interface FormConfig {
  items: FormItem[];
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string;
  size?: 'large' | 'default' | 'small';
  inline?: boolean;
  disabled?: boolean;
}

export interface HookConfig {
  beforeLoad?: (params: any) => Promise<any> | any;
  afterLoad?: (data: any) => Promise<any> | any;
  beforeCreate?: (data: any) => Promise<any> | any;
  afterCreate?: (data: any, response: any) => Promise<void> | void;
  beforeUpdate?: (data: any) => Promise<any> | any;
  afterUpdate?: (data: any, response: any) => Promise<void> | void;
  beforeDelete?: (id: any) => Promise<boolean> | boolean;
  afterDelete?: (id: any, response: any) => Promise<void> | void;
  beforeSubmit?: (data: any, mode: 'create' | 'update') => Promise<any> | any;
  afterSubmit?: (data: any, mode: 'create' | 'update', response: any) => Promise<void> | void;
}

export interface PermissionConfig {
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canView?: boolean;
  customPermissions?: Record<string, boolean>;
}

export interface PluginConfig {
  name: string;
  enabled?: boolean;
  options?: Record<string, any>;
}

export interface ModuleConfig {
  id: string;
  path: string;
  title: string;
  icon?: string;
  description?: string;
  parent?: string;
  order?: number;
  hidden?: boolean;
  cache?: boolean;
  
  api: ApiConfig;
  table?: TableConfig;
  form?: FormConfig;
  hooks?: HookConfig;
  permissions?: PermissionConfig;
  plugins?: PluginConfig[];
  
  meta?: Record<string, any>;
}

export interface MenuGroupConfig {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  order?: number;
  hidden?: boolean;
  children: ModuleConfig[];
}

export type MenuConfig = ModuleConfig | MenuGroupConfig;

export interface AppConfig {
  modules: ModuleConfig[];
  menus: MenuConfig[];
  settings?: {
    title?: string;
    logo?: string;
    theme?: Record<string, any>;
  };
}

export function defineModuleConfig(config: ModuleConfig): ModuleConfig {
  return {
    ...config,
    cache: config.cache ?? true,
    hidden: config.hidden ?? false,
    order: config.order ?? 0,
  };
}

export function defineMenuGroupConfig(config: MenuGroupConfig): MenuGroupConfig {
  return {
    ...config,
    hidden: config.hidden ?? false,
    order: config.order ?? 0,
  };
}

export function defineAppConfig(config: AppConfig): AppConfig {
  return config;
}

export function isModuleConfig(config: MenuConfig): config is ModuleConfig {
  return 'api' in config;
}

export function isMenuGroupConfig(config: MenuConfig): config is MenuGroupConfig {
  return 'children' in config;
}
