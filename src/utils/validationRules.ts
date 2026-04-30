import { validationPluginManager } from '../plugins/validation';

export interface ValidationRule {
  required?: boolean;
  message?: string;
  trigger?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (value: any, rule: any, callback: any, formData?: any) => void;
  type?: string;
  email?: boolean;
  url?: boolean;
}

export const isEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const isUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isPhone = (value: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(value);
};

export const isIdCard = (value: string): boolean => {
  const idCardRegex = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(value);
};

export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value)) && value.trim() !== '';
};

export const isInteger = (value: string): boolean => {
  const integerRegex = /^-?\d+$/;
  return integerRegex.test(value);
};

export const isDecimal = (value: string): boolean => {
  const decimalRegex = /^-?\d+\.\d+$/;
  return decimalRegex.test(value);
};

export const isPositive = (value: number): boolean => {
  return value > 0;
};

export const isNegative = (value: number): boolean => {
  return value < 0;
};

export const isDate = (value: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const isDatetime = (value: string): boolean => {
  const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!datetimeRegex.test(value)) return false;
  const date = new Date(value.replace(' ', 'T'));
  return !isNaN(date.getTime());
};

export const isLength = (value: string, length: number | [number, number]): boolean => {
  const len = value.length;
  if (Array.isArray(length)) {
    return len >= length[0] && len <= length[1];
  }
  return len === length;
};

export const isBetween = (value: number, range: [number, number]): boolean => {
  return value >= range[0] && value <= range[1];
};

export const isInEnum = <T>(value: T, enumValues: T[]): boolean => {
  return enumValues.includes(value);
};

export const buildValidationRule = (rule: any): ValidationRule => {
  if (rule.type && validationPluginManager.get(rule.type)) {
    return {
      validator: (value: any, ruleObj: any, callback: any) => {
        const plugin = validationPluginManager.get(ruleObj.type);
        if (plugin) {
          const result = plugin.validate(value, ruleObj, {});
          if (result === true) {
            callback();
          } else {
            callback(new Error(result || plugin.message(ruleObj)));
          }
        } else {
          callback();
        }
      },
      trigger: rule.trigger || 'blur',
      message: rule.message
    };
  }

  const result: ValidationRule = {
    required: rule.required,
    message: rule.message,
    trigger: rule.trigger || 'blur',
  };

  if (rule.min !== undefined) {
    result.min = rule.min;
  }
  if (rule.max !== undefined) {
    result.max = rule.max;
  }
  if (rule.pattern) {
    result.pattern = new RegExp(rule.pattern);
  }
  if (rule.validator) {
    result.validator = rule.validator;
  }
  if (rule.email) {
    result.type = 'email';
  }
  if (rule.url) {
    result.type = 'url';
  }

  return result;
};

export const requiredRule = (message: string = '此项为必填项'): ValidationRule => ({
  required: true,
  message,
  trigger: 'blur',
});

export const emailRule = (message: string = '请输入有效的邮箱地址'): ValidationRule => ({
  type: 'email',
  message,
  trigger: 'blur',
});

export const phoneRule = (message: string = '请输入有效的手机号码'): ValidationRule => ({
  pattern: /^1[3-9]\d{9}$/,
  message,
  trigger: 'blur',
});

export const urlRule = (message: string = '请输入有效的URL地址'): ValidationRule => ({
  type: 'url',
  message,
  trigger: 'blur',
});

export const validationRules = {
  required: requiredRule,
  email: emailRule,
  phone: phoneRule,
  url: urlRule,
};
