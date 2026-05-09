export interface ApiConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface ModuleConfig {
  module: string;
  title: string;
  description?: string;
  apis: {
    list: ApiConfig;
    create: ApiConfig;
    update: ApiConfig;
    delete: ApiConfig;
    [key: string]: ApiConfig;
  };
  hooks?: {
    beforeLoad?: string;
    beforeSubmit?: string;
    afterSubmit?: string;
    onError?: string;
    [key: string]: string | undefined;
  };
  columns: ColumnConfig[];
  fields: FieldGroup[];
  buttons?: ButtonConfig;
  search?: SearchConfig;
  renders?: Record<string, string>;
}

export interface ColumnConfig {
  dataIndex?: string;
  key?: string;
  title: string;
  width?: number | string;
  [key: string]: any;
}

export interface FieldGroup {
  group: string;
  items: FieldConfig[];
}

export interface FieldConfig {
  component: string;
  name: string;
  label?: string;
  required?: boolean;
  rules?: any[];
  options?: Array<{ label: string; value: any }>;
  [key: string]: any;
}

export interface ButtonConfig {
  toolbar?: ButtonItem[];
  rowActions?: ButtonItem[];
  formActions?: {
    submit?: ButtonItem;
    cancel?: ButtonItem;
  };
}

export interface ButtonItem {
  component: string;
  text?: string;
  action: string;
  type?: string;
  danger?: boolean;
  size?: string;
  disabledWhen?: string;
  [key: string]: any;
}

export interface SearchConfig {
  fields: FieldConfig[];
  actions?: ButtonItem[];
}
