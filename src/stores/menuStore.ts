import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MenuItem, MenuConfig } from '../types/MenuConfig';
import { apiService } from '../services/apiService';
import { ErrorHandler } from '../utils/errorHandler';

const findMenuBy = (menus: MenuItem[], predicate: (menu: MenuItem) => boolean): MenuItem | null => {
  for (const menu of menus) {
    if (predicate(menu)) return menu;
    if (menu.children) {
      const found = findMenuBy(menu.children, predicate);
      if (found) return found;
    }
  }
  return null;
};

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menuConfig = ref<MenuConfig>({ items: [] });
    const currentMenu = ref<MenuItem | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const initialized = ref(false);

    const getMenuById = computed(() => {
      return (id: string): MenuItem | null => {
        return findMenuBy(menuConfig.value.items, menu => menu.id === id);
      };
    });

    const getAllMenus = computed(() => {
      return menuConfig.value.items;
    });

    async function initMenuConfig() {
      if (initialized.value) return;
      loading.value = true;
      error.value = null;
      try {
        const res = await apiService.get('menu/config');
        menuConfig.value = res.data || { items: [] };
        initialized.value = true;
      } catch (err) {
        const errorMessage = '初始化菜单配置失败';
        error.value = errorMessage;
        ErrorHandler.handleApiError(err, { showMessage: true, logError: true });
      } finally {
        loading.value = false;
      }
    }

    async function fetchMenuByPath(path: string) {
      loading.value = true;
      error.value = null;
      try {
        const res = await apiService.get('menu/detail', { path });
        const menu = res.data.menu;
        if (menu && menu.tableConfig && !menu.tableConfig.data) {
          menu.tableConfig = {
            ...menu.tableConfig,
            data: [],
          };
        }
        currentMenu.value = menu;
      } catch (err) {
        const errorMessage = '获取菜单数据失败';
        error.value = errorMessage;
        ErrorHandler.handleApiError(err, { showMessage: true, logError: true });
      } finally {
        loading.value = false;
      }
    }

    return {
      menuConfig,
      currentMenu,
      loading,
      error,
      initialized,
      getMenuById,
      getAllMenus,
      initMenuConfig,
      fetchMenuByPath,
    };
  },
  {
    persist: {
      key: 'menu-store',
      storage: localStorage,
      paths: ['menuConfig'],
    },
  }
);
