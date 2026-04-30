export const componentRegistry = {
  'a-input': 'a-input',
  'a-switch': 'a-switch',
  'a-select': 'a-select',
  'a-date-picker': 'a-date-picker',
  'a-upload': 'a-upload',
  'a-tag': 'a-tag',
  'a-modal': 'a-modal',
  'a-checkbox': 'a-checkbox',
  'a-button': 'a-button'
};

export type ComponentName = keyof typeof componentRegistry;

export const resolveComponent = (name: string) => {
  return componentRegistry[name as ComponentName] || name;
};
