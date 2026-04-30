import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { beforeEachGuard, afterEachGuard } from './guards';

const router = createRouter({
  history: createWebHistory('/mgmt-cli-ebank/'),
  routes: routes as any,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 注册路由守卫
router.beforeEach(beforeEachGuard);
router.afterEach(afterEachGuard);

export default router;
