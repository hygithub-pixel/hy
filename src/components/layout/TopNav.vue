<template>
  <div class="h-14 bg-white border-b border-[#e8e8e8] flex items-center justify-between px-6">
    <div class="flex items-center gap-4">
      <a-button type="text" class="text-gray-600 hover:text-gray-900">
        <MenuFoldOutlined />
      </a-button>
      <a-breadcrumb separator="/" class="text-sm">
        <a-breadcrumb-item>
          <router-link to="/">首页</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>系统管理</a-breadcrumb-item>
        <a-breadcrumb-item v-if="currentPath === '/users'">用户管理</a-breadcrumb-item>
        <a-breadcrumb-item v-else-if="currentPath === '/users/add'">新增用户</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="flex items-center gap-4">
      <a-input
        v-model:value="searchQuery"
        placeholder="搜索"
        class="w-64 h-8"
      >
        <template #prefix>
          <SearchOutlined class="text-gray-400" />
        </template>
      </a-input>

      <a-badge :count="12" class="cursor-pointer">
        <BellOutlined class="text-gray-600 text-xl" />
      </a-badge>

      <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
        <a-avatar size="small">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <span class="text-sm font-medium">管理员</span>
        <DownOutlined class="text-xs" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  MenuFoldOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';

const route = useRoute();
const searchQuery = ref('');

const currentPath = computed(() => route.path);
</script>
