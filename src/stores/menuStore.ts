import { defineStore } from 'pinia';
import { MenuItem, MenuConfig } from '../types/MenuConfig';
import { menuApi } from '../api/menu';
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

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuConfig: { items: [] } as MenuConfig,
    currentMenu: null as MenuItem | null,
    loading: false,
    error: null as string | null,
    initialized: false
  }),
  getters: {
    getMenuById: (state) => {
      return (id: string): MenuItem | null => {
        return findMenuBy(state.menuConfig.items, (menu) => menu.id === id);
      };
    },
    getAllMenus: (state) => {
      return state.menuConfig.items;
    }
  },
  actions: {
    async initMenuConfig() {
      if (this.initialized) return;
      this.$patch((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const res = await menuApi.getMenuConfig();
        this.$patch((state) => {
          state.menuConfig = res.data || { items: [] };
          state.initialized = true;
        });
      } catch (error) {
        const errorMessage = '初始化菜单配置失败';
        this.$patch((state) => {
          state.error = errorMessage;
        });
        ErrorHandler.handleApiError(error, { showMessage: true, logError: true });
      } finally {
        this.$patch((state) => {
          state.loading = false;
        });
      }
    },
    async fetchMenuByPath(path: string) {
      this.$patch((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const res = await menuApi.getMenuByPath(path);
        const menu = res.data.menu;
        if (menu && menu.tableConfig && !menu.tableConfig.data) {
          menu.tableConfig = {
            ...menu.tableConfig,
            data: []
          };
        }
        this.$patch((state) => {
          state.currentMenu = menu;
        });
      } catch (error) {
        const errorMessage = '获取菜单数据失败';
        this.$patch((state) => {
          state.error = errorMessage;
        });
        ErrorHandler.handleApiError(error, { showMessage: true, logError: true });
      } finally {
        this.$patch((state) => {
          state.loading = false;
        });
      }
    },

  },
  persist: {
    key: 'menu-store',
    storage: localStorage,
    paths: ['menuConfig']
  }
});
