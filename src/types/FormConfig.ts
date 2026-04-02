export interface FormItemOption {
  label: string;
  value: string | number;
}

export interface FormValidationRule {
  required?: boolean;
  message?: string;
  trigger?: 'blur' | 'change' | ('blur' | 'change')[];
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (rule: FormValidationRule, value: unknown, callback: (error?: Error) => void) => void;
  minLength?: number;
  maxLength?: number;
  enum?: (string | number)[];
  whitespace?: boolean;
  email?: boolean;
  url?: boolean;
  phone?: boolean;
  idCard?: boolean;
  numeric?: boolean;
  integer?: boolean;
  decimal?: boolean;
  positive?: boolean;
  negative?: boolean;
  date?: boolean;
  datetime?: boolean;
  between?: [number, number];
  length?: number | [number, number];
}

export interface FormItemDependency {
  field: string;
  values: (string | number)[];
  condition: 'equal' | 'notEqual' | 'contains' | 'notContains';
}

export interface FormComponent {
  type: string;
  props?: Record<string, unknown>;
  children?: (FormComponent | string)[];
  vModel?: string;
  vShow?: string;
  vIf?: string;
}

export interface FormItem {
  type: 'upload' | 'richText' | 'component';
  label: string;
  field: string;
  value?: unknown;
  placeholder?: string;
  options?: FormItemOption[];
  rules?: FormValidationRule[];
  dependencies?: FormItemDependency[];
  props?: Record<string, unknown>;
  component?: FormComponent | string;
  vShow?: string;
  vIf?: string;
  children?: FormItem[];
}

export interface FormConfig {
  items: FormItem[];
  components?: Record<string, any>;
  labelWidth?: string;
  labelPosition?: 'left' | 'top' | 'right';
  size?: 'large' | 'default' | 'small';
}

export type FormFieldValue = string | number | boolean | Date | string[] | number[] | File | null | undefined;
export type FormData = Record<string, FormFieldValue>;
