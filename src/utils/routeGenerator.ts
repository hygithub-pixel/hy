import type { RouteRecordRaw } from 'vue-router';
import type { MenuItem } from '../types/menu';

const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/users',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '404' },
  },
];

const generateRoutesFromMenu = (menus: MenuItem[]): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = [];

  const processMenuItem = (item: MenuItem) => {
    if (item.path && item.component) {
      const route: RouteRecordRaw = {
        path: item.path.replace('/', ''),
        name: item.path.replace('/', ''),
        component: () => import('../views/ModulePage.vue'),
        meta: {
          title: item.title,
          config: item.config,
        },
      };
      routes.push(route);
    }

    if (item.children) {
      item.children.forEach(processMenuItem);
    }
  };

  menus.forEach(processMenuItem);
  return routes;
};

export const generateRoutes = async (): Promise<RouteRecordRaw[]> => {
  const menuConfig = await import('../config/menu.json');
  const menus = menuConfig.default?.menus || menuConfig.menus || [];
  const dynamicRoutes = generateRoutesFromMenu(menus);
  return [...staticRoutes, ...dynamicRoutes];
};

export type { MenuItem };
