import { defineModuleConfig } from '../schema/types';

export default defineModuleConfig({
  id: 'product',
  path: '/products',
  title: '商品列表',
  icon: 'Goods',
  description: '管理商品信息',
  
  api: {
    list: '/api/products',
    create: '/api/products',
    update: '/api/products/:id',
    delete: '/api/products/:id',
    query: 'product-1-query',
  },
  
  table: {
    columns: [
      { type: 'index', prop: 'index', label: '序号' },
      { type: 'text', prop: 'name', label: '商品名称' },
      { type: 'text', prop: 'price', label: '价格' },
      { type: 'text', prop: 'stock', label: '库存' },
      { type: 'image', prop: 'image', label: '图片' },
      {
        type: 'actions',
        prop: 'actions',
        label: '操作',
        actions: [
          { id: 'edit', label: '编辑', type: 'primary' },
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
        label: '商品名称',
        field: 'name',
        placeholder: '请输入商品名称',
        rules: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
      },
      {
        type: 'text',
        label: '价格',
        field: 'price',
        placeholder: '请输入价格',
        rules: [
          { required: true, message: '请输入价格', trigger: 'blur' },
        ],
      },
      {
        type: 'text',
        label: '库存',
        field: 'stock',
        placeholder: '请输入库存',
        rules: [
          { required: true, message: '请输入库存', trigger: 'blur' },
        ],
      },
      {
        type: 'upload',
        label: '商品图片',
        field: 'image',
        placeholder: '请上传商品图片',
      },
      {
        type: 'textarea',
        label: '商品描述',
        field: 'description',
        placeholder: '请输入商品描述',
      },
    ],
    labelPosition: 'top',
    size: 'large',
  },
  
  hooks: {
    async beforeCreate(data) {
      console.log('[ProductModule] Before create:', data);
      return {
        ...data,
        createdAt: new Date().toISOString(),
      };
    },
    async afterCreate(data, _response) {
      console.log('[ProductModule] Product created:', data.name);
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
    module: 'product',
    version: '1.0.0',
  },
});
