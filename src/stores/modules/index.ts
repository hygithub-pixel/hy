// 导出所有模块的菜单配置
import { contentModuleMenus } from './content/module';
import { financeModuleMenus } from './finance/module';
import { orderModuleMenus } from './order/module';
import { productModuleMenus } from './product/module';
import { userModuleMenus } from './user/module';

// 导出所有模块的菜单
export {
  contentModuleMenus,
  financeModuleMenus,
  orderModuleMenus,
  productModuleMenus,
  userModuleMenus
};

// 导出所有菜单的集合（可选，方便统一使用）
export const allModuleMenus = [
  ...contentModuleMenus,
  ...financeModuleMenus,
  ...orderModuleMenus,
  ...productModuleMenus,
  ...userModuleMenus
];
