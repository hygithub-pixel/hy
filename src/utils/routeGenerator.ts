import type { RouteRecordRaw } from 'vue-router';
import { scanModuleConfigs, getHomeRoute } from './configScanner';

const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '404' },
  },
];

const generateRoutesFromConfigs = (modules: Awaited<ReturnType<typeof scanModuleConfigs>>): RouteRecordRaw[] => {
  return modules.map(m => ({
    path: `/${m.name}s`,
    name: `${m.name}s`,
    component: () => import('../views/ModulePage.vue'),
    meta: {
      title: m.title,
      config: m.name,
    },
  }));
};

export const generateRoutes = async (): Promise<RouteRecordRaw[]> => {
  const homeRoute = await getHomeRoute();
  const modules = await scanModuleConfigs();
  const dynamicRoutes = generateRoutesFromConfigs(modules);
  
  const redirectRoute: RouteRecordRaw = {
    path: '/',
    redirect: homeRoute,
  };
  
  return [redirectRoute, ...staticRoutes, ...dynamicRoutes];
};
