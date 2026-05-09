export default [
  {
    url: '/api/orders',
    method: 'get',
    response: ({ query }) => {
      const current = parseInt(query.current as string) || 1
      const pageSize = parseInt(query.pageSize as string) || 10
      const orderNo = query.orderNo as string || ''
      const orderStatus = query.orderStatus as string || ''

      const list = [
        { id: 1, orderNo: 'ORD202401150001', userName: '张三', productName: 'iPhone 15 Pro', totalAmount: 8999.00, quantity: 1, orderStatus: '已完成', payStatus: '已支付', createTime: '2024-01-15 10:30:00' },
        { id: 2, orderNo: 'ORD202401200002', userName: '李四', productName: 'MacBook Pro 14', totalAmount: 15999.00, quantity: 1, orderStatus: '已支付', payStatus: '已支付', createTime: '2024-01-20 14:45:00' },
        { id: 3, orderNo: 'ORD202402010003', userName: '王五', productName: 'AirPods Pro', totalAmount: 1899.00, quantity: 2, orderStatus: '待支付', payStatus: '未支付', createTime: '2024-02-01 09:15:00' },
        { id: 4, orderNo: 'ORD202402100004', userName: '赵六', productName: '纯棉T恤', totalAmount: 198.00, quantity: 2, orderStatus: '已完成', payStatus: '已支付', createTime: '2024-02-10 11:20:00' },
        { id: 5, orderNo: 'ORD202402150005', userName: '钱七', productName: '有机牛奶', totalAmount: 136.00, quantity: 2, orderStatus: '已完成', payStatus: '已支付', createTime: '2024-02-15 16:45:00' },
        { id: 6, orderNo: 'ORD202402200006', userName: '孙八', productName: '坚果礼盒', totalAmount: 256.00, quantity: 2, orderStatus: '已取消', payStatus: '已退款', createTime: '2024-02-20 08:30:00' },
        { id: 7, orderNo: 'ORD202403010007', userName: '周九', productName: '算法导论', totalAmount: 128.00, quantity: 1, orderStatus: '已完成', payStatus: '已支付', createTime: '2024-03-01 10:00:00' },
        { id: 8, orderNo: 'ORD202403050008', userName: '吴十', productName: '智能台灯', totalAmount: 299.00, quantity: 1, orderStatus: '待支付', payStatus: '未支付', createTime: '2024-03-05 14:20:00' },
      ]

      let filtered = list
      if (orderNo) filtered = filtered.filter(item => item.orderNo.includes(orderNo))
      if (orderStatus) filtered = filtered.filter(item => item.orderStatus === orderStatus)

      const start = (current - 1) * pageSize
      return {
        code: 200,
        message: 'success',
        data: { list: filtered.slice(start, start + pageSize), total: filtered.length, current, pageSize },
      }
    },
  },
  {
    url: '/api/orders',
    method: 'post',
    response: ({ body }) => ({ code: 200, message: '新增成功', data: { id: Date.now(), ...body } }),
  },
  {
    url: '/api/orders/:id',
    method: 'put',
    response: ({ body }) => ({ code: 200, message: '更新成功', data: body }),
  },
  {
    url: '/api/orders/:id',
    method: 'delete',
    response: () => ({ code: 200, message: '删除成功', data: null }),
  },
]
