export const orderData = {
  'order-1': [
    { id: '1', orderNo: 'ORD20240101001', status: '已完成', receiver: '张三', phone: '13800138000', orderTime: '2024-01-01 10:00:00' },
    { id: '2', orderNo: 'ORD20240101002', status: '已支付', receiver: '李四', phone: '13900139000', orderTime: '2024-01-02 14:30:00' },
    { id: '3', orderNo: 'ORD20240101003', status: '待支付', receiver: '王五', phone: '13700137000', orderTime: '2024-01-03 09:15:00' },
  ],
  'order-2': [
    { id: '1', date: '2024-01-01', orderCount: 100, totalAmount: 50000, paidCount: 90, cancelledCount: 10 },
    { id: '2', date: '2024-01-02', orderCount: 120, totalAmount: 60000, paidCount: 110, cancelledCount: 10 },
    { id: '3', date: '2024-01-03', orderCount: 80, totalAmount: 40000, paidCount: 75, cancelledCount: 5 },
  ],
  'order-3': [
    { id: '1', orderNo: 'ORD20240101001', refundAmount: 299.99, reason: '商品质量问题', status: '已退款', applyTime: '2024-01-05 10:00:00' },
    { id: '2', orderNo: 'ORD20240101002', refundAmount: 99.99, reason: '不想要了', status: '处理中', applyTime: '2024-01-06 14:30:00' },
    { id: '3', orderNo: 'ORD20240101003', refundAmount: 599.99, reason: '尺寸不合适', status: '已拒绝', applyTime: '2024-01-07 09:15:00' },
  ],
};
