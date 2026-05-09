export const componentMap: Record<string, string> = {
  'a-input': 'a-input',
  'a-input-password': 'a-input-password',
  'a-input-number': 'a-input-number',
  'a-textarea': 'a-textarea',
  'a-select': 'a-select',
  'a-radio-group': 'a-radio-group',
  'a-checkbox-group': 'a-checkbox-group',
  'a-date-picker': 'a-date-picker',
  'a-range-picker': 'a-range-picker',
  'a-upload': 'a-upload',
  'a-switch': 'a-switch',
  'a-tree-select': 'a-tree-select',
};

export const optionComponents: Record<string, string> = {
  'a-select': 'a-select-option',
  'a-radio-group': 'a-radio',
  'a-checkbox-group': 'a-checkbox',
};

export const getComponent = (componentName: string): string => {
  return componentMap[componentName] || 'a-input';
};

export const getOptionComponent = (componentName: string): string => {
  return optionComponents[componentName] || 'a-select-option';
};

export const hasOptions = (componentName: string): boolean => {
  return ['a-select', 'a-radio-group', 'a-checkbox-group'].includes(componentName);
};
