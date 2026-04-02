<template>
  <div class="w-full h-screen bg-white flex flex-col border-r border-slate-200">
    <div class="h-18 border-b border-slate-200 flex-shrink-0">
      <div class="flex items-center h-full" :class="sidebarState.collapsed ? 'px-2.5' : 'px-5'">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex-center flex-shrink-0">
            <el-icon :size="24">
              <House />
            </el-icon>
          </div>
          <span v-if="!sidebarState.collapsed" class="text-slate-800 text-lg font-bold">Vue3 Admin</span>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto" :key="menuKey">
      <el-menu
        ref="menuRef"
        :default-active="activeMenu"
        :default-openeds="openedMenus"
        :collapse="sidebarState.collapsed"
        :unique-opened="true"
        router
        background-color="transparent"
        text-color="#475569"
        active-text-color="#6366f1"
      >
        <el-menu-item index="/dashboard">
          <el-icon aria-hidden="true"><House /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>

        <template v-for="menu in menuStore.getAllMenus" :key="menu.id">
          <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
            <template #title>
              <el-icon aria-hidden="true"><component :is="getIconComponent(menu.icon)" /></el-icon>
              <span>{{ menu.title }}</span>
            </template>
            <el-menu-item v-for="child in menu.children" :key="child.id" :index="child.path">
              <el-icon aria-hidden="true"><component :is="getIconComponent(child.icon)" /></el-icon>
              <template #title>{{ child.title }}</template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.path">
            <el-icon aria-hidden="true"><component :is="getIconComponent(menu.icon)" /></el-icon>
            <template #title>{{ menu.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '../../stores/menuStore';
import {
  House, UserFilled, Goods, List, CollectionTag,
  Document, Money, Wallet, TrendCharts, Refresh, FolderOpened,
  Picture, ChatDotRound, DataLine, Box, Menu
} from '@element-plus/icons-vue';

const sidebarState = inject('sidebarState', { collapsed: false, toggleSidebar: () => {} });

const menuRef = ref();
const route = useRoute();
const menuStore = useMenuStore();
const openedMenus = ref<string[]>([]);
const menuKey = ref(0);

const activeMenu = computed(() => route.path);

const getIconComponent = (iconName?: string) => {
  const iconMap: Record<string, any> = {
    Menu, UserFilled, Goods, List, CollectionTag,
    Document, Money, Wallet, TrendCharts, Refresh, FolderOpened,
    Picture, ChatDotRound, DataLine, Box, House
  };
  return iconName ? iconMap[iconName] || Menu : Menu;
};

onMounted(async () => {
  await menuStore.initMenuConfig();
});

watch(
  () => route.path,
  () => {
    menuKey.value++;
  }
);
</script>

<style scoped>
/* 触摸交互优化 */
.el-menu {
  touch-action: manipulation;
}

.el-menu-item {
  touch-action: manipulation;
}

.el-sub-menu {
  touch-action: manipulation;
}

/* 焦点状态样式 */
.el-menu-item:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.el-sub-menu:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

</style>
