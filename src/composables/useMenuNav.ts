import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '../stores/menuStore';
import { showMessage } from '../utils/message';
import type { MenuItem } from '../types/MenuConfig';

/**
 * 路径到菜单ID的映射
 */
const PATH_TO_MENU_ID: Record<string, string> = {
  '/users': 'user-1',
  '/roles': 'user-2',
  '/products': 'product-1',
  '/categories': 'product-2',
  '/inventory': 'product-3',
  '/orders': 'order-1',
  '/order-stats': 'order-2',
  '/refunds': 'order-3',
  '/articles': 'content-1',
  '/content-categories': 'content-2',
  '/ads': 'content-3',
  '/comments': 'content-4',
  '/revenue': 'finance-1',
  '/expenses': 'finance-2',
  '/finance-reports': 'finance-3',
};

/**
 * 菜单导航组合函数
 * @returns 菜单导航相关状态和方法
 * @example
 * ```typescript
 * const { currentMenu, loadCurrentMenu } = useMenuNav();
 * 
 * // 加载当前菜单
 * const menu = await loadCurrentMenu();
 * if (menu) {
 *   console.log('当前菜单:', menu);
 * }
 * ```
 */
export const useMenuNav = () => {
  const route = useRoute();
  const router = useRouter();
  const menuStore = useMenuStore();

  /** 当前菜单 */
  const currentMenu = ref<MenuItem | null>(null);
  /** 加载状态 */
  const loading = ref(false);
  /** 错误信息 */
  const error = ref<string | null>(null);

  /**
   * 根据路径查找菜单
   * @param menus - 菜单数组
   * @param targetPath - 目标路径
   * @returns 找到的菜单或null
   */
  const findMenuByPath = (menus: MenuItem[], targetPath: string): MenuItem | null => {
    for (const menu of menus) {
      if (menu.path === targetPath) {
        return menu;
      }
      if (menu.children) {
        const found = findMenuByPath(menu.children, targetPath);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  /**
   * 根据ID查找菜单
   * @param menuId - 菜单ID
   * @returns 找到的菜单或null
   */
  const findMenuById = (menuId: string): MenuItem | null => {
    return menuStore.getMenuById(menuId) || null;
  };

  /**
   * 加载当前菜单
   * @returns 当前菜单或null
   */
  const loadCurrentMenu = async (): Promise<MenuItem | null> => {
    loading.value = true;
    error.value = null;

    try {
      await menuStore.initMenuConfig();

      const currentPath = route.path;
      let menu: MenuItem | null = findMenuByPath(menuStore.getAllMenus, currentPath);

      if (!menu && PATH_TO_MENU_ID[currentPath]) {
        menu = findMenuById(PATH_TO_MENU_ID[currentPath]);
      }

      if (!menu) {
        error.value = '菜单不存在';
        showMessage.error('菜单不存在');
        router.push('/dashboard');
        return null;
      }

      currentMenu.value = menu;
      return menu;
    } catch (err) {
      console.error('加载菜单数据失败:', err);
      error.value = '加载菜单数据失败';
      showMessage.error('加载菜单数据失败');
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    /** 当前菜单 */
    currentMenu,
    /** 加载状态 */
    loading,
    /** 错误信息 */
    error,
    /** 加载当前菜单 */
    loadCurrentMenu,
    /** 根据路径查找菜单 */
    findMenuByPath,
    /** 根据ID查找菜单 */
    findMenuById,
  };
};
