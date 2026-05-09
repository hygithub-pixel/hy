import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { generateRoutes } from '../utils/routeGenerator';

const router = createRouter({
  history: createWebHistory(),
  routes: [] as RouteRecordRaw[],
});

let isRoutesGenerated = false;

export const initRouter = async () => {
  if (!isRoutesGenerated) {
    const routes = await generateRoutes();
    routes.forEach(route => {
      router.addRoute(route);
    });
    isRoutesGenerated = true;
  }
  return router;
};

export const setupRouter = async () => {
  await initRouter();
  return router;
};

export default router;
