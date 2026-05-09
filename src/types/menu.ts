export interface MenuItem {
  key: string;
  title: string;
  icon?: string;
  path?: string;
  component?: string;
  config?: string;
  children?: MenuItem[];
}

export interface MenuConfig {
  menus: MenuItem[];
}
