import { FormConfig } from './FormConfig';
import { TableConfig } from './TableConfig';

export interface ApiConfig {
  list?: string;
  create?: string;
  update?: string;
  delete?: string;
  query?: string; // 查询交易名
}

export interface MenuItem {
  id: string;
  path: string;
  title: string;
  icon?: string;
  description?: string;
  formConfig?: FormConfig;
  tableConfig?: TableConfig;
  api?: ApiConfig;
  children?: MenuItem[];
}

export interface MenuConfig {
  items: MenuItem[];
}
