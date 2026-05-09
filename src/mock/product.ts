export default [
  {
    url: '/api/products',
    method: 'get',
    response: ({ query }) => {
      const current = parseInt(query.current as string) || 1
      const pageSize = parseInt(query.pageSize as string) || 10
      const productName = query.productName as string || ''
      const status = query.status as string

      const list = [
        { id: 1, productName: 'iPhone 15 Pro', productCode: 'PHONE001', category: '电子产品', price: 8999.00, stock: 100, status: 1, sales: 520, createTime: '2024-01-15 10:00:00' },
        { id: 2, productName: 'MacBook Pro 14', productCode: 'LAPTOP001', category: '电子产品', price: 15999.00, stock: 50, status: 1, sales: 280, createTime: '2024-01-20 14:30:00' },
        { id: 3, productName: 'AirPods Pro', productCode: 'AUDIO001', category: '电子产品', price: 1899.00, stock: 200, status: 1, sales: 850, createTime: '2024-02-01 09:15:00' },
        { id: 4, productName: '纯棉T恤', productCode: 'CLOTH001', category: '服装', price: 99.00, stock: 500, status: 1, sales: 1200, createTime: '2024-02-10 11:20:00' },
        { id: 5, productName: '运动休闲裤', productCode: 'CLOTH002', category: '服装', price: 199.00, stock: 300, status: 1, sales: 680, createTime: '2024-02-15 16:45:00' },
        { id: 6, productName: '有机牛奶', productCode: 'FOOD001', category: '食品', price: 68.00, stock: 1000, status: 1, sales: 2500, createTime: '2024-02-20 08:30:00' },
        { id: 7, productName: '坚果礼盒', productCode: 'FOOD002', category: '食品', price: 128.00, stock: 400, status: 1, sales: 890, createTime: '2024-03-01 10:00:00' },
        { id: 8, productName: '算法导论', productCode: 'BOOK001', category: '图书', price: 128.00, stock: 150, status: 1, sales: 320, createTime: '2024-03-05 14:20:00' },
        { id: 9, productName: '智能台灯', productCode: 'HOME001', category: '家居', price: 299.00, stock: 80, status: 0, sales: 150, createTime: '2024-03-10 09:30:00' },
        { id: 10, productName: '电竞椅', productCode: 'HOME002', category: '家居', price: 1299.00, stock: 30, status: 0, sales: 95, createTime: '2024-03-15 11:45:00' },
      ]

      let filtered = list
      if (productName) filtered = filtered.filter(item => item.productName.includes(productName))
      if (status !== undefined && status !== '') filtered = filtered.filter(item => item.status === parseInt(status as string))

      const start = (current - 1) * pageSize
      return {
        code: 200,
        message: 'success',
        data: { list: filtered.slice(start, start + pageSize), total: filtered.length, current, pageSize },
      }
    },
  },
  {
    url: '/api/products',
    method: 'post',
    response: ({ body }) => ({ code: 200, message: '新增成功', data: { id: Date.now(), ...body } }),
  },
  {
    url: '/api/products/:id',
    method: 'put',
    response: ({ body }) => ({ code: 200, message: '更新成功', data: body }),
  },
  {
    url: '/api/products/:id',
    method: 'delete',
    response: () => ({ code: 200, message: '删除成功', data: null }),
  },
]
