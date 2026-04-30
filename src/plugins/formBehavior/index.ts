/**
 * 表单行为插件系统
 */
export interface FormBehaviorPlugin {
  name: string;
  install: (form: any) => void;
  uninstall?: (form: any) => void;
}

class FormBehaviorPluginManager {
  private plugins: Record<string, FormBehaviorPlugin> = {};

  register(plugin: FormBehaviorPlugin) {
    this.plugins[plugin.name] = plugin;
  }

  get(name: string): FormBehaviorPlugin | undefined {
    return this.plugins[name];
  }

  installAll(form: any) {
    Object.values(this.plugins).forEach(plugin => {
      plugin.install(form);
    });
  }

  uninstallAll(form: any) {
    Object.values(this.plugins).forEach(plugin => {
      plugin.uninstall?.(form);
    });
  }

  getAll(): Record<string, FormBehaviorPlugin> {
    return { ...this.plugins };
  }
}

export const formBehaviorPluginManager = new FormBehaviorPluginManager();

// 注册内置表单行为插件
formBehaviorPluginManager.register({
  name: 'autoSave',
  install: (form) => {
    form.enableAutoSave = true;
    console.log('Auto save plugin installed');
  }
});

formBehaviorPluginManager.register({
  name: 'validationDebounce',
  install: (_form) => {
    console.log('Validation debounce plugin installed');
  }
});
