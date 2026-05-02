<template>
  <div
    class="flex flex-col h-screen w-full border-r transition-colors duration-200"
    :style="{
      backgroundColor: 'var(--ant-bg-color)',
      borderColor: 'var(--ant-border-color)'
    }"
  >
    <div
      class="flex-shrink-0 h-18 border-b transition-colors duration-200"
      :style="{ borderColor: 'var(--ant-border-color)' }"
    >
      <div
        class="flex items-center h-full gap-4 transition-all duration-300"
        :class="sidebarState.collapsed ? 'px-2 justify-center' : 'px-6'"
      >
        <div
          class="flex items-center justify-center w-10 h-10 rounded-md text-white flex-shrink-0"
          :style="{ background: 'linear-gradient(135deg, var(--ant-primary-color) 0%, var(--ant-primary-color-hover) 100%)' }"
        >
          <HomeOutlined :style="{ fontSize: '24px' }" />
        </div>
        <span
          v-if="!sidebarState.collapsed"
          class="text-lg font-bold whitespace-nowrap"
          :style="{ color: 'var(--ant-text-color)' }"
          >Vue3 Admin</span
        >
      </div>
    </div>

    <div :key="menuKey" class="flex-1 overflow-y-auto overflow-x-hidden p-2">
      <a-menu
        mode="inline"
        :selected-keys="[activeMenu]"
        :open-keys="openedMenus"
        :inline-collapsed="sidebarState.collapsed"
        :trigger-subMenuAction="'click'"
      >
        <a-menu-item key="/dashboard">
          <template #icon><HomeOutlined /></template>
          <router-link to="/dashboard">仪表盘</router-link>
        </a-menu-item>

        <template v-for="menu in menuStore.getAllMenus" :key="menu.id">
          <a-sub-menu v-if="menu.children && menu.children.length > 0" :key="menu.path">
            <template #icon><component :is="getIconComponent(menu.icon)" /></template>
            <template #title>{{ menu.title }}</template>
            <a-menu-item v-for="child in menu.children" :key="child.id">
              <template #icon><component :is="getIconComponent(child.icon)" /></template>
              <router-link :to="child.path">{{ child.title }}</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="menu.path">
            <template #icon><component :is="getIconComponent(menu.icon)" /></template>
            <router-link :to="menu.path">{{ menu.title }}</router-link>
          </a-menu-item>
        </template>
      </a-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '../../stores/menuStore';
import {
  HomeOutlined,
  UserOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
  TagOutlined,
  FileTextOutlined,
  DollarOutlined,
  WalletOutlined,
  LineChartOutlined,
  SyncOutlined,
  FolderOpenOutlined,
  PictureOutlined,
  MessageOutlined,
  DotChartOutlined,
  AppstoreOutlined,
  MenuOutlined,
} from '@ant-design/icons-vue';

const sidebarState = inject('sidebarState', { collapsed: false, toggleSidebar: () => {} });

const route = useRoute();
const menuStore = useMenuStore();
const openedMenus = ref<string[]>([]);
const menuKey = ref(0);

const activeMenu = computed(() => route.path);

const getIconComponent = (iconName?: string) => {
  const iconMap: Record<string, any> = {
    MenuOutlined,
    UserOutlined,
    ShoppingOutlined,
    UnorderedListOutlined,
    TagOutlined,
    FileTextOutlined,
    DollarOutlined,
    WalletOutlined,
    LineChartOutlined,
    SyncOutlined,
    FolderOpenOutlined,
    PictureOutlined,
    MessageOutlined,
    DotChartOutlined,
    AppstoreOutlined,
    HomeOutlined,
  };

  if (!iconName) return MenuOutlined;

  const normalizedName = iconName
    .replace(/Outlined$/, 'Outlined')
    .replace(/Filled$/, 'Filled')
    .replace(/TwoTone$/, 'TwoTone');

  return iconMap[normalizedName] || iconMap[iconName] || MenuOutlined;
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
