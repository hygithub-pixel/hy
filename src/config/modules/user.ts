import { defineModuleConfig } from '../schema/types';

export default defineModuleConfig({
  id: 'user',
  path: '/users',
  title: '用户列表',
  icon: 'User',
  description: '管理系统用户账户',
  
  api: {
    list: '/api/users',
    create: '/api/users',
    update: '/api/users/:id',
    delete: '/api/users/:id',
    query: 'user-1-query',
  },
  
  table: {
    columns: [
      { type: 'index', prop: 'index', label: '序号' },
      { type: 'text', prop: 'username', label: '用户名' },
      { type: 'text', prop: 'role', label: '角色' },
      { type: 'image', prop: 'avatar', label: '头像' },
      { 
        type: 'switch', 
        prop: 'enabled', 
        label: '状态',
      },
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
    showSelection: false,
    showIndex: false,
    stripe: false,
    border: false,
  } as any,
  
  form: {
    items: [
      {
        type: 'text',
        label: '用户名',
        field: 'username',
        placeholder: '请输入用户名',
        rules: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
      },
      {
        type: 'text',
        label: '密码',
        field: 'password',
        placeholder: '请输入密码',
        rules: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      {
        type: 'select',
        label: '角色',
        field: 'role',
        placeholder: '请选择角色',
        options: [
          { label: '超级管理员', value: 'superadmin' },
          { label: '管理员', value: 'admin' },
          { label: '普通用户', value: 'user' },
        ],
        rules: [
          { required: true, message: '请选择角色', trigger: 'change' },
        ],
      },
      {
        type: 'upload',
        label: '头像',
        field: 'avatar',
        placeholder: '请上传头像',
      },
      {
        type: 'switch',
        label: '启用',
        field: 'enabled',
        value: true,
      },
    ],
    labelPosition: 'top',
    size: 'large',
  },
  
  hooks: {
    async beforeCreate(data) {
      console.log('[UserModule] Before create:', data);
      return data;
    },
    async afterCreate(data, _response) {
      console.log('[UserModule] After create:', data);
    },
    async beforeUpdate(data) {
      console.log('[UserModule] Before update:', data);
      return data;
    },
    async beforeDelete(id) {
      console.log('[UserModule] Before delete:', id);
      return true;
    },
  },
  
  permissions: {
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canExport: false,
    canImport: false,
    canView: true,
  },
  
  plugins: [
    { name: 'audit-log', enabled: true },
  ],
  
  meta: {
    module: 'user',
    version: '1.0.0',
  },
});
