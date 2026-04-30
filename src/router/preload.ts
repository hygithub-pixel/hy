import type { RouteRecordRaw } from 'vue-router';
import type { AppRouteRecordRaw } from './types';

/**
 * 路由预加载函数
 * @param path - 路由路径
 * @param routes - 路由配置数组
 */
export const preloadRoute = (path: string, routes: (RouteRecordRaw | AppRouteRecordRaw)[]) => {
  try {
    // 查找路由配置
    const findRoute = (
      routes: (RouteRecordRaw | AppRouteRecordRaw)[],
      targetPath: string
    ): (RouteRecordRaw | AppRouteRecordRaw) | undefined => {
      for (const route of routes) {
        if (route.path === targetPath) {
          return route;
        }
        if ('children' in route && route.children) {
          const found = findRoute(route.children, targetPath);
          if (found) return found;
        }
      }
      return undefined;
    };

    const route = findRoute(routes, path);
    if (route && 'component' in route && route.component) {
      // 预加载组件
      const componentLoader = route.component as () => Promise<any>;
      if (typeof componentLoader === 'function') {
        componentLoader();
      }
    }
  } catch (error) {
    console.error('Route preload failed:', error);
  }
};
