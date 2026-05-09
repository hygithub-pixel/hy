<template>
  <div class="h-screen bg-[#0a1628] text-white flex flex-col w-64">
    <div class="h-16 flex items-center px-4 border-b border-[#1e2f4a]">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded bg-gradient-to-br from-[#1890ff] to-[#096dd9] flex items-center justify-center">
          <AntDesignOutlined class="text-white text-xl" />
        </div>
        <span class="text-lg font-bold">Ant Design Vue</span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-4">
      <a-menu
        mode="inline"
        :selected-keys="[activeMenu]"
        :open-keys="openKeys"
        class="bg-transparent border-none"
        :style="{ color: '#bfcbd9' }"
      >
        <a-menu-item key="/dashboard">
          <template #icon>
            <HomeOutlined />
          </template>
          <span>首页</span>
        </a-menu-item>

        <a-menu-item key="/dashboard">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>仪表盘</span>
        </a-menu-item>

        <a-sub-menu key="system">
          <template #icon>
            <SettingOutlined />
          </template>
          <template #title>系统管理</template>
          <a-menu-item key="/users">
            <router-link to="/users">用户管理</router-link>
          </a-menu-item>
          <a-menu-item key="/roles">
            <router-link to="/roles">角色管理</router-link>
          </a-menu-item>
          <a-menu-item key="/departments">
            <router-link to="/departments">部门管理</router-link>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="business">
          <template #icon>
            <ShoppingCartOutlined />
          </template>
          <template #title>业务管理</template>
          <a-menu-item key="/products">
            <router-link to="/products">商品管理</router-link>
          </a-menu-item>
          <a-menu-item key="/orders">
            <router-link to="/orders">订单管理</router-link>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="data">
          <template #icon>
            <BarChartOutlined />
          </template>
          <template #title>数据管理</template>
        </a-sub-menu>

        <a-sub-menu key="monitor">
          <template #icon>
            <ClockCircleOutlined />
          </template>
          <template #title>系统监控</template>
        </a-sub-menu>

        <a-menu-item key="/settings">
          <template #icon>
            <ToolOutlined />
          </template>
          <span>设置</span>
        </a-menu-item>
      </a-menu>
    </div>

    <div class="h-12 flex items-center justify-around border-t border-[#1e2f4a]">
      <button class="p-2 hover:bg-[#1e2f4a] rounded transition-colors" aria-label="菜单">
        <MenuOutlined />
      </button>
      <button class="p-2 hover:bg-[#1e2f4a] rounded transition-colors" aria-label="通知">
        <BellOutlined />
      </button>
      <button class="p-2 hover:bg-[#1e2f4a] rounded transition-colors" aria-label="全屏">
        <FullscreenOutlined />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  AntDesignOutlined,
  HomeOutlined,
  DashboardOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  ToolOutlined,
  MenuOutlined,
  BellOutlined,
  FullscreenOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue';

const route = useRoute();
const openKeys = ref(['system']);

const activeMenu = computed(() => route.path);
</script>

<style lang="scss" scoped>
:deep(.ant-menu-inline .ant-menu-item) {
  margin: 0 !important;
  height: 42px !important;
  line-height: 42px !important;
}

:deep(.ant-menu-item) {
  color: #bfcbd9;
  border-right: 3px solid transparent;
  
  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }
  
  &.ant-menu-item-selected {
    color: #1890ff;
    background: rgba(24, 144, 255, 0.1);
    border-right-color: #1890ff;
  }
}

:deep(.ant-menu-submenu-title) {
  color: #bfcbd9 !important;
  height: 42px !important;
  line-height: 42px !important;
  
  &:hover {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.08) !important;
  }
}

:deep(.ant-menu-submenu-arrow) {
  color: #bfcbd9;
}

:deep(.ant-menu-sub) {
  background: #0a1628 !important;
}

:deep(.ant-menu-item-icon) {
  font-size: 16px;
}
</style>
