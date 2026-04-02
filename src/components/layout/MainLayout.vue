<template>
  <a href="#main-content" class="skip-link">
    跳过导航，直接访问主要内容
  </a>
  <el-container class="h-screen">
    <el-aside 
      :width="collapsed ? '80px' : '260px'" 
      class="transition-all duration-250"
    >
      <Sidebar />
    </el-aside>
    
    <el-container class="h-screen flex flex-col">
      <el-header class="p-0 h-auto flex-shrink-0">
        <TopNav />
      </el-header>
      
      <el-main id="main-content" class="bg-slate-50 flex-1 overflow-y-auto" tabindex="-1">
        <router-view v-slot="{ Component, route }">
          <transition name="page-fade" mode="out-in">
            <keep-alive :include="cachedRoutes">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue';
import TopNav from './TopNav.vue';
import { routeCache } from '../../router';

const collapsed = ref(false);

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};

// 提供侧边栏状态和切换方法
const sidebarState = reactive({
  get collapsed() {
    return collapsed.value;
  },
  toggleSidebar
});

provide('sidebarState', sidebarState);

// 计算缓存的路由列表
const cachedRoutes = computed(() => {
  return Object.keys(routeCache).filter(path => routeCache[path]);
});

// 响应式处理
const handleResize = () => {
  const width = window.innerWidth;
  if (width < 768) {
    collapsed.value = true;
  }
};

onMounted(() => {
  // 初始化时检查屏幕宽度
  handleResize();
  // 添加 resize 事件监听器
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 移除 resize 事件监听器
  window.removeEventListener('resize', handleResize);
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
.skip-link {
  position: absolute;
  top: calc(-40px + var(--safe-area-inset-top));
  left: var(--safe-area-inset-left);
  background: #6366f1;
  color: white;
  padding: 8px 16px;
  z-index: 100;
  transition: top 0.3s;
  text-decoration: none;
  font-weight: 500;
}

.skip-link:focus {
  top: var(--safe-area-inset-top);
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/* 页面过渡动画 */
@media (prefers-reduced-motion: no-preference) {
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  }
  
  .page-fade-enter-from,
  .page-fade-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
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
</style>
