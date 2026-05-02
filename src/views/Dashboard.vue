<template>
  <div class="p-6">
    <a-row :gutter="20" class="mb-6">
      <a-col :span="24">
        <div class="mb-5">
          <h1 class="m-0 mb-2 text-[28px] font-semibold">仪表盘</h1>
          <p class="m-0 text-base text-gray-500 dark:text-gray-400">系统运行状态概览</p>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="20" class="mb-6">
      <a-col :xs="24" :sm="12" :md="6" v-for="(metric, index) in metrics" :key="index">
        <a-card hoverable>
          <div class="flex items-center">
            <div class="flex items-center justify-center w-12 h-12 rounded-lg mr-4" style="background-color: var(--ant-primary-color-outline)">
              <component :is="metric.icon" style="color: var(--ant-primary-color); font-size: 24px" />
            </div>
            <div class="flex-1">
              <p class="text-sm mb-1 text-gray-500 dark:text-gray-400">{{ metric.title }}</p>
              <p class="text-2xl font-bold m-0">
                <span v-if="metric.prefix">{{ metric.prefix }}</span>
                {{ metric.value }}
                <span v-if="metric.suffix">{{ metric.suffix }}</span>
              </p>
              <p v-if="metric.trend" class="text-sm mt-1" :style="{ color: metric.trend > 0 ? 'var(--ant-success-color)' : 'var(--ant-error-color)' }">
                <component :is="metric.trend > 0 ? CaretUpOutlined : CaretDownOutlined" />
                {{ Math.abs(metric.trend) }}%
              </p>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="20" class="mb-6">
      <a-col :xs="24" :md="12">
        <a-card hoverable>
          <template #title>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">销售额趋势</span>
              <a-select v-model:value="timeRange" size="small" style="width: 120px">
                <a-select-option value="7">近7天</a-select-option>
                <a-select-option value="30">近30天</a-select-option>
                <a-select-option value="90">近90天</a-select-option>
              </a-select>
            </div>
          </template>
          <div ref="salesChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-card hoverable>
          <template #title>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">订单状态分布</span>
              <a-button type="link" class="p-0">查看详情</a-button>
            </div>
          </template>
          <div ref="orderStatusChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="20" class="mb-6">
      <a-col :span="24">
        <a-card hoverable>
          <template #title>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">用户增长趋势</span>
              <a-button type="link" class="p-0">查看详情</a-button>
            </div>
          </template>
          <div ref="userGrowthChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="20">
      <a-col :span="24">
        <a-card hoverable>
          <template #title>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">最近订单</span>
              <a-button type="link" class="p-0">查看全部</a-button>
            </div>
          </template>
          <a-table :dataSource="orders" class="w-full" :pagination="false">
            <a-table-column key="id" title="订单号" dataIndex="id" width="180" />
            <a-table-column key="customer" title="客户" dataIndex="customer" width="180" />
            <a-table-column key="status" title="状态" dataIndex="status" width="120">
              <template #default="{ record }">
                <a-tag :color="getTagColor(record.status)">{{ record.status }}</a-tag>
              </template>
            </a-table-column>
            <a-table-column key="amount" title="金额" dataIndex="amount" align="right">
              <template #default="{ record }">
                <span class="font-semibold numeric">¥{{ record.amount.toFixed(2) }}</span>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, ShoppingOutlined, ShoppingCartOutlined, DollarOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue';
import { loadECharts } from '../utils/lazyLoad';
import { useThemeStore } from '../stores/themeStore';

let echarts: any = null;
const themeStore = useThemeStore();

const salesChartRef = ref<HTMLElement | null>(null);
const orderStatusChartRef = ref<HTMLElement | null>(null);
const userGrowthChartRef = ref<HTMLElement | null>(null);
const timeRange = ref('7');

let salesChart: any = null;
let orderStatusChart: any = null;
let userGrowthChart: any = null;

const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const getCSSVariable = (name: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

const metrics = [
  { title: '总用户数', value: 2345, icon: UserOutlined, trend: 12 },
  { title: '总商品数', value: 1280, icon: ShoppingOutlined, trend: 8 },
  { title: '总订单数', value: 5678, icon: ShoppingCartOutlined, trend: 15 },
  { title: '总收入', value: 128900, prefix: '¥', icon: DollarOutlined, trend: 20 }
];

const orders = [
  { id: '#ORD-1001', customer: '客户 1', status: '进行中', amount: Math.random() * 1000 },
  { id: '#ORD-1002', customer: '客户 2', status: '已完成', amount: Math.random() * 1000 },
  { id: '#ORD-1003', customer: '客户 3', status: '待处理', amount: Math.random() * 1000 },
  { id: '#ORD-1004', customer: '客户 4', status: '已取消', amount: Math.random() * 1000 },
  { id: '#ORD-1005', customer: '客户 5', status: '进行中', amount: Math.random() * 1000 }
];

const getTagColor = (status: string) => {
  const colorMap: Record<string, string> = {
    '进行中': 'blue',
    '已完成': 'green',
    '待处理': 'orange',
    '已取消': 'red'
  };
  return colorMap[status] || 'default';
};

const getChartColors = () => {
  return {
    primary: getCSSVariable('--ant-primary-color'),
    success: getCSSVariable('--ant-success-color'),
    warning: getCSSVariable('--ant-warning-color'),
    error: getCSSVariable('--ant-error-color')
  };
};

const initSalesChart = async () => {
  if (!salesChartRef.value) return;

  if (!echarts) {
    echarts = await loadECharts();
  }

  if (salesChart) {
    salesChart.dispose();
  }
  salesChart = echarts.init(salesChartRef.value);

  const colors = getChartColors();
  const days = parseInt(timeRange.value);
  const dates = [];
  const sales = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
    sales.push(Math.floor(Math.random() * 5000) + 5000);
  }

  const option = {
    animation: !prefersReducedMotion(),
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: dates
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '¥{value}'
        }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors.primary + '80' },
            { offset: 1, color: colors.primary + '1a' }
          ])
        },
        emphasis: { focus: 'series' },
        itemStyle: { color: colors.primary },
        data: sales
      }
    ]
  };

  if (salesChart) {
    salesChart.setOption(option);
  }
};

const initOrderStatusChart = async () => {
  if (!orderStatusChartRef.value) return;

  if (!echarts) {
    echarts = await loadECharts();
  }

  if (orderStatusChart) {
    orderStatusChart.dispose();
  }
  orderStatusChart = echarts.init(orderStatusChartRef.value);

  const colors = getChartColors();

  const option = {
    animation: !prefersReducedMotion(),
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 20, fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data: [
          { value: 35, name: '进行中', itemStyle: { color: colors.primary } },
          { value: 45, name: '已完成', itemStyle: { color: colors.success } },
          { value: 15, name: '待处理', itemStyle: { color: colors.warning } },
          { value: 5, name: '已取消', itemStyle: { color: colors.error } }
        ]
      }
    ]
  };

  if (orderStatusChart) {
    orderStatusChart.setOption(option);
  }
};

const initUserGrowthChart = async () => {
  if (!userGrowthChartRef.value) return;

  if (!echarts) {
    echarts = await loadECharts();
  }

  if (userGrowthChart) {
    userGrowthChart.dispose();
  }
  userGrowthChart = echarts.init(userGrowthChartRef.value);

  const colors = getChartColors();
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const newUsers = [120, 190, 300, 450, 620, 880];
  const activeUsers = [200, 350, 500, 700, 900, 1200];

  const option = {
    animation: !prefersReducedMotion(),
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['新用户', '活跃用户']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新用户',
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        data: newUsers,
        itemStyle: { color: colors.primary }
      },
      {
        name: '活跃用户',
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        data: activeUsers,
        itemStyle: { color: colors.success }
      }
    ]
  };

  if (userGrowthChart) {
    userGrowthChart.setOption(option);
  }
};

const handleResize = () => {
  salesChart?.resize();
  orderStatusChart?.resize();
  userGrowthChart?.resize();
};

const updateChartTheme = () => {
  initSalesChart();
  initOrderStatusChart();
  initUserGrowthChart();
};

watch(timeRange, async () => {
  await initSalesChart();
});

watch(() => themeStore.isDark, () => {
  updateChartTheme();
});

onMounted(async () => {
  await Promise.all([
    initSalesChart(),
    initOrderStatusChart(),
    initUserGrowthChart()
  ]);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  salesChart?.dispose();
  orderStatusChart?.dispose();
  userGrowthChart?.dispose();
  salesChart = null;
  orderStatusChart = null;
  userGrowthChart = null;
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}

.numeric {
  font-variant-numeric: tabular-nums;
}
</style>
