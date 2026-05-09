<template>
  <div class="h-screen bg-[#0a1628] text-white flex flex-col w-64">
    <div class="h-16 flex items-center px-4 border-b border-[#1e2f4a]">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded bg-gradient-to-br from-[#1890ff] to-[#096dd9] flex items-center justify-center">
          <AntDesignOutlined class="text-white text-xl" />
        </div>
        <span class="text-lg font-bold">Ant Design Vue</span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-4">
      <a-menu
        mode="inline"
        :selected-keys="[activeMenu]"
        :open-keys="openKeys"
        @openChange="handleOpenChange"
        class="bg-transparent border-none"
        :style="{ color: '#bfcbd9' }"
      >
        <template v-for="menu in menus" :key="menu.key">
          <a-sub-menu v-if="menu.children && menu.children.length > 0" :key="menu.key">
            <template #icon>
              <component :is="getIcon(menu.icon)" />
            </template>
            <template #title>{{ menu.title }}</template>
            <template v-for="child in menu.children" :key="child.key">
              <a-menu-item v-if="child.path">
                <template #icon>
                  <component :is="getIcon(child.icon)" />
                </template>
                <router-link :to="child.path">{{ child.title }}</router-link>
              </a-menu-item>
            </template>
          </a-sub-menu>
          <a-menu-item v-else-if="menu.path" :key="menu.key">
            <template #icon>
              <component :is="getIcon(menu.icon)" />
            </template>
            <router-link :to="menu.path">{{ menu.title }}</router-link>
          </a-menu-item>
        </template>
      </a-menu>
    </div>

    <div class="h-12 flex items-center justify-around border-t border-[#1e2f4a]">
      <button class="p-2 hover:bg-[#1e2f4a] rounded transition-colors" aria-label="菜单">
        <MenuOutlined />
      </button>
      <button class="p-2 hover:bg-[#1e2f4a] rounded transition-colors" aria-label="通知">
        <BellOutlined />
      </button>
      <button class="p-2 hover:bg-[#1e2f4a] rounded transition-colors" aria-label="全屏">
        <FullscreenOutlined />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as icons from '@ant-design/icons-vue';
import type { MenuItem } from '../../types/menu';

const route = useRoute();
const menus = ref<MenuItem[]>([]);
const openKeys = ref<string[]>([]);

const activeMenu = computed(() => {
  const currentPath = route.path;
  const findMenuKey = (items: MenuItem[]): string | null => {
    for (const item of items) {
      if (item.path === currentPath) return item.key;
      if (item.children) {
        const found = findMenuKey(item.children);
        if (found) return found;
      }
    }
    return null;
  };
  const key = findMenuKey(menus.value);
  return key || currentPath;
});

const getIcon = (iconName?: string) => {
  if (!iconName) return MenuOutlined;
  return (icons as any)[iconName] || MenuOutlined;
};

const handleOpenChange = (keys: string[]) => {
  openKeys.value = keys;
};

onMounted(async () => {
  const menuConfig = await import('../../config/menu.json');
  menus.value = menuConfig.default?.menus || menuConfig.menus || [];
  
  const firstOpenMenu = menus.value.find(m => m.children && m.children.length > 0);
  if (firstOpenMenu) {
    openKeys.value = [firstOpenMenu.key];
  }
});
</script>

<script lang="ts">
import {
  AntDesignOutlined,
  MenuOutlined,
  BellOutlined,
  FullscreenOutlined,
} from '@ant-design/icons-vue';
export default {
  components: {
    AntDesignOutlined,
    MenuOutlined,
    BellOutlined,
    FullscreenOutlined,
  },
};
</script>

<style lang="scss" scoped>
:deep(.ant-menu-inline .ant-menu-item) {
  margin: 0 !important;
  height: 42px !important;
  line-height: 42px !important;
}

:deep(.ant-menu-item) {
  color: #bfcbd9;
  border-right: 3px solid transparent;
  
  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }
  
  &.ant-menu-item-selected {
    color: #1890ff;
    background: rgba(24, 144, 255, 0.1);
    border-right-color: #1890ff;
  }
}

:deep(.ant-menu-submenu-title) {
  color: #bfcbd9 !important;
  height: 42px !important;
  line-height: 42px !important;
  
  &:hover {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.08) !important;
  }
}

:deep(.ant-menu-submenu-arrow) {
  color: #bfcbd9;
}

:deep(.ant-menu-sub) {
  background: #0a1628 !important;
}

:deep(.ant-menu-item-icon) {
  font-size: 16px;
}
</style>
