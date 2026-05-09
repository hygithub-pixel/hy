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
    component: () => import('../views/UserList.vue'),
    meta: { title: '用户管理' },
  },
  {
    path: '/users/add',
    name: 'UserAdd',
    component: () => import('../views/UserAdd.vue'),
    meta: { title: '新增用户' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
