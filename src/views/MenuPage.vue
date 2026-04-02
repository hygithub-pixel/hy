<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="mb-4">
          <template #header>
            <div class="flex justify-between items-center">
              <div>
                <div class="text-xl font-bold">{{ currentMenu?.title || '数据管理' }}</div>
                <div class="text-gray-500 text-sm mt-1">{{ currentMenu?.description || '管理和维护系统数据' }}</div>
              </div>
              <el-button type="primary" :icon="Plus" @click="handleAdd">
                新增数据
              </el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template v-if="currentMenu?.tableConfig">
            <TableComponent 
              :config="currentMenu.tableConfig"
              :data="table.tableData.value"
              :loading="table.loading.value"
              @edit="handleEdit"
              @delete="handleDelete"
              @page-change="handlePageChange"
            />
          </template>
          <template v-else>
            <el-empty description="暂无数据">
              <el-button type="primary" :icon="Plus" @click="handleAdd">
                开始添加
              </el-button>
            </el-empty>
          </template>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增数据' : '编辑数据'"
      width="600px"
      :close-on-click-modal="false"
    >
      <template v-if="currentMenu?.formConfig">
        <FormComponent 
          ref="formComponentRef"
          :config="currentMenu.formConfig"
          :initial-data="formData"
        />
      </template>
      <template #footer>
        <span class="flex justify-end gap-3">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleFormSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-alert
        title="确定要删除此数据吗？此操作无法撤销。"
        type="warning"
        :closable="false"
        show-icon
      />
      <template #footer>
        <span class="flex justify-end gap-3">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleDeleteConfirm">删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useMenuStore } from '../stores/menuStore';
import { useTableStore } from '../stores/tableStore';
import { useTable } from '../composables/useTable';
import FormComponent from '../components/form/FormComponent.vue';
import TableComponent from '../components/table/TableComponent.vue';

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();
const tableStore = useTableStore();

const currentMenu = ref();
const dialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const currentRow = ref();
const formComponentRef = ref<InstanceType<typeof FormComponent> | null>(null);
const formData = ref({});

const table = useTable({
  menuId: computed(() => currentMenu.value?.id || ''),
  autoLoad: false
});

const loadMenuData = async () => {
  try {
    await menuStore.initMenuConfig();
    
    // 根据当前路由路径查找菜单
    const currentPath = route.path;
    console.log('当前路由路径:', currentPath);
    
    // 查找菜单的函数
    const findMenuByPath = (menus: any[]): any => {
      for (const menu of menus) {
        if (menu.path === currentPath) {
          return menu;
        }
        if (menu.children) {
          const found = findMenuByPath(menu.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };
    
    // 从所有菜单中查找
    const allMenus = menuStore.getAllMenus;
    let menu = findMenuByPath(allMenus);
    
    // 如果没找到，尝试从子模块中查找
    if (!menu) {
      // 简单的路径映射
      const pathToMenuId: Record<string, string> = {
        '/users': 'user-1',
        '/roles': 'user-2',
        '/products': 'product-1',
        '/categories': 'product-2',
        '/inventory': 'product-3',
        '/orders': 'order-1',
        '/order-stats': 'order-2',
        '/refunds': 'order-3',
        '/articles': 'content-1',
        '/content-categories': 'content-2',
        '/ads': 'content-3',
        '/comments': 'content-4',
        '/revenue': 'finance-1',
        '/expenses': 'finance-2',
        '/finance-reports': 'finance-3'
      };
      
      const menuId = pathToMenuId[currentPath];
      if (menuId) {
        menu = menuStore.getMenuById(menuId);
      }
    }
    
    if (!menu) {
      ElMessage.error('菜单不存在');
      router.push('/dashboard');
      return;
    }
    
    console.log('找到菜单:', menu);
    console.log('菜单列配置:', menu.columns);
    currentMenu.value = menu;
    await table.fetchData();
    console.log('表格数据:', table.tableData);
  } catch (error) {
    console.error('加载菜单数据失败:', error);
    ElMessage.error('加载菜单数据失败');
  }
};

const handleAdd = () => {
  dialogType.value = 'add';
  formData.value = {};
  dialogVisible.value = true;
};

const handleEdit = (row: any) => {
  dialogType.value = 'edit';
  currentRow.value = row;
  formData.value = { ...row };
  dialogVisible.value = true;
};

const handleDelete = (row: any) => {
  currentRow.value = row;
  deleteDialogVisible.value = true;
};

const handleFormSubmit = async () => {
  if (!currentMenu.value || !formComponentRef.value) return;

  try {
    const isValid = await formComponentRef.value.validateForm();
    if (!isValid) return;

    if (dialogType.value === 'add') {
      await tableStore.executeApiOperation(
        currentMenu.value.id,
        currentMenu.value.api,
        async (apiConfig) => {
          const { dynamicApi } = await import('../api/dynamicApi');
          await dynamicApi.create(apiConfig, formComponentRef.value!.formData);
        },
        '添加成功',
        '添加失败'
      );
    } else if (dialogType.value === 'edit' && currentRow.value) {
      await tableStore.executeApiOperation(
        currentMenu.value.id,
        currentMenu.value.api,
        async (apiConfig) => {
          const { dynamicApi } = await import('../api/dynamicApi');
          await dynamicApi.update(apiConfig, currentRow.value!.id, formComponentRef.value!.formData);
        },
        '更新成功',
        '更新失败'
      );
    }

    await table.fetchData(undefined, true);
    dialogVisible.value = false;
  } catch (error) {
    console.error('提交失败:', error);
    ElMessage.error('操作失败，请重试');
  }
};

const handleDeleteConfirm = async () => {
  if (!currentMenu.value || !currentRow.value) return;

  try {
    await tableStore.executeApiOperation(
      currentMenu.value.id,
      currentMenu.value.api,
      async (apiConfig) => {
        const { dynamicApi } = await import('../api/dynamicApi');
        await dynamicApi.delete(apiConfig, currentRow.value!.id);
      },
      '删除成功',
      '删除失败'
    );

    await table.fetchData(undefined, true);
    deleteDialogVisible.value = false;
  } catch (error) {
    console.error('删除失败:', error);
    ElMessage.error('删除失败，请重试');
  }
};

const handlePageChange = (current: number, size: number) => {
  table.handlePageChange(current, size);
};

onMounted(() => {
  loadMenuData();
});
</script>

<style scoped>
.menu-page {
  padding: 20px;
}

.loading-container {
  min-height: 500px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.data-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .menu-page {
    padding: 10px;
  }

  .page-title {
    font-size: 20px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .pagination-container {
    justify-content: center;
  }
}
</style>
