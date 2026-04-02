import Mock from 'mockjs';
import { successResponse, generateId } from './utils';
import { userModuleMenus, productModuleMenus, orderModuleMenus, contentModuleMenus, financeModuleMenus } from '../stores/modules';

const menuConfig = {
  items: [
    {
      id: 'user-module',
      path: '/user-module',
      title: '用户管理',
      icon: 'User',
      children: userModuleMenus
    },
    {
      id: 'product-module',
      path: '/product-module',
      title: '商品管理',
      icon: 'Goods',
      children: productModuleMenus
    },
    {
      id: 'order-module',
      path: '/order-module',
      title: '订单管理',
      icon: 'Document',
      children: orderModuleMenus
    },
    {
      id: 'content-module',
      path: '/content-module',
      title: '内容管理',
      icon: 'Document',
      children: contentModuleMenus
    },
    {
      id: 'finance-module',
      path: '/finance-module',
      title: '财务管理',
      icon: 'Money',
      children: financeModuleMenus
    }
  ]
};

const tableDataStore: Record<string, any[]> = {};

const initTableData = () => {
  tableDataStore['user-1'] = [
    { id: '1', username: 'admin', role: '超级管理员', avatar: 'https://via.placeholder.com/100', enabled: true },
    { id: '2', username: 'user1', role: '管理员', avatar: 'https://via.placeholder.com/100', enabled: true },
    { id: '3', username: 'user2', role: '普通用户', avatar: 'https://via.placeholder.com/100', enabled: false }
  ];
  tableDataStore['user-2'] = [
    { id: '1', name: '超级管理员', description: '系统最高权限', enabled: true },
    { id: '2', name: '管理员', description: '系统管理权限', enabled: true },
    { id: '3', name: '普通用户', description: '基础操作权限', enabled: true }
  ];
  tableDataStore['product-1'] = [
    { id: '1', name: '智能手机', price: 5999.99, image: 'https://via.placeholder.com/150', category: '电子产品', onSale: true },
    { id: '2', name: 'T恤衫', price: 99.99, image: 'https://via.placeholder.com/150', category: '服装', onSale: true },
    { id: '3', name: '咖啡', price: 29.99, image: 'https://via.placeholder.com/150', category: '食品', onSale: false }
  ];
  tableDataStore['product-2'] = [
    { id: '1', name: '电子产品', description: '电子类商品', enabled: true },
    { id: '2', name: '服装', description: '服饰类商品', enabled: true },
    { id: '3', name: '食品', description: '食品类商品', enabled: true }
  ];
  tableDataStore['product-3'] = [
    { id: '1', productName: '智能手机', stock: 100, unit: '台', warehouse: '主仓库', status: '正常' },
    { id: '2', productName: 'T恤衫', stock: 500, unit: '件', warehouse: '主仓库', status: '正常' },
    { id: '3', productName: '咖啡', stock: 30, unit: '袋', warehouse: '冷藏库', status: '库存低' }
  ];
  tableDataStore['order-1'] = [
    { id: '1', orderNo: 'ORD20240101001', status: '已完成', receiver: '张三', phone: '13800138000', orderTime: '2024-01-01 10:00:00' },
    { id: '2', orderNo: 'ORD20240101002', status: '已支付', receiver: '李四', phone: '13900139000', orderTime: '2024-01-02 14:30:00' },
    { id: '3', orderNo: 'ORD20240101003', status: '待支付', receiver: '王五', phone: '13700137000', orderTime: '2024-01-03 09:15:00' }
  ];
  tableDataStore['order-2'] = [
    { id: '1', date: '2024-01-01', orderCount: 100, totalAmount: 50000, paidCount: 90, cancelledCount: 10 },
    { id: '2', date: '2024-01-02', orderCount: 120, totalAmount: 60000, paidCount: 110, cancelledCount: 10 },
    { id: '3', date: '2024-01-03', orderCount: 80, totalAmount: 40000, paidCount: 75, cancelledCount: 5 }
  ];
  tableDataStore['order-3'] = [
    { id: '1', orderNo: 'ORD20240101001', refundAmount: 299.99, reason: '商品质量问题', status: '已退款', applyTime: '2024-01-05 10:00:00' },
    { id: '2', orderNo: 'ORD20240101002', refundAmount: 99.99, reason: '不想要了', status: '处理中', applyTime: '2024-01-06 14:30:00' },
    { id: '3', orderNo: 'ORD20240101003', refundAmount: 599.99, reason: '尺寸不合适', status: '已拒绝', applyTime: '2024-01-07 09:15:00' }
  ];
  tableDataStore['content-1'] = [
    { id: '1', title: '系统更新公告', category: '公告', content: '&lt;p&gt;系统将于本周进行更新...&lt;/p&gt;', published: true },
    { id: '2', title: '使用教程', category: '教程', content: '&lt;p&gt;欢迎使用我们的系统...&lt;/p&gt;', published: true },
    { id: '3', title: '新闻动态', category: '新闻', content: '&lt;p&gt;最新动态...&lt;/p&gt;', published: false }
  ];
  tableDataStore['content-2'] = [
    { id: '1', name: '公告', description: '系统公告类文章', articleCount: 10, enabled: true },
    { id: '2', name: '新闻', description: '新闻资讯类文章', articleCount: 20, enabled: true },
    { id: '3', name: '教程', description: '使用教程类文章', articleCount: 15, enabled: true }
  ];
  tableDataStore['content-3'] = [
    { id: '1', title: '首页Banner', position: '首页顶部', image: 'https://via.placeholder.com/800x300', link: '/promotion', status: '已发布' },
    { id: '2', title: '新品推荐', position: '首页中部', image: 'https://via.placeholder.com/400x200', link: '/products/new', status: '已发布' },
    { id: '3', title: '活动预告', position: '首页底部', image: 'https://via.placeholder.com/800x150', link: '/activity', status: '草稿' }
  ];
  tableDataStore['content-4'] = [
    { id: '1', articleTitle: '系统更新公告', username: 'admin', content: '更新很及时！', rating: 5, status: '已审核', createTime: '2024-01-05 10:00:00' },
    { id: '2', articleTitle: '使用教程', username: 'user1', content: '教程很详细', rating: 4, status: '已审核', createTime: '2024-01-06 14:30:00' },
    { id: '3', articleTitle: '新闻动态', username: 'user2', content: '希望多更新', rating: 3, status: '待审核', createTime: '2024-01-07 09:15:00' }
  ];
  tableDataStore['finance-1'] = [
    { id: '1', date: '2024-01-01', type: '日统计', amount: '¥10,000.00', remark: '销售收入' },
    { id: '2', date: '2024-01-02', type: '日统计', amount: '¥12,000.00', remark: '销售收入' },
    { id: '3', date: '2024-01', type: '月统计', amount: '¥300,000.00', remark: '月销售收入' }
  ];
  tableDataStore['finance-2'] = [
    { id: '1', date: '2024-01-01', type: '办公费用', amount: '¥500.00', remark: '办公用品采购' },
    { id: '2', date: '2024-01-02', type: '人力成本', amount: '¥50,000.00', remark: '员工工资' },
    { id: '3', date: '2024-01-03', type: '营销费用', amount: '¥10,000.00', remark: '广告投放' }
  ];
  tableDataStore['finance-3'] = [
    { id: '1', reportName: '2024年1月财务报表', reportType: '月度报表', period: '2024-01', status: '已生成', createTime: '2024-02-01 10:00:00' },
    { id: '2', reportName: '2024年Q1财务报表', reportType: '季度报表', period: '2024-Q1', status: '生成中', createTime: '2024-04-01 09:00:00' },
    { id: '3', reportName: '2023年度财务报表', reportType: '年度报表', period: '2023', status: '已生成', createTime: '2024-01-15 14:30:00' }
  ];
};

initTableData();

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

export const setupMenuMock = () => {
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
        total: data.length
      }
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
      ...body
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
    'users': 'user-1',
    'products': 'product-1',
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
    'finance-3-query': 'finance-3'
  };

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
    
    // 特殊处理菜单配置请求
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
      const isQueryTrade = tradeName.endsWith('-query') || (body && (body.page !== undefined || body.pageSize !== undefined));
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
