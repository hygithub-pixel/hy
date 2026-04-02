<template>
  <div class="h-18 bg-white border-b border-slate-200 flex-between px-6">
    <div class="flex items-center gap-4 flex-1">
      <el-button
        :icon="sidebarState.collapsed ? Menu : Close"
        @click="sidebarState.toggleSidebar"
        @keydown.enter="sidebarState.toggleSidebar"
        @keydown.space="sidebarState.toggleSidebar"
        text
        circle
        :aria-label="sidebarState.collapsed ? '展开侧边栏' : '折叠侧边栏'"
      />
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.name">{{ route.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="flex-2 max-w-400px mx-6 hidden md:block">
      <el-input
        v-model="searchQuery"
        placeholder="搜索..."
        :prefix-icon="Search"
        size="small"
        aria-label="搜索"
        autocomplete="off"
      />
    </div>
    
    <div class="flex-1 flex-end items-center gap-2">
      <el-dropdown trigger="click">
        <el-badge :value="notificationCount">
          <el-button :icon="Bell" text circle aria-label="通知" @keydown.enter="handleButtonKeydown($event)" @keydown.space="handleButtonKeydown($event)" />
        </el-badge>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-row :gutter="12">
                <el-col :span="4">
                  <el-icon color="#10b981"><Check /></el-icon>
                </el-col>
                <el-col :span="20">
                  <div>任务完成</div>
                  <div class="text-xs text-slate-500">5分钟前</div>
                </el-col>
              </el-row>
            </el-dropdown-item>
            <el-dropdown-item divided>
              查看全部通知
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
      <el-dropdown trigger="click">
        <el-button :icon="Setting" text circle aria-label="设置" @keydown.enter="handleButtonKeydown($event)" @keydown.space="handleButtonKeydown($event)" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon><Monitor /></el-icon>
              显示设置
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
      <el-dropdown trigger="click">
        <button class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150 hover:bg-slate-100 user-menu-trigger" aria-label="用户菜单" @keydown.enter="handleButtonKeydown($event)" @keydown.space="handleButtonKeydown($event)">
          <el-avatar :size="36" :src="userAvatar" width="36" height="36">
            <template #default>
              <el-icon><User /></el-icon>
            </template>
          </el-avatar>
          <span class="font-medium">{{ userName }}</span>
          <el-icon><ArrowDown /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon><UserFilled /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><Document /></el-icon>
              个人资料
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><Lock /></el-icon>
              修改密码
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowDown, Menu, Close, UserFilled, Setting, SwitchButton, 
  Search, Bell, Check, Monitor, Document, Lock, User
} from '@element-plus/icons-vue';
import { ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem, ElBreadcrumb, ElBreadcrumbItem, ElInput, ElBadge, ElRow, ElCol, ElIcon, ElAvatar } from 'element-plus';

const sidebarState = inject('sidebarState', { collapsed: false, toggleSidebar: () => {} });

const route = useRoute();
const userName = ref('管理员');
const userAvatar = ref('https://neeko-copilot.bytedance.net/api/text2image?prompt=professional%20user%20avatar&size=512x512');
const searchQuery = ref('');
const notificationCount = ref(3);

const handleButtonKeydown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  if (target) {
    target.click();
  }
};
</script>

<style scoped>
/* 触摸交互优化 */
.el-dropdown {
  touch-action: manipulation;
}

/* 按钮触摸优化 */
.el-button {
  touch-action: manipulation;
}

/* 用户菜单触摸优化 */
.user-menu-trigger {
  touch-action: manipulation;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  text-align: left;
}

/* 按钮焦点样式 */
.user-menu-trigger:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
</style>
