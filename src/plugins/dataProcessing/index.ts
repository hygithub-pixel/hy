/**
 * 数据处理插件系统
 */
export interface DataProcessingPlugin {
  name: string;
  process: (value: any, options: any, formData: any) => any;
}

class DataProcessingPluginManager {
  private plugins: Record<string, DataProcessingPlugin> = {};

  register(plugin: DataProcessingPlugin) {
    this.plugins[plugin.name] = plugin;
  }

  get(name: string): DataProcessingPlugin | undefined {
    return this.plugins[name];
  }

  process(name: string, value: any, options: any, formData: any): any {
    const plugin = this.get(name);
    return plugin ? plugin.process(value, options, formData) : value;
  }

  getAll(): Record<string, DataProcessingPlugin> {
    return { ...this.plugins };
  }
}

export const dataProcessingPluginManager = new DataProcessingPluginManager();

// 注册内置数据处理插件
dataProcessingPluginManager.register({
  name: 'dateFormat',
  process: (value, options) => {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString(options.locale || 'zh-CN');
  }
});

dataProcessingPluginManager.register({
  name: 'numberFormat',
  process: (value, options) => {
    if (value === undefined || value === null) return '';
    return Number(value).toLocaleString(options.locale || 'zh-CN', {
      minimumFractionDigits: options.minDigits || 0,
      maximumFractionDigits: options.maxDigits || 2
    });
  }
});

dataProcessingPluginManager.register({
  name: 'phoneFormat',
  process: (value) => {
    if (!value) return '';
    // 格式化手机号：138****8888
    return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
});

dataProcessingPluginManager.register({
  name: 'trim',
  process: (value) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }
});
