import type { ModuleConfig } from '../../config/schema/types';

export interface PluginContext {
  moduleConfig: ModuleConfig;
  formData?: any;
  tableData?: any;
  params?: any;
}

export interface Plugin {
  name: string;
  version?: string;
  description?: string;
  enabled?: boolean;
  priority?: number;
  install?: (ctx: PluginContext) => void;
  uninstall?: () => void;
  beforeLoad?: (ctx: PluginContext) => Promise<any> | any;
  afterLoad?: (ctx: PluginContext) => Promise<any> | any;
  beforeCreate?: (ctx: PluginContext) => Promise<any> | any;
  afterCreate?: (ctx: PluginContext) => Promise<void> | void;
  beforeUpdate?: (ctx: PluginContext) => Promise<any> | any;
  afterUpdate?: (ctx: PluginContext) => Promise<void> | void;
  beforeDelete?: (ctx: PluginContext) => Promise<boolean> | boolean;
  afterDelete?: (ctx: PluginContext) => Promise<void> | void;
  beforeSubmit?: (ctx: PluginContext) => Promise<any> | any;
  afterSubmit?: (ctx: PluginContext) => Promise<void> | void;
}

class PluginRegistry {
  private plugins = new Map<string, Plugin>();
  private installedPlugins = new Set<string>();

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`[PluginRegistry] Plugin "${plugin.name}" already registered, overwriting`);
    }
    this.plugins.set(plugin.name, {
      ...plugin,
      enabled: plugin.enabled ?? true,
      priority: plugin.priority ?? 100,
    });
    console.log(`[PluginRegistry] Plugin registered: ${plugin.name}`);
  }

  unregister(pluginName: string): boolean {
    if (this.installedPlugins.has(pluginName)) {
      const plugin = this.plugins.get(pluginName);
      if (plugin?.uninstall) {
        plugin.uninstall();
      }
      this.installedPlugins.delete(pluginName);
    }
    const result = this.plugins.delete(pluginName);
    if (result) {
      console.log(`[PluginRegistry] Plugin unregistered: ${pluginName}`);
    }
    return result;
  }

  install(pluginName: string, ctx: PluginContext): boolean {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      console.warn(`[PluginRegistry] Plugin not found: ${pluginName}`);
      return false;
    }
    if (!plugin.enabled) {
      console.warn(`[PluginRegistry] Plugin is disabled: ${pluginName}`);
      return false;
    }
    if (this.installedPlugins.has(pluginName)) {
      console.warn(`[PluginRegistry] Plugin already installed: ${pluginName}`);
      return true;
    }

    if (plugin.install) {
      plugin.install(ctx);
    }
    this.installedPlugins.add(pluginName);
    console.log(`[PluginRegistry] Plugin installed: ${pluginName}`);
    return true;
  }

  uninstall(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      return;
    }
    if (plugin.uninstall) {
      plugin.uninstall();
    }
    this.installedPlugins.delete(pluginName);
    console.log(`[PluginRegistry] Plugin uninstalled: ${pluginName}`);
  }

  getPlugin(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName);
  }

  getEnabledPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
      .filter(p => p.enabled)
      .sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  }

  getInstalledPlugins(): Plugin[] {
    return Array.from(this.installedPlugins)
      .map(name => this.plugins.get(name))
      .filter((p): p is Plugin => p !== undefined);
  }

  async executeHook(
    hookName: keyof Plugin,
    ctx: PluginContext
  ): Promise<any> {
    const plugins = this.getEnabledPlugins();
    let result: any;

    for (const plugin of plugins) {
      const hook = plugin[hookName];
      if (typeof hook === 'function') {
        try {
          const hookResult = await hook(ctx);
          if (hookResult !== undefined) {
            result = hookResult;
            if (ctx.formData && hookName.includes('before')) {
              ctx.formData = hookResult;
            }
          }
        } catch (error) {
          console.error(`[PluginRegistry] Error in plugin "${plugin.name}" hook "${hookName}":`, error);
          throw error;
        }
      }
    }

    return result;
  }

  async executeBeforeLoad(ctx: PluginContext): Promise<any> {
    return this.executeHook('beforeLoad', ctx);
  }

  async executeAfterLoad(ctx: PluginContext): Promise<any> {
    return this.executeHook('afterLoad', ctx);
  }

  async executeBeforeCreate(ctx: PluginContext): Promise<any> {
    return this.executeHook('beforeCreate', ctx);
  }

  async executeAfterCreate(ctx: PluginContext): Promise<void> {
    await this.executeHook('afterCreate', ctx);
  }

  async executeBeforeUpdate(ctx: PluginContext): Promise<any> {
    return this.executeHook('beforeUpdate', ctx);
  }

  async executeAfterUpdate(ctx: PluginContext): Promise<void> {
    await this.executeHook('afterUpdate', ctx);
  }

  async executeBeforeDelete(ctx: PluginContext): Promise<boolean> {
    const plugins = this.getEnabledPlugins();
    for (const plugin of plugins) {
      if (plugin.beforeDelete) {
        const canDelete = await plugin.beforeDelete(ctx);
        if (!canDelete) {
          return false;
        }
      }
    }
    return true;
  }

  async executeAfterDelete(ctx: PluginContext): Promise<void> {
    await this.executeHook('afterDelete', ctx);
  }

  async executeBeforeSubmit(ctx: PluginContext): Promise<any> {
    return this.executeHook('beforeSubmit', ctx);
  }

  async executeAfterSubmit(ctx: PluginContext): Promise<void> {
    await this.executeHook('afterSubmit', ctx);
  }

  clear(): void {
    for (const pluginName of this.installedPlugins) {
      this.uninstall(pluginName);
    }
    this.plugins.clear();
    console.log('[PluginRegistry] All plugins cleared');
  }
}

export const pluginRegistry = new PluginRegistry();

export function usePluginRegistry() {
  return {
    pluginRegistry,
    register: (plugin: Plugin) => pluginRegistry.register(plugin),
    unregister: (name: string) => pluginRegistry.unregister(name),
    install: (name: string, ctx: PluginContext) => pluginRegistry.install(name, ctx),
    uninstall: (name: string) => pluginRegistry.uninstall(name),
    getPlugin: (name: string) => pluginRegistry.getPlugin(name),
    getEnabledPlugins: () => pluginRegistry.getEnabledPlugins(),
    getInstalledPlugins: () => pluginRegistry.getInstalledPlugins(),
  };
}
