<template>
  <div class="flex items-center justify-between h-16 px-6 border-b border-main bg-container">
    <div class="flex items-center gap-4 flex-1 min-w-0">
      <a-button
        :type="sidebarState.collapsed ? 'default' : 'text'"
        class="w-10 h-10 flex items-center justify-center"
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

    <div class="hidden lg:block flex-0 w-80 max-w-400px">
      <a-input
        v-model:value="searchQuery"
        placeholder="搜索..."
        class="h-10"
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
          <a-button type="text" class="w-10 h-10 flex items-center justify-center" aria-label="通知">
            <template #icon><BellOutlined /></template>
          </a-button>
        </a-badge>
        <template #overlay>
          <a-menu class="p-1">
            <a-menu-item key="1" class="flex items-start gap-2 p-2">
              <div class="flex items-center justify-center w-6 h-6 flex-shrink-0 mt-0.5">
                <CheckCircleOutlined style="color: var(--ant-success-color)" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm leading-relaxed">任务完成</div>
                <div class="text-xs text-secondary">5分钟前</div>
              </div>
            </a-menu-item>
            <a-menu-item key="2" class="flex justify-center p-2 font-medium" style="color: var(--ant-primary-color)">
              查看全部通知
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-dropdown :trigger="['click']">
        <a-button type="text" class="w-10 h-10 flex items-center justify-center" aria-label="设置">
          <template #icon><SettingOutlined /></template>
        </a-button>
        <template #overlay>
          <a-menu class="p-1">
            <a-menu-item key="theme" class="flex items-center gap-2 p-2" @click="toggleTheme">
              <span class="text-lg">{{ themeStore.isDark ? '☀️' : '🌙' }}</span>
              <span>{{ themeStore.isDark ? '浅色模式' : '深色模式' }}</span>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="1" class="flex items-center gap-2 p-2">
              <MonitorOutlined />
              显示设置
            </a-menu-item>
            <a-menu-item key="2" class="flex items-center gap-2 p-2">
              <SettingOutlined />
              系统设置
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-dropdown :trigger="['click']">
        <button class="flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-all duration-150" aria-label="用户菜单">
          <a-avatar :size="36" :src="userAvatar" class="bg-elevated text-base-color">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <span class="text-sm font-medium hidden sm:inline text-base-color">{{ userName }}</span>
          <DownOutlined class="text-sm text-secondary" />
        </button>
        <template #overlay>
          <a-menu class="p-1">
            <a-menu-item key="1" class="flex items-center gap-2 p-2">
              <UserOutlined />
              个人中心
            </a-menu-item>
            <a-menu-item key="2" class="flex items-center gap-2 p-2">
              <FileTextOutlined />
              个人资料
            </a-menu-item>
            <a-menu-item key="3" class="flex items-center gap-2 p-2">
              <LockOutlined />
              修改密码
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="4" class="flex items-center gap-2 p-2" @click="handleLogout">
              <LogoutOutlined />
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
import { useThemeStore } from '@/stores/themeStore';
import { notificationService } from '@/services/notificationService';

const sidebarState = inject('sidebarState', { collapsed: false, toggleSidebar: () => {} });
const themeStore = useThemeStore();

const route = useRoute();
const { user, logout } = useUser();

const userName = computed(() => user.value?.username || '管理员');
const userAvatar = computed(() => user.value?.avatar || '');
const searchQuery = ref('');
const notificationCount = ref(3);

const toggleTheme = () => {
  themeStore.toggle();
};

const handleLogout = async () => {
  try {
    await logout();
    notificationService.success('退出成功');
  } catch (error) {
    notificationService.error('退出失败');
  }
};
</script>
