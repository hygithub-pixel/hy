import Mock from 'mockjs';
import { mockData } from './data';

Mock.setup({
  timeout: '200-500',
});

Mock.mock(/\/api\/users/, 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  const current = parseInt(params.get('current') || '1');
  const pageSize = parseInt(params.get('pageSize') || '10');
  const username = params.get('username') || '';
  const status = params.get('status');
  
  let list = [...mockData.users()];
  
  if (username) {
    list = list.filter(item => item.username.includes(username));
  }
  if (status !== null && status !== undefined && status !== '') {
    list = list.filter(item => item.status === parseInt(status));
  }
  
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: list.slice(start, end),
      total: list.length,
      current,
      pageSize,
    },
  };
});

Mock.mock(/\/api\/users/, 'post', (options: any) => {
  const body = JSON.parse(options.body);
  return {
    code: 200,
    message: '新增成功',
    data: { id: Date.now(), ...body },
  };
});

Mock.mock(/\/api\/users\/\d+/, 'put', (options: any) => {
  const body = JSON.parse(options.body);
  return {
    code: 200,
    message: '更新成功',
    data: body,
  };
});

Mock.mock(/\/api\/users\/\d+/, 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null,
  };
});

Mock.mock(/\/api\/roles/, 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  const current = parseInt(params.get('current') || '1');
  const pageSize = parseInt(params.get('pageSize') || '10');
  
  let list = [...mockData.roles()];
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: list.slice(start, end),
      total: list.length,
      current,
      pageSize,
    },
  };
});

Mock.mock(/\/api\/departments/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: mockData.departments(),
  };
});

Mock.mock(/\/api\/products/, 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  const current = parseInt(params.get('current') || '1');
  const pageSize = parseInt(params.get('pageSize') || '10');
  const productName = params.get('productName') || '';
  
  let list = [...mockData.products()];
  
  if (productName) {
    list = list.filter(item => item.productName.includes(productName));
  }
  
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: list.slice(start, end),
      total: list.length,
      current,
      pageSize,
    },
  };
});

Mock.mock(/\/api\/orders/, 'get', (options: any) => {
  const params = new URLSearchParams(options.url.split('?')[1]);
  const current = parseInt(params.get('current') || '1');
  const pageSize = parseInt(params.get('pageSize') || '10');
  const orderNo = params.get('orderNo') || '';
  
  let list = [...mockData.orders()];
  
  if (orderNo) {
    list = list.filter(item => item.orderNo.includes(orderNo));
  }
  
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    code: 200,
    message: 'success',
    data: {
      list: list.slice(start, end),
      total: list.length,
      current,
      pageSize,
    },
  };
});

export default Mock;
