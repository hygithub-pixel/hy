import { MenuItem } from '../../../types/MenuConfig';

const menus = import.meta.glob<{ default: MenuItem }>('./menus/*.json', { eager: true });

export const contentModuleMenus: MenuItem[] = Object.values(menus).map(module => module.default);
