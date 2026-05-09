<template>
  <div class="h-screen bg-[#0a1628] text-white flex flex-col w-64">
    <div class="h-16 flex items-center px-4 border-b border-[#1e2f4a]">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded bg-gradient-to-br from-[#1890ff] to-[#096dd9] flex items-center justify-center">
          <component :is="appLogo" class="text-white text-xl" />
        </div>
        <span class="text-lg font-bold">{{ appName }}</span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-4">
      <a-menu
        mode="inline"
        :selected-keys="[activeMenu]"
        :open-keys="openKeys"
        @openChange="handleOpenChange"
        class="bg-transparent border-none"
      >
        <template v-for="menu in menus" :key="menu.key">
          <a-sub-menu v-if="menu.children?.length" :key="menu.key">
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
      <button class="p-2 hover:bg-[#1e2f4a] rounded transition-colors">
        <MenuOutlined />
      </button>
      <button class="p-2 hover:bg-[#1e2f4a] rounded transition-colors">
        <BellOutlined />
      </button>
      <button class="p-2 hover:bg-[#1e2f4a] rounded transition-colors">
        <FullscreenOutlined />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import * as icons from '@ant-design/icons-vue';
import type { MenuItem } from '../../types/menu';
import { loadSystemConfig, scanModuleConfigs } from '../../utils/configScanner';

const route = useRoute();
const menus = ref<MenuItem[]>([]);
const openKeys = ref<string[]>([]);
const iconMap = ref<Record<string, string>>({});
const appName = ref('Ant Design Vue');
const appLogo = shallowRef(icons.AntDesignOutlined);

const activeMenu = computed(() => {
  const currentPath = route.path;
  const findKey = (items: MenuItem[]): string | null => {
    for (const item of items) {
      if (item.path === currentPath) return item.key;
      if (item.children) {
        const found = findKey(item.children);
        if (found) return found;
      }
    }
    return null;
  };
  return findKey(menus.value) || currentPath;
});

const getIcon = (iconName: string | undefined) => {
  if (!iconName) return MenuOutlined;
  return (icons as any)[iconName] || MenuOutlined;
};

const handleOpenChange = (keys: string[]) => {
  openKeys.value = keys;
};

onMounted(async () => {
  const system = await loadSystemConfig();
  iconMap.value = system.iconMap;
  appName.value = system.app.name;
  appLogo.value = (icons as any)[system.app.logo] || icons.AntDesignOutlined;

  const modules = await scanModuleConfigs();
  const generatedMenus: MenuItem[] = [];

  for (const [categoryKey, category] of Object.entries(system.menuCategories)) {
    const categoryModules = modules.filter(m => category.modules.includes(m.name));
    if (categoryModules.length > 0) {
      generatedMenus.push({
        key: categoryKey,
        title: category.title,
        icon: iconMap.value[category.icon] || 'SettingOutlined',
        children: categoryModules.map(m => ({
          key: `/${m.name}s`,
          title: m.title,
          icon: iconMap.value[m.name] || 'FileOutlined',
          path: `/${m.name}s`,
          config: m.name,
        })),
      });
    }
  }

  menus.value = generatedMenus;
  if (generatedMenus[0]) {
    openKeys.value = [generatedMenus[0].key];
  }
});
</script>

<script lang="ts">
import { MenuOutlined, BellOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
export default {
  components: { MenuOutlined, BellOutlined, FullscreenOutlined },
};
</script>

<style scoped>
:deep(.ant-menu-inline .ant-menu-item) {
  margin: 0 !important;
  height: 42px !important;
  line-height: 42px !important;
}

:deep(.ant-menu-item) {
  color: #bfcbd9;
}
:deep(.ant-menu-item:hover) {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}
:deep(.ant-menu-item-selected) {
  color: #1890ff !important;
  background: rgba(24, 144, 255, 0.15) !important;
}

:deep(.ant-menu-submenu-title) {
  color: #bfcbd9 !important;
  height: 42px !important;
  line-height: 42px !important;
}
:deep(.ant-menu-submenu-title:hover) {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.08) !important;
}

:deep(.ant-menu-sub) {
  background: #0a1628 !important;
}
</style>
