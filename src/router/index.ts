import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 路由缓存配置
export const routeCache: Record<string, boolean> = {};

// 路由预加载配置
const preloadRoutes = ['/dashboard', '/users', '/products', '/orders'];

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: () => import('../components/layout/MainLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          title: '仪表盘'
        }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '用户列表' }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '商品列表' }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '分类管理' }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '库存管理' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '订单列表' }
      },
      {
        path: 'order-stats',
        name: 'OrderStats',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '订单统计' }
      },
      {
        path: 'refunds',
        name: 'Refunds',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '退款管理' }
      },
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '文章管理' }
      },
      {
        path: 'content-categories',
        name: 'ContentCategories',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '分类管理' }
      },
      {
        path: 'ads',
        name: 'Ads',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '广告管理' }
      },
      {
        path: 'comments',
        name: 'Comments',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '评论管理' }
      },
      {
        path: 'revenue',
        name: 'Revenue',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '收入统计' }
      },
      {
        path: 'expenses',
        name: 'Expenses',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '支出管理' }
      },
      {
        path: 'finance-reports',
        name: 'FinanceReports',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '财务报表' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404 页面'
    }
  }
];

const router = createRouter({
  history: createWebHistory('/mgmt-cli-ebank/'),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 路由预加载函数
const preloadRoute = (path: string) => {
  try {
    // 查找路由配置
    const findRoute = (routes: RouteRecordRaw[], targetPath: string): RouteRecordRaw | undefined => {
      for (const route of routes) {
        if (route.path === targetPath) {
          return route;
        }
        if (route.children) {
          const found = findRoute(route.children, targetPath);
          if (found) return found;
        }
      }
      return undefined;
    };

    const route = findRoute(routes, path);
    if (route && route.component) {
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

// 路由守卫，设置页面标题和权限验证
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title as string || 'Vue3 Admin';
  
  // 检查是否需要认证
  const requiresAuth = to.meta.requiresAuth !== false;
  
  // 检查用户是否已登录
  const isLoggedIn = localStorage.getItem('token') !== null;
  
  if (requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

// 路由后置守卫，实现预加载
router.afterEach((to) => {
  // 标记当前路由为已缓存
  routeCache[to.path] = true;
  
  // 预加载常用路由
  preloadRoutes.forEach(routePath => {
    if (routePath !== to.path) {
      preloadRoute(routePath);
    }
  });
});

// 导出路由缓存管理
export const useRouteCache = {
  isCached: (path: string) => routeCache[path] || false,
  clearCache: (path?: string) => {
    if (path) {
      delete routeCache[path];
    } else {
      Object.keys(routeCache).forEach(key => delete routeCache[key]);
    }
  }
};

export default router;
