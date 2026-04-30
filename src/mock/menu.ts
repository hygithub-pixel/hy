import Mock from 'mockjs';
import { successResponse, generateId } from './utils';
import {
  userModuleMenus,
  productModuleMenus,
  orderModuleMenus,
  contentModuleMenus,
  financeModuleMenus,
} from '../stores/modules';
import {
  userData,
  productData,
  orderData,
  contentData,
  financeData,
} from './modules';

const menuConfig = {
  items: [
    {
      id: 'user-module',
      path: '/user-module',
      title: '用户管理',
      icon: 'UserOutlined',
      children: userModuleMenus,
    },
    {
      id: 'product-module',
      path: '/product-module',
      title: '商品管理',
      icon: 'ShoppingOutlined',
      children: productModuleMenus,
    },
    {
      id: 'order-module',
      path: '/order-module',
      title: '订单管理',
      icon: 'FileTextOutlined',
      children: orderModuleMenus,
    },
    {
      id: 'content-module',
      path: '/content-module',
      title: '内容管理',
      icon: 'FolderOpenOutlined',
      children: contentModuleMenus,
    },
    {
      id: 'finance-module',
      path: '/finance-module',
      title: '财务管理',
      icon: 'DollarOutlined',
      children: financeModuleMenus,
    },
  ],
};

const tableDataStore: Record<string, any[]> = {
  ...userData,
  ...productData,
  ...orderData,
  ...contentData,
  ...financeData,
};

const findMenu = (menus: any[], predicate: (menu: any) => boolean): any | null => {
  for (const menu of menus) {
    if (predicate(menu)) return menu;
    if (menu.children) {
      const found = findMenu(menu.children, predicate);
      if (found) return found;
    }
  }
  return null;
};

const handleListRequest = (menuId: string, options: any) => {
  const data = tableDataStore[menuId] || [];

  let page = 1;
  let pageSize = 10;

  if (options.method === 'GET') {
    const url = new URL(options.url, 'http://localhost');
    page = parseInt(url.searchParams.get('page') || '1');
    pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  } else {
    try {
      const body = JSON.parse(options.body || '{}');
      page = parseInt(body.page || '1');
      pageSize = parseInt(body.pageSize || '10');
    } catch (e) {
      console.log('[Mock] 解析请求体失败，使用默认分页参数', e);
    }
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end);

  return successResponse({
    dataList: pageData,
    pagination: {
      currentPage: page,
      pageSize,
      total: data.length,
    },
  });
};

const handleCreateRequest = (menuId: string, options: any) => {
  let body = {};
  try {
    body = JSON.parse(options.body || '{}');
  } catch (e) {
    console.log('[Mock] 解析请求体失败，使用空对象', e);
  }
  const newItem = {
    id: generateId(),
    ...body,
  };

  if (!tableDataStore[menuId]) {
    tableDataStore[menuId] = [];
  }
  tableDataStore[menuId].unshift(newItem);

  return successResponse({ id: newItem.id }, '创建成功');
};

const handleUpdateRequest = (menuId: string, dataId: string, options: any) => {
  let body = {};
  try {
    body = JSON.parse(options.body || '{}');
  } catch (e) {
    console.log('[Mock] 解析请求体失败，使用空对象', e);
  }

  if (tableDataStore[menuId]) {
    const index = tableDataStore[menuId].findIndex(item => item.id === dataId);
    if (index !== -1) {
      tableDataStore[menuId][index] = { ...tableDataStore[menuId][index], ...body };
    }
  }

  return successResponse({ success: true }, '更新成功');
};

const handleDeleteRequest = (menuId: string, dataId: string) => {
  if (tableDataStore[menuId]) {
    const index = tableDataStore[menuId].findIndex(item => item.id === dataId);
    if (index !== -1) {
      tableDataStore[menuId].splice(index, 1);
    }
  }

  return successResponse({ success: true }, '删除成功');
};

const tradeMenuIdMap: Record<string, string> = {
  users: 'user-1',
  products: 'product-1',
  'menu/user-1/data': 'user-1',
  'menu/user-2/data': 'user-2',
  'menu/product-1/data': 'product-1',
  'menu/product-2/data': 'product-2',
  'menu/product-3/data': 'product-3',
  'menu/order-1/data': 'order-1',
  'menu/order-2/data': 'order-2',
  'menu/order-3/data': 'order-3',
  'menu/content-1/data': 'content-1',
  'menu/content-2/data': 'content-2',
  'menu/content-3/data': 'content-3',
  'menu/content-4/data': 'content-4',
  'menu/finance-1/data': 'finance-1',
  'menu/finance-2/data': 'finance-2',
  'menu/finance-3/data': 'finance-3',
  'user-1-query': 'user-1',
  'user-2-query': 'user-2',
  'product-1-query': 'product-1',
  'product-2-query': 'product-2',
  'product-3-query': 'product-3',
  'order-1-query': 'order-1',
  'order-2-query': 'order-2',
  'order-3-query': 'order-3',
  'content-1-query': 'content-1',
  'content-2-query': 'content-2',
  'content-3-query': 'content-3',
  'content-4-query': 'content-4',
  'finance-1-query': 'finance-1',
  'finance-2-query': 'finance-2',
  'finance-3-query': 'finance-3',
};

export const setupMenuMock = () => {
  Mock.mock(/\/api\/menu\/config/, 'post', () => {
    return successResponse({ items: menuConfig.items });
  });

  Mock.mock(/\/api\/menu\/config/, 'get', () => {
    return successResponse({ items: menuConfig.items });
  });

  Mock.mock(/\/api\/menu\/detail/, 'get', (options: any) => {
    let path = '';
    if (options.method === 'GET') {
      const url = new URL(options.url, 'http://localhost');
      path = url.searchParams.get('path') || '';
    } else {
      const body = JSON.parse(options.body || '{}');
      path = body.path || '';
    }
    const menu = findMenu(menuConfig.items, (m: any) => m.path === path);
    if (menu) {
      return successResponse({ menu });
    }
    return { code: 404, data: null, message: '菜单不存在' };
  });

  Mock.mock(/\/api\/menu\/([^/]+)$/, 'get', (options: any) => {
    const id = options.url.match(/\/api\/menu\/([^/]+)$/)?.[1];
    const menu = findMenu(menuConfig.items, (m: any) => m.id === id);
    if (menu) {
      return successResponse({ menu });
    }
    return { code: 404, data: null, message: '菜单不存在' };
  });

  Mock.mock(/\/api\/menu\/([^/]+)\/data$/, 'get', (options: any) => {
    const match = options.url.match(/\/api\/menu\/([^/]+)\/data$/);
    const menuId = match?.[1];
    return handleListRequest(menuId!, options);
  });

  Mock.mock(/\/api\/menu\/([^/]+)\/data$/, 'post', (options: any) => {
    const match = options.url.match(/\/api\/menu\/([^/]+)\/data$/);
    const menuId = match?.[1];
    return handleCreateRequest(menuId!, options);
  });

  Mock.mock(/\/api\/menu\/([^/]+)\/data\/update$/, 'post', (options: any) => {
    const match = options.url.match(/\/api\/menu\/([^/]+)\/data\/update$/);
    const menuId = match?.[1];
    const body = JSON.parse(options.body || '{}');
    const dataId = body.id;
    return handleUpdateRequest(menuId!, dataId!, options);
  });

  Mock.mock(/\/api\/menu\/([^/]+)\/data\/delete$/, 'post', (options: any) => {
    const match = options.url.match(/\/api\/menu\/([^/]+)\/data\/delete$/);
    const menuId = match?.[1];
    const body = JSON.parse(options.body || '{}');
    const dataId = body.id;
    return handleDeleteRequest(menuId!, dataId!);
  });

  Mock.mock(/\/api\/users$/, 'get', (options: any) => {
    return handleListRequest('user-1', options);
  });

  Mock.mock(/\/api\/users$/, 'post', (options: any) => {
    return handleCreateRequest('user-1', options);
  });

  Mock.mock(/\/api\/users\/([^/]+)$/, 'put', (options: any) => {
    const match = options.url.match(/\/api\/users\/([^/]+)$/);
    const dataId = match?.[1];
    return handleUpdateRequest('user-1', dataId!, options);
  });

  Mock.mock(/\/api\/users\/([^/]+)$/, 'delete', (options: any) => {
    const match = options.url.match(/\/api\/users\/([^/]+)$/);
    const dataId = match?.[1];
    return handleDeleteRequest('user-1', dataId!);
  });

  Mock.mock(/\/api\/products$/, 'get', (options: any) => {
    return handleListRequest('product-1', options);
  });

  Mock.mock(/\/api\/products$/, 'post', (options: any) => {
    return handleCreateRequest('product-1', options);
  });

  Mock.mock(/\/api\/products\/([^/]+)$/, 'put', (options: any) => {
    const match = options.url.match(/\/api\/products\/([^/]+)$/);
    const dataId = match?.[1];
    return handleUpdateRequest('product-1', dataId!, options);
  });

  Mock.mock(/\/api\/products\/([^/]+)$/, 'delete', (options: any) => {
    const match = options.url.match(/\/api\/products\/([^/]+)$/);
    const dataId = match?.[1];
    return handleDeleteRequest('product-1', dataId!);
  });

  Mock.mock(/\/api\/.+$/, 'post', (options: any) => {
    const url = options.url;
    const tradeName = url.replace(/^\/api\//, '');

    console.log('[Mock] 收到POST请求:', tradeName);

    if (tradeName === 'auth/login') {
      console.log('[Mock] 处理登录请求');
      return successResponse(
        {
          token: 'mock-token-123456',
          user: {
            id: 'user-1',
            username: 'admin',
            avatar: '',
            role: 'admin',
          },
        },
        '登录成功'
      );
    }

    if (tradeName === 'menu/config') {
      console.log('[Mock] 处理菜单配置请求');
      return successResponse({ items: menuConfig.items });
    }

    let menuId: string | null = null;

    if (tradeMenuIdMap[tradeName]) {
      menuId = tradeMenuIdMap[tradeName];
      console.log('[Mock] 找到菜单ID:', menuId);
    } else if (tradeName.endsWith('/update')) {
      const baseTradeName = tradeName.replace('/update', '');
      menuId = tradeMenuIdMap[baseTradeName];
      if (menuId) {
        let body: any = {};
        try {
          body = JSON.parse(options.body || '{}');
        } catch (e) {
          console.log('[Mock] 解析请求体失败，使用空对象', e);
        }
        const dataId = body.id;
        return handleUpdateRequest(menuId, dataId, options);
      }
    } else if (tradeName.endsWith('/delete')) {
      const baseTradeName = tradeName.replace('/delete', '');
      menuId = tradeMenuIdMap[baseTradeName];
      if (menuId) {
        let body: any = {};
        try {
          body = JSON.parse(options.body || '{}');
        } catch (e) {
          console.log('[Mock] 解析请求体失败，使用空对象', e);
        }
        const dataId = body.id;
        return handleDeleteRequest(menuId, dataId);
      }
    }

    if (menuId) {
      let body: any = {};
      try {
        body = JSON.parse(options.body || '{}');
      } catch (e) {
        console.log('[Mock] 解析请求体失败，使用空对象', e);
      }
      console.log('[Mock] 请求参数:', body);
      const isQueryTrade =
        tradeName.endsWith('-query') ||
        (body && (body.page !== undefined || body.pageSize !== undefined));
      console.log('[Mock] 是否是查询交易:', isQueryTrade);

      if (isQueryTrade) {
        const response = handleListRequest(menuId, options);
        console.log('[Mock] 查询交易响应:', response);
        return response;
      } else if (body.id) {
        return handleUpdateRequest(menuId, body.id, options);
      } else {
        return handleCreateRequest(menuId, options);
      }
    }

    console.log('[Mock] 未找到菜单ID，返回默认响应');
    return successResponse(null);
  });

  Mock.mock(/\/api\/.+$/, 'get', (options: any) => {
    const url = options.url;
    const pathname = url.replace(/^https?:\/\/[^/]+/, '').replace(/^\//, '');
    const tradeName = pathname.startsWith('api/') ? pathname.replace('api/', '') : pathname;

    let menuId: string | null = null;

    if (tradeMenuIdMap[tradeName]) {
      menuId = tradeMenuIdMap[tradeName];
    }

    if (menuId) {
      return handleListRequest(menuId, options);
    }

    return successResponse({ data: [], pagination: { currentPage: 1, pageSize: 10, total: 0 } });
  });

  console.log('[Mock] 菜单 Mock 服务已启动');
};
