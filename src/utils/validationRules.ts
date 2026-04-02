import type { FormItemRule } from 'element-plus';

export const buildValidationRule = (rule: any): FormItemRule => {
  const result: FormItemRule = {
    required: rule.required,
    message: rule.message,
    trigger: rule.trigger || 'blur'
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

  return result;
};

export const requiredRule = (message: string = '此项为必填项'): FormItemRule => ({
  required: true,
  message,
  trigger: 'blur'
});

export const emailRule = (message: string = '请输入有效的邮箱地址'): FormItemRule => ({
  type: 'email',
  message,
  trigger: 'blur'
});

export const phoneRule = (message: string = '请输入有效的手机号码'): FormItemRule => ({
  pattern: /^1[3-9]\d{9}$/,
  message,
  trigger: 'blur'
});

export const urlRule = (message: string = '请输入有效的URL地址'): FormItemRule => ({
  type: 'url',
  message,
  trigger: 'blur'
});
