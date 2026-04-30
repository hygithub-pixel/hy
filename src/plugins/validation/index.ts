/**
 * 验证规则插件系统
 */
export interface ValidationRulePlugin {
  name: string;
  validate: (value: any, rule: any, formData: any) => boolean | string;
  message: (rule: any) => string;
}

class ValidationPluginManager {
  private plugins: Record<string, ValidationRulePlugin> = {};

  register(plugin: ValidationRulePlugin) {
    this.plugins[plugin.name] = plugin;
  }

  get(name: string): ValidationRulePlugin | undefined {
    return this.plugins[name];
  }

  getAll(): Record<string, ValidationRulePlugin> {
    return { ...this.plugins };
  }
}

export const validationPluginManager = new ValidationPluginManager();

// 注册内置验证规则
validationPluginManager.register({
  name: 'required',
  validate: (value, _rule) => !!value,
  message: (rule) => rule.message || '此字段为必填项'
});

validationPluginManager.register({
  name: 'minLength',
  validate: (value, rule) => (value || '').length >= rule.min,
  message: (rule) => rule.message || `长度不能少于 ${rule.min} 个字符`
});

validationPluginManager.register({
  name: 'maxLength',
  validate: (value, rule) => (value || '').length <= rule.max,
  message: (rule) => rule.message || `长度不能超过 ${rule.max} 个字符`
});

validationPluginManager.register({
  name: 'email',
  validate: (value, _rule) => {
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  message: (rule) => rule.message || '请输入有效的邮箱地址'
});

validationPluginManager.register({
  name: 'url',
  validate: (value, _rule) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  message: (rule) => rule.message || '请输入有效的URL'
});
