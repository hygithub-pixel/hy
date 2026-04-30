import { defineModuleConfig } from '../schema/types';

export default defineModuleConfig({
  id: 'order',
  path: '/orders',
  title: '订单列表',
  icon: 'Document',
  description: '管理订单信息',
  
  api: {
    list: '/api/orders',
    create: '/api/orders',
    update: '/api/orders/:id',
    delete: '/api/orders/:id',
    query: 'order-1-query',
  },
  
  table: {
    columns: [
      { type: 'index', prop: 'index', label: '序号' },
      { type: 'text', prop: 'orderNo', label: '订单号' },
      { type: 'text', prop: 'customer', label: '客户' },
      { type: 'text', prop: 'amount', label: '金额' },
      { type: 'badge', prop: 'status', label: '状态' },
      { type: 'text', prop: 'createTime', label: '创建时间' },
      {
        type: 'actions',
        prop: 'actions',
        label: '操作',
        actions: [
          { id: 'view', label: '查看', type: 'primary' },
          { id: 'edit', label: '编辑', type: 'warning' },
          { id: 'delete', label: '删除', type: 'danger' },
        ],
      },
    ],
    pagination: {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50],
    },
  } as any,
  
  form: {
    items: [
      {
        type: 'text',
        label: '订单号',
        field: 'orderNo',
        placeholder: '自动生成',
        props: {
          disabled: true,
        },
      },
      {
        type: 'text',
        label: '客户',
        field: 'customer',
        placeholder: '请输入客户名称',
        rules: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
        ],
      },
      {
        type: 'text',
        label: '金额',
        field: 'amount',
        placeholder: '请输入金额',
        rules: [
          { required: true, message: '请输入金额', trigger: 'blur' },
        ],
      },
      {
        type: 'select',
        label: '状态',
        field: 'status',
        placeholder: '请选择状态',
        options: [
          { label: '待支付', value: 'pending' },
          { label: '已支付', value: 'paid' },
          { label: '已发货', value: 'shipped' },
          { label: '已完成', value: 'completed' },
          { label: '已取消', value: 'cancelled' },
        ],
        rules: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
      },
      {
        type: 'textarea',
        label: '备注',
        field: 'remark',
        placeholder: '请输入备注',
      },
    ],
    labelPosition: 'top',
    size: 'large',
  },
  
  hooks: {
    async beforeCreate(data) {
      const orderNo = `ORD${Date.now()}`;
      return {
        ...data,
        orderNo,
        createTime: new Date().toISOString(),
      };
    },
    async beforeUpdate(data) {
      return {
        ...data,
        updateTime: new Date().toISOString(),
      };
    },
    async beforeDelete(id) {
      console.log('[OrderModule] Deleting order:', id);
      return true;
    },
  },
  
  permissions: {
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canExport: true,
    canImport: false,
    canView: true,
  },
  
  meta: {
    module: 'order',
    version: '1.0.0',
  },
});
