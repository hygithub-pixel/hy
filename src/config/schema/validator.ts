import type { ModuleConfig, MenuGroupConfig, MenuConfig, AppConfig } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  value?: any;
}

export interface ValidationWarning {
  path: string;
  message: string;
  value?: any;
}

export class ConfigValidator {
  validateModuleConfig(config: ModuleConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!config.id) {
      errors.push({ path: 'id', message: 'Module id is required' });
    }

    if (!config.path) {
      errors.push({ path: 'path', message: 'Module path is required' });
    } else if (!config.path.startsWith('/')) {
      errors.push({ path: 'path', message: 'Module path must start with /' });
    }

    if (!config.title) {
      errors.push({ path: 'title', message: 'Module title is required' });
    }

    if (!config.api) {
      errors.push({ path: 'api', message: 'API config is required' });
    } else {
      if (!config.api.list && !config.api.query) {
        warnings.push({ path: 'api', message: 'API list or query endpoint is recommended' });
      }
    }

    if (config.table && config.table.columns) {
      config.table.columns.forEach((col, index) => {
        if (!col.prop) {
          errors.push({ path: `table.columns[${index}].prop`, message: 'Column prop is required' });
        }
        if (!col.label) {
          warnings.push({ path: `table.columns[${index}].label`, message: 'Column label is recommended' });
        }
      });
    }

    if (config.form && config.form.items) {
      config.form.items.forEach((item, index) => {
        if (!item.field) {
          errors.push({ path: `form.items[${index}].field`, message: 'Form item field is required' });
        }
        if (!item.label) {
          warnings.push({ path: `form.items[${index}].label`, message: 'Form item label is recommended' });
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateMenuGroupConfig(config: MenuGroupConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!config.id) {
      errors.push({ path: 'id', message: 'Menu group id is required' });
    }

    if (!config.title) {
      errors.push({ path: 'title', message: 'Menu group title is required' });
    }

    if (!config.children || config.children.length === 0) {
      warnings.push({ path: 'children', message: 'Menu group has no children' });
    } else {
      config.children.forEach((child, index) => {
        const childResult = this.validateModuleConfig(child);
        childResult.errors.forEach(err => {
          errors.push({
            path: `children[${index}].${err.path}`,
            message: err.message,
            value: err.value,
          });
        });
        childResult.warnings.forEach(warn => {
          warnings.push({
            path: `children[${index}].${warn.path}`,
            message: warn.message,
            value: warn.value,
          });
        });
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateAppConfig(config: AppConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!config.modules || config.modules.length === 0) {
      warnings.push({ path: 'modules', message: 'No modules defined' });
    } else {
      const idSet = new Set<string>();
      const pathSet = new Set<string>();

      config.modules.forEach((module, index) => {
        const moduleResult = this.validateModuleConfig(module);
        moduleResult.errors.forEach(err => {
          errors.push({
            path: `modules[${index}].${err.path}`,
            message: err.message,
            value: err.value,
          });
        });
        moduleResult.warnings.forEach(warn => {
          warnings.push({
            path: `modules[${index}].${warn.path}`,
            message: warn.message,
            value: warn.value,
          });
        });

        if (idSet.has(module.id)) {
          errors.push({
            path: `modules[${index}].id`,
            message: `Duplicate module id: ${module.id}`,
          });
        }
        idSet.add(module.id);

        if (pathSet.has(module.path)) {
          errors.push({
            path: `modules[${index}].path`,
            message: `Duplicate module path: ${module.path}`,
          });
        }
        pathSet.add(module.path);
      });
    }

    if (config.menus) {
      config.menus.forEach((menu, index) => {
        const menuResult = this.validateMenuConfig(menu);
        menuResult.errors.forEach(err => {
          errors.push({
            path: `menus[${index}].${err.path}`,
            message: err.message,
            value: err.value,
          });
        });
        menuResult.warnings.forEach(warn => {
          warnings.push({
            path: `menus[${index}].${warn.path}`,
            message: warn.message,
            value: warn.value,
          });
        });
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateMenuConfig(config: MenuConfig): ValidationResult {
    if ('children' in config) {
      return this.validateMenuGroupConfig(config);
    }
    return this.validateModuleConfig(config);
  }
}

export const configValidator = new ConfigValidator();

export function validateConfig(config: ModuleConfig | MenuGroupConfig | AppConfig): ValidationResult {
  if ('modules' in config) {
    return configValidator.validateAppConfig(config);
  }
  if ('children' in config) {
    return configValidator.validateMenuGroupConfig(config);
  }
  return configValidator.validateModuleConfig(config);
}
