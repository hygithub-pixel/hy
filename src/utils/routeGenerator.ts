import type { RouteRecordRaw } from 'vue-router';
import type { MenuItem } from '../types/menu';
import { scanModuleConfigs } from './configScanner';

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

const generateRoutesFromConfigs = (modules: Awaited<ReturnType<typeof scanModuleConfigs>>): RouteRecordRaw[] => {
  return modules.map(m => ({
    path: `${m.name}s`,
    name: `${m.name}s`,
    component: () => import('../views/ModulePage.vue'),
    meta: {
      title: m.title,
      config: m.name,
    },
  }));
};

export const generateRoutes = async (): Promise<RouteRecordRaw[]> => {
  const modules = await scanModuleConfigs();
  const dynamicRoutes = generateRoutesFromConfigs(modules);
  return [...staticRoutes, ...dynamicRoutes];
};
