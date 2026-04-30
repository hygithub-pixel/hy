<template>
  <a
    href="#main-content"
    class="skip-link absolute top-[-40px] left-0 bg-primary text-white px-4 py-2 z-10 transition-all duration-300 text-decoration-none font-medium rounded-md"
  >
    跳过导航，直接访问主要内容
  </a>
  <div class="flex h-screen overflow-hidden">
    <aside
      class="flex-shrink-0 transition-all duration-300 overflow-hidden"
      :class="collapsed ? 'w-20' : 'w-64'"
    >
      <Sidebar />
    </aside>

    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <header class="flex-shrink-0">
        <TopNav />
      </header>

      <main id="main-content" class="flex-1 overflow-y-auto bg-bg-page p-6 sm:p-8" tabindex="-1">
        <router-view v-slot="{ Component, route }">
          <transition name="page-fade" mode="out-in">
            <keep-alive :include="cachedRoutes">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue';
import TopNav from './TopNav.vue';
import { useRouteCacheStore } from '../../stores/routeCacheStore';
import { throttle } from '../../utils/debounceThrottle';

const routeCacheStore = useRouteCacheStore();

const collapsed = ref(false);

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};

const sidebarState = reactive({
  get collapsed() {
    return collapsed.value;
  },
  toggleSidebar,
});

provide('sidebarState', sidebarState);

const cachedRoutes = computed(() => {
  return routeCacheStore.getCachedRoutes();
});

const handleResize = throttle(() => {
  const width = window.innerWidth;
  if (width < 768) {
    collapsed.value = true;
  }
}, 100);

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  (window as any).__SIDEBAR_STATE__ = sidebarState;
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  delete (window as any).__SIDEBAR_STATE__;
});
</script>

<style>
/* 安全区域支持 */
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
}

/* Skip Link */
.skip-link:focus {
  top: var(--safe-area-inset-top);
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/* 页面过渡动画 */
@media (prefers-reduced-motion: no-preference) {
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition:
      opacity var(--transition-slow),
      transform var(--transition-slow);
  }

  .page-fade-enter-from,
  .page-fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: none;
  }

  .page-fade-enter-from,
  .page-fade-leave-to {
    opacity: 1;
    transform: none;
  }
}

/* 页面加载动画 */
.page-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  width: 100%;
}

/* 表格加载动画 */
.table-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 9999px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-light);
}
</style>
