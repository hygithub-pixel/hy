<template>
  <div
    class="flex items-center justify-between h-16 px-6 bg-bg-surface border-b border-border gap-4"
  >
    <div class="flex items-center gap-4 flex-1 min-w-0">
      <a-button
        :type="sidebarState.collapsed ? 'default' : 'text'"
        class="w-10 h-10 flex items-center justify-center text-text-secondary transition-all duration-150 hover:bg-bg-muted hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        :aria-label="sidebarState.collapsed ? '展开侧边栏' : '折叠侧边栏'"
        @click="sidebarState.toggleSidebar"
      >
        <template #icon>
          <component :is="sidebarState.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
        </template>
      </a-button>
      <a-breadcrumb separator="/" class="text-sm hidden sm:flex">
        <a-breadcrumb-item :href="'/'">首页</a-breadcrumb-item>
        <a-breadcrumb-item v-if="route.name">{{ route.meta.title }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="hidden lg:block flex-0 w-80 max-w-[400px]">
      <a-input
        v-model:value="searchQuery"
        placeholder="搜索..."
        class="h-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        aria-label="搜索"
        autocomplete="search"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </div>

    <div class="flex items-center gap-1 flex-shrink-0">
      <a-dropdown :trigger="['click']">
        <a-badge :count="notificationCount" :offset="[-5, 5]">
          <a-button
            type="text"
            class="w-10 h-10 flex items-center justify-center text-text-secondary transition-all duration-150 hover:bg-bg-muted hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label="通知"
          >
            <template #icon><BellOutlined /></template>
          </a-button>
        </a-badge>
        <template #overlay>
          <a-menu class="p-1 rounded-md shadow-lg border border-border">
            <a-menu-item
              key="1"
              class="flex items-start gap-2 p-2 m-1 rounded-sm text-text-primary transition-all duration-150 hover:bg-bg-muted"
            >
              <div class="flex items-center justify-center w-6 h-6 text-green-500 flex-shrink-0 mt-0.5">
                <CheckCircleOutlined />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm text-text-primary leading-relaxed">任务完成</div>
                <div class="text-xs text-text-secondary mt-0.5">5分钟前</div>
              </div>
            </a-menu-item>
            <a-menu-item
              key="2"
              class="flex justify-center p-2 m-1 rounded-sm text-primary font-medium transition-all duration-150 hover:bg-bg-muted"
            >
              查看全部通知
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-dropdown :trigger="['click']">
        <a-button
          type="text"
          class="w-10 h-10 flex items-center justify-center text-text-secondary transition-all duration-150 hover:bg-bg-muted hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="设置"
        >
          <template #icon><SettingOutlined /></template>
        </a-button>
        <template #overlay>
          <a-menu class="p-1 rounded-md shadow-lg border border-border">
            <a-menu-item
              key="theme"
              class="flex items-center gap-2 p-2 m-1 rounded-sm text-text-primary transition-all duration-150 hover:bg-bg-muted"
              @click="toggleTheme"
            >
              <span class="text-text-secondary text-lg">{{ isDark ? '☀️' : '🌙' }}</span>
              <span>{{ isDark ? '浅色模式' : '深色模式' }}</span>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item
              key="1"
              class="flex items-center gap-2 p-2 m-1 rounded-sm text-text-primary transition-all duration-150 hover:bg-bg-muted"
            >
              <MonitorOutlined class="text-text-secondary" />
              显示设置
            </a-menu-item>
            <a-menu-item
              key="2"
              class="flex items-center gap-2 p-2 m-1 rounded-sm text-text-primary transition-all duration-150 hover:bg-bg-muted"
            >
              <SettingOutlined class="text-text-secondary" />
              系统设置
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-dropdown :trigger="['click']">
        <button
          class="flex items-center gap-2 px-2 py-1 bg-transparent border-none rounded-md cursor-pointer transition-all duration-150 hover:bg-bg-muted focus:outline focus:outline-2 focus:outline-primary focus:outline-offset-2 focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="用户菜单"
        >
          <a-avatar :size="36" :src="userAvatar">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <span class="text-sm font-medium text-text-primary hidden sm:inline">{{ userName }}</span>
          <DownOutlined class="text-text-secondary text-sm" />
        </button>
        <template #overlay>
          <a-menu class="p-1 rounded-md shadow-lg border border-border">
            <a-menu-item
              key="1"
              class="flex items-center gap-2 p-2 m-1 rounded-sm text-text-primary transition-all duration-150 hover:bg-bg-muted"
            >
              <UserOutlined class="text-text-secondary" />
              个人中心
            </a-menu-item>
            <a-menu-item
              key="2"
              class="flex items-center gap-2 p-2 m-1 rounded-sm text-text-primary transition-all duration-150 hover:bg-bg-muted"
            >
              <FileTextOutlined class="text-text-secondary" />
              个人资料
            </a-menu-item>
            <a-menu-item
              key="3"
              class="flex items-center gap-2 p-2 m-1 rounded-sm text-text-primary transition-all duration-150 hover:bg-bg-muted"
            >
              <LockOutlined class="text-text-secondary" />
              修改密码
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item
              key="4"
              class="flex items-center gap-2 p-2 m-1 rounded-sm text-text-primary transition-all duration-150 hover:bg-bg-muted"
              @click="handleLogout"
            >
              <LogoutOutlined class="text-text-secondary" />
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  MonitorOutlined,
  UserOutlined,
  FileTextOutlined,
  LockOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';
import { useUser } from '@/composables/useUser';
import { notificationService } from '@/services/notificationService';

const sidebarState = inject('sidebarState', { collapsed: false, toggleSidebar: () => {} });

const route = useRoute();
const { user, logout } = useUser();

const userName = computed(() => user.value?.username || '管理员');
const userAvatar = computed(() => user.value?.avatar || '');
const searchQuery = ref('');
const notificationCount = ref(3);

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    }
  }
};

onMounted(() => {
  initTheme();
});

const handleLogout = async () => {
  try {
    await logout();
    notificationService.success('退出成功');
  } catch (error) {
    notificationService.error('退出失败');
  }
};
</script>
