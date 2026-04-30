import type { AppRouteRecordRaw } from './types';

const preloadRoutes = ['/dashboard', '/users', '/products'];

const baseRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    component: () => import('../components/layout/MainLayout.vue'),
    meta: {
      title: '主布局',
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          title: '仪表盘',
        },
      },
      {
        path: 'users',
        name: 'user',
        component: () => import('../views/ModulePage.vue'),
        meta: { title: '用户列表', configId: 'user' },
      },
      {
        path: 'products',
        name: 'product',
        component: () => import('../views/ModulePage.vue'),
        meta: { title: '商品列表', configId: 'product' },
      },
      {
        path: 'orders',
        name: 'order',
        component: () => import('../views/ModulePage.vue'),
        meta: { title: '订单列表', configId: 'order' },
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '角色管理' },
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '分类管理' },
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '库存管理' },
      },
      {
        path: 'order-stats',
        name: 'OrderStats',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '订单统计' },
      },
      {
        path: 'refunds',
        name: 'Refunds',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '退款管理' },
      },
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '文章管理' },
      },
      {
        path: 'content-categories',
        name: 'ContentCategories',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '分类管理' },
      },
      {
        path: 'ads',
        name: 'Ads',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '广告管理' },
      },
      {
        path: 'comments',
        name: 'Comments',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '评论管理' },
      },
      {
        path: 'revenue',
        name: 'Revenue',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '收入统计' },
      },
      {
        path: 'expenses',
        name: 'Expenses',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '支出管理' },
      },
      {
        path: 'finance-reports',
        name: 'FinanceReports',
        component: () => import('../views/MenuPage.vue'),
        meta: { title: '财务报表' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404 页面',
    },
  },
];

const routes = baseRoutes;

export { routes, preloadRoutes };
