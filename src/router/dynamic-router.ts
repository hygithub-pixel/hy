import type { RouteRecordRaw } from 'vue-router';
import type { ModuleConfig, MenuConfig } from '../config/schema/types';
import { configManager } from '../config/schema/config-manager';

export interface DynamicRouteOptions {
  layoutComponent?: () => Promise<any>;
  moduleComponent?: () => Promise<any>;
  loginPath?: string;
  dashboardPath?: string;
}

const defaultLayoutComponent = () => import('../components/layout/MainLayout.vue');
const defaultModuleComponent = () => import('../views/ModulePage.vue');

export function createModuleRoute(
  config: ModuleConfig,
  options: DynamicRouteOptions = {}
): RouteRecordRaw {
  const {
    moduleComponent = defaultModuleComponent,
  } = options;

  return {
    path: config.path.replace(/^\//, ''),
    name: config.id,
    component: moduleComponent,
    meta: {
      title: config.title,
      icon: config.icon,
      configId: config.id,
      cache: config.cache ?? true,
      hidden: config.hidden ?? false,
      permissions: config.permissions,
      ...config.meta,
    },
  };
}

export function createDynamicRoutes(
  modules: ModuleConfig[],
  options: DynamicRouteOptions = {}
): RouteRecordRaw[] {
  return modules
    .filter(m => !m.hidden)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(config => createModuleRoute(config, options));
}

export function createMenuRoutes(
  menus: MenuConfig[],
  options: DynamicRouteOptions = {}
): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];

  for (const menu of menus) {
    if ('children' in menu) {
      const children = menu.children
        .filter(m => !m.hidden)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(config => createModuleRoute(config, options));
      routes.push(...children);
    } else {
      if (!menu.hidden) {
        routes.push(createModuleRoute(menu, options));
      }
    }
  }

  return routes;
}

export function createLayoutRoute(
  children: RouteRecordRaw[],
  options: DynamicRouteOptions = {}
): RouteRecordRaw {
  const {
    layoutComponent = defaultLayoutComponent,
    dashboardPath = '/dashboard',
  } = options;

  return {
    path: '/',
    component: layoutComponent,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: dashboardPath,
      },
      ...children,
    ],
  };
}

export function createAppRoutes(
  options: DynamicRouteOptions = {}
): RouteRecordRaw[] {
  const modules = configManager.getAllModules();
  const menus = configManager.getAllMenus();

  const moduleRoutes = createDynamicRoutes(modules, options);
  const menuRoutes = createMenuRoutes(menus, options);

  const allModuleRoutes = [...moduleRoutes, ...menuRoutes];
  const uniqueRoutes = allModuleRoutes.filter(
    (route, index, self) => self.findIndex(r => r.name === route.name) === index
  );

  const layoutRoute = createLayoutRoute(uniqueRoutes, options);

  return [
    {
      path: '/',
      redirect: '/dashboard',
    },
    layoutRoute,
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
      meta: {
        title: '404',
      },
    },
  ];
}

export function getRouteConfig(routeName: string): ModuleConfig | undefined {
  return configManager.getModuleSync(routeName);
}

export function getRouteConfigByPath(path: string): ModuleConfig | undefined {
  return configManager.findModuleByPath(path);
}
