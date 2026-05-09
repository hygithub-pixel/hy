<template>
  <div class="h-14 bg-white border-b border-[#e8e8e8] flex items-center justify-between px-6">
    <div class="flex items-center gap-4">
      <a-button type="text" class="text-gray-600 hover:text-gray-900">
        <component :is="componentMap['MenuFoldOutlined']" />
      </a-button>
      <a-breadcrumb separator="/" class="text-sm">
        <a-breadcrumb-item>
          <router-link to="/">首页</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item v-if="currentPath.includes('system')">系统管理</a-breadcrumb-item>
        <a-breadcrumb-item v-if="currentPath.includes('users')">用户管理</a-breadcrumb-item>
        <a-breadcrumb-item v-if="currentPath.includes('add')">新增用户</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="flex items-center gap-4">
      <a-input
        v-model:value="searchQuery"
        placeholder="搜索"
        class="w-64 h-8"
      >
        <template #prefix>
          <component :is="componentMap['SearchOutlined']" class="text-gray-400" />
        </template>
      </a-input>

      <a-badge :count="12" class="cursor-pointer">
        <component :is="componentMap['BellOutlined']" class="text-gray-600 text-xl" />
      </a-badge>

      <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
        <a-avatar size="small" :src="userAvatar">
          <template #icon>
            <component :is="componentMap['UserOutlined']" />
          </template>
        </a-avatar>
        <span class="text-sm font-medium">管理员</span>
        <component :is="componentMap['DownOutlined']" class="text-xs" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import * as icons from '@ant-design/icons-vue';

const route = useRoute();
const componentMap: Record<string, any> = icons;
const searchQuery = ref('');

const currentPath = computed(() => route.path);
const userAvatar = ref('');
</script>