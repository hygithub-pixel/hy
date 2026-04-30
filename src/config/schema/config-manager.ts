import { ref, computed } from 'vue';
import type { ModuleConfig, MenuConfig, AppConfig } from './types';
import { configValidator, type ValidationResult } from './validator';

export type ConfigMiddleware = (
  config: ModuleConfig,
  moduleId: string
) => ModuleConfig | Promise<ModuleConfig>;

export interface ConfigManagerOptions {
  validateOnRegister?: boolean;
  enableCache?: boolean;
}

class ConfigManager {
  private modules = new Map<string, ModuleConfig>();
  private menus = new Map<string, MenuConfig>();
  private middlewares: ConfigMiddleware[] = [];
  private options: ConfigManagerOptions;
  private cache = new Map<string, any>();

  private _initialized = ref(false);

  constructor(options: ConfigManagerOptions = {}) {
    this.options = {
      validateOnRegister: true,
      enableCache: true,
      ...options,
    };
  }

  get initialized() {
    return this._initialized.value;
  }

  registerModule(config: ModuleConfig): ValidationResult {
    if (this.options.validateOnRegister) {
      const result = configValidator.validateModuleConfig(config);
      if (!result.valid) {
        console.error(`[ConfigManager] Invalid module config: ${config.id}`, result.errors);
        return result;
      }
      if (result.warnings.length > 0) {
        console.warn(`[ConfigManager] Module config warnings: ${config.id}`, result.warnings);
      }
    }

    this.modules.set(config.id, config);
    this.cache.delete(config.id);
    console.log(`[ConfigManager] Module registered: ${config.id}`);
    return { valid: true, errors: [], warnings: [] };
  }

  registerModules(configs: ModuleConfig[]): ValidationResult[] {
    return configs.map(config => this.registerModule(config));
  }

  registerMenu(config: MenuConfig): ValidationResult {
    if ('children' in config) {
      const result = configValidator.validateMenuGroupConfig(config);
      if (!result.valid) {
        console.error(`[ConfigManager] Invalid menu group config: ${config.id}`, result.errors);
        return result;
      }
    } else {
      const result = configValidator.validateModuleConfig(config);
      if (!result.valid) {
        console.error(`[ConfigManager] Invalid menu config: ${config.id}`, result.errors);
        return result;
      }
    }

    this.menus.set(config.id, config);
    console.log(`[ConfigManager] Menu registered: ${config.id}`);
    return { valid: true, errors: [], warnings: [] };
  }

  registerMenus(configs: MenuConfig[]): ValidationResult[] {
    return configs.map(config => this.registerMenu(config));
  }

  use(middleware: ConfigMiddleware): void {
    this.middlewares.push(middleware);
  }

  async getModule(moduleId: string): Promise<ModuleConfig | undefined> {
    let config = this.modules.get(moduleId);

    if (!config) {
      console.warn(`[ConfigManager] Module not found: ${moduleId}`);
      return undefined;
    }

    if (this.options.enableCache && this.cache.has(moduleId)) {
      return this.cache.get(moduleId);
    }

    for (const middleware of this.middlewares) {
      config = await middleware(config, moduleId);
      if (!config) {
        console.error(`[ConfigManager] Middleware returned undefined for: ${moduleId}`);
        return undefined;
      }
    }

    if (this.options.enableCache) {
      this.cache.set(moduleId, config);
    }

    return config;
  }

  getModuleSync(moduleId: string): ModuleConfig | undefined {
    return this.modules.get(moduleId);
  }

  getMenu(menuId: string): MenuConfig | undefined {
    return this.menus.get(menuId);
  }

  getAllModules(): ModuleConfig[] {
    return Array.from(this.modules.values());
  }

  getAllMenus(): MenuConfig[] {
    return Array.from(this.menus.values());
  }

  getModuleByPath(path: string): ModuleConfig | undefined {
    return Array.from(this.modules.values()).find(m => m.path === path);
  }

  getMenuByPath(path: string): MenuConfig | undefined {
    return Array.from(this.menus.values()).find(m => m.path === path);
  }

  findModuleByPath(path: string): ModuleConfig | undefined {
    let module = this.getModuleByPath(path);
    if (module) return module;

    for (const menu of this.menus.values()) {
      if ('children' in menu) {
        module = menu.children.find(m => m.path === path);
        if (module) return module;
      }
    }

    return undefined;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('[ConfigManager] Cache cleared');
  }

  removeModule(moduleId: string): boolean {
    const result = this.modules.delete(moduleId);
    this.cache.delete(moduleId);
    if (result) {
      console.log(`[ConfigManager] Module removed: ${moduleId}`);
    }
    return result;
  }

  removeMenu(menuId: string): boolean {
    const result = this.menus.delete(menuId);
    if (result) {
      console.log(`[ConfigManager] Menu removed: ${menuId}`);
    }
    return result;
  }

  initialize(appConfig?: AppConfig): void {
    if (appConfig) {
      if (appConfig.modules) {
        this.registerModules(appConfig.modules);
      }
      if (appConfig.menus) {
        this.registerMenus(appConfig.menus);
      }
    }
    this._initialized.value = true;
    console.log('[ConfigManager] Initialized');
  }

  reset(): void {
    this.modules.clear();
    this.menus.clear();
    this.middlewares = [];
    this.cache.clear();
    this._initialized.value = false;
    console.log('[ConfigManager] Reset');
  }
}

export const configManager = new ConfigManager();

export function useConfigManager() {
  return {
    configManager,
    initialized: computed(() => configManager.initialized),
    modules: computed(() => configManager.getAllModules()),
    menus: computed(() => configManager.getAllMenus()),
  };
}
