import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/users',
  },
  {
    path: '/users',
    name: 'UserList',
    component: () => import('../views/ModulePage.vue'),
    meta: { title: '用户管理', config: 'user' },
  },
  {
    path: '/roles',
    name: 'RoleList',
    component: () => import('../views/ModulePage.vue'),
    meta: { title: '角色管理', config: 'role' },
  },
  {
    path: '/departments',
    name: 'DepartmentList',
    component: () => import('../views/ModulePage.vue'),
    meta: { title: '部门管理', config: 'department' },
  },
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('../views/ModulePage.vue'),
    meta: { title: '商品管理', config: 'product' },
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('../views/ModulePage.vue'),
    meta: { title: '订单管理', config: 'order' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
