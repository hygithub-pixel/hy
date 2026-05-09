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
  const routes: RouteRecordRaw[] = [];
  
  modules.forEach(m => {
    routes.push({
      path: `/${m.name}s`,
      name: `${m.name}s`,
      component: () => import('../views/ModulePage.vue'),
      meta: { title: m.title, config: m.name },
    });
    
    routes.push({
      path: `/${m.name}s/add`,
      name: `${m.name}Add`,
      component: () => import('../views/FormPage.vue'),
      meta: { title: `新增${m.title}`, config: m.name, mode: 'create' },
    });
    
    routes.push({
      path: `/${m.name}s/edit/:id`,
      name: `${m.name}Edit`,
      component: () => import('../views/FormPage.vue'),
      meta: { title: `编辑${m.title}`, config: m.name, mode: 'edit' },
    });
    
    routes.push({
      path: `/${m.name}s/view/:id`,
      name: `${m.name}View`,
      component: () => import('../views/FormPage.vue'),
      meta: { title: `查看${m.title}`, config: m.name, mode: 'view' },
    });
  });
  
  return routes;
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
