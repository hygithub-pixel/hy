<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">用户管理</h2>
        <p class="text-sm text-gray-500 mt-1">对系统中用户进行管理，包括新增、编辑、删除、查看等操作。</p>
      </div>
    </div>

    <div class="p-6">
      <div class="flex items-center gap-4 mb-6">
        <a-input
          v-model:value="searchForm.username"
          placeholder="请输入用户名"
          class="w-64"
        >
          <template #prefix>
            <component :is="componentMap['SearchOutlined']" />
          </template>
        </a-input>

        <a-select
          v-model:value="searchForm.status"
          placeholder="请选择状态"
          class="w-40"
        >
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="1">启用</a-select-option>
          <a-select-option value="0">禁用</a-select-option>
        </a-select>

        <a-range-picker v-model:value="searchForm.dateRange" />

        <a-button type="primary" @click="handleSearch">
          查询
        </a-button>

        <a-button @click="handleReset">
          重置
        </a-button>

        <a-button type="text" class="text-blue-500 hover:text-blue-600 ml-auto">
          <component :is="componentMap['DownOutlined']" />
          展开
        </a-button>
      </div>

      <div class="flex items-center gap-3 mb-4">
        <a-button type="primary" @click="handleAdd">
          <component :is="componentMap['PlusOutlined']" />
          新增
        </a-button>

        <a-button disabled :disabled="selectedRows.length === 0">
          <component :is="componentMap['DeleteOutlined']" />
          批量删除
        </a-button>

        <a-button>
          <component :is="componentMap['ExportOutlined']" />
          导出
        </a-button>

        <div class="ml-auto flex items-center gap-2">
          <button class="p-2 hover:bg-gray-100 rounded transition-colors" aria-label="刷新">
            <component :is="componentMap['RefreshOutlined']" />
          </button>
          <button class="p-2 hover:bg-gray-100 rounded transition-colors" aria-label="设置">
            <component :is="componentMap['SettingOutlined']" />
          </button>
        </div>
      </div>

      <a-table
        :columns="columns"
        :data-source="userList"
        :pagination="pagination"
        :row-selection="{
          type: 'checkbox',
          selectedRowKeys: selectedRows,
          onChange: handleSelectChange
        }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'username'">
            <div class="flex items-center gap-2">
              <a-avatar size="small" :src="record.avatar">
                <template #icon><component :is="componentMap['UserOutlined']" /></template>
              </a-avatar>
              <span>{{ record.username }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'status'">
            <span :class="record.status === 1 ? 'text-green-500' : 'text-gray-400'" class="flex items-center gap-1">
              <component :is="record.status === 1 ? componentMap['CheckCircleOutlined'] : componentMap['CircleOutlined']" />
              {{ record.status === 1 ? '启用' : '禁用' }}
            </span>
          </template>
          <template v-else-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">{{ record.role }}</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="text" size="small" danger @click="handleDelete(record)">删除</a-button>
              <a-button type="text" size="small" @click="handleView(record)">查看</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import * as icons from '@ant-design/icons-vue';

const router = useRouter();
const componentMap: Record<string, any> = icons;

const searchForm = reactive({
  username: '',
  status: '',
  dateRange: []
});

const selectedRows = ref<number[]>([]);

const pagination = {
  current: 1,
  pageSize: 10,
  total: 6
};

const userList = ref([
  { id: 1, username: 'admin', nickname: '管理员', email: 'admin@example.com', department: '技术部', role: '超级管理员', status: 1, createTime: '2024-05-20 10:30:00', avatar: '' },
  { id: 2, username: 'zhangsan', nickname: '张三', email: 'zhangsan@example.com', department: '产品部', role: '产品经理', status: 1, createTime: '2024-05-19 09:15:00', avatar: '' },
  { id: 3, username: 'lisi', nickname: '李四', email: 'lisi@example.com', department: '设计部', role: '设计师', status: 1, createTime: '2024-05-18 14:22:00', avatar: '' },
  { id: 4, username: 'wangwu', nickname: '王五', email: 'wangwu@example.com', department: '运营部', role: '运营专员', status: 1, createTime: '2024-05-17 11:05:00', avatar: '' },
  { id: 5, username: 'zhaoliu', nickname: '赵六', email: 'zhaoliu@example.com', department: '技术部', role: '开发工程师', status: 0, createTime: '2024-05-16 16:40:00', avatar: '' },
  { id: 6, username: 'sunqi', nickname: '孙七', email: 'sunqi@example.com', department: '测试部', role: '测试工程师', status: 0, createTime: '2024-05-15 10:20:00', avatar: '' }
]);

const columns = [
  { title: '用户名', dataIndex: 'username', key: 'username', width: 150 },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 100 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
  { title: '部门', dataIndex: 'department', key: 'department', width: 100 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 150 }
];

const getRoleColor = (role: string) => {
  const colorMap: Record<string, string> = {
    '超级管理员': 'purple',
    '产品经理': 'cyan',
    '设计师': 'green',
    '运营专员': 'blue',
    '开发工程师': 'orange',
    '测试工程师': 'geekblue'
  };
  return colorMap[role] || 'default';
};

const handleSearch = () => {
  console.log('搜索:', searchForm);
};

const handleReset = () => {
  searchForm.username = '';
  searchForm.status = '';
  searchForm.dateRange = [];
};

const handleSelectChange = (keys: number[]) => {
  selectedRows.value = keys;
};

const handleAdd = () => {
  router.push('/users/add');
};

const handleEdit = (record: any) => {
  router.push(`/users/edit/${record.id}`);
};

const handleDelete = (record: any) => {
  console.log('删除:', record);
};

const handleView = (record: any) => {
  router.push(`/users/view/${record.id}`);
};
</script>