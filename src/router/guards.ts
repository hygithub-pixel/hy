import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { useRouteCacheStore } from '../stores/routeCacheStore';
import { performanceMonitor } from '../utils/performance';
import NProgress from 'nprogress';
import { preloadRoute } from './preload';
import { preloadRoutes, routes } from './routes';

/**
 * 路由前置守卫
 * @param to - 目标路由
 * @param _from - 来源路由
 * @param next - 下一步函数
 */
export const beforeEachGuard = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  NProgress.start();
  performanceMonitor.startMeasure(`route-${to.path}`);

  document.title = (to.meta.title as string) || 'Vue3 Admin';

  const requiresAuth = (to.meta.requiresAuth as boolean) !== false;

  const userStore = useUserStore();
  const isLoggedIn = userStore.isAuthenticated && !!userStore.token;

  if (requiresAuth && !isLoggedIn) {
    NProgress.done();
    next('/login');
  } else {
    next();
  }
};

/**
 * 路由后置守卫
 * @param to - 目标路由
 */
export const afterEachGuard = (to: RouteLocationNormalized) => {
  performanceMonitor.endMeasure(`route-${to.path}`);
  NProgress.done();

  const routeCacheStore = useRouteCacheStore();
  routeCacheStore.addRoute(to.path);

  preloadRoutes.forEach(routePath => {
    if (routePath !== to.path) {
      preloadRoute(routePath, routes);
    }
  });
};
