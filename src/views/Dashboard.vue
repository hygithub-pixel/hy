<template>
  <div>
    <el-row :gutter="20" class="mb-6">
      <el-col :span="24">
        <div class="mb-5">
          <h1 class="m-0 mb-2 text-[28px] font-semibold text-gray-800">仪表盘</h1>
          <p class="m-0 text-gray-500 text-base">系统运行状态概览</p>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mb-6">
      <el-col :xs="24" :sm="12" :md="6" v-for="(metric, index) in metrics" :key="index">
        <el-card shadow="hover" class="stat-card">
          <el-statistic
            :title="metric.title"
            :value="metric.value"
            :prefix="metric.prefix"
            :suffix="metric.suffix"
            class="numeric"
          >
            <template #prefix>
              <el-icon :color="metric.iconColor" class="mr-2">
                <component :is="metric.icon" />
              </el-icon>
            </template>
            <template #suffix>
              <span v-if="metric.trend" :class="[metric.trend > 0 ? 'text-green-500' : 'text-red-500', 'ml-2', 'text-sm']">
                <el-icon v-if="metric.trend > 0"><Top /></el-icon>
                <el-icon v-else><Bottom /></el-icon>
                {{ Math.abs(metric.trend) }}%
              </span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mb-6">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">销售额趋势</span>
              <el-select v-model="timeRange" size="small" class="w-32">
                <el-option label="近7天" value="7" />
                <el-option label="近30天" value="30" />
                <el-option label="近90天" value="90" />
              </el-select>
            </div>
          </template>
          <div ref="salesChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">订单状态分布</span>
              <el-button type="primary" text>查看详情</el-button>
            </div>
          </template>
          <div ref="orderStatusChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mb-6">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">用户增长趋势</span>
              <el-button type="primary" text>查看详情</el-button>
            </div>
          </template>
          <div ref="userGrowthChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">最近订单</span>
              <el-button type="primary" text>查看全部</el-button>
            </div>
          </template>
          <el-table :data="orders" class="w-full">
            <el-table-column prop="id" label="订单号" width="180" />
            <el-table-column prop="customer" label="客户" width="180" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getTagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" align="right">
              <template #default="{ row }">
                <span class="font-semibold numeric">¥{{ row.amount.toFixed(2) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Goods, ShoppingCart, Money, Top, Bottom } from '@element-plus/icons-vue';
import { loadECharts } from '../utils/lazyLoad';

let echarts: any = null;

const salesChartRef = ref<HTMLElement | null>(null);
const orderStatusChartRef = ref<HTMLElement | null>(null);
const userGrowthChartRef = ref<HTMLElement | null>(null);
const timeRange = ref('7');

let salesChart: echarts.ECharts | null = null;
let orderStatusChart: echarts.ECharts | null = null;
let userGrowthChart: echarts.ECharts | null = null;

// 检测用户的动画偏好
const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const metrics = [
  {
    title: '总用户数',
    value: 2345,
    prefix: '',
    suffix: '',
    icon: User,
    iconColor: '#3b82f6',
    trend: 12
  },
  {
    title: '总商品数',
    value: 1280,
    prefix: '',
    suffix: '',
    icon: Goods,
    iconColor: '#10b981',
    trend: 8
  },
  {
    title: '总订单数',
    value: 5678,
    prefix: '',
    suffix: '',
    icon: ShoppingCart,
    iconColor: '#f59e0b',
    trend: 15
  },
  {
    title: '总收入',
    value: 128900,
    prefix: '¥',
    suffix: '',
    icon: Money,
    iconColor: '#ef4444',
    trend: 20
  }
];

const orders = [
  { id: '#ORD-1001', customer: '客户 1', status: '进行中', amount: Math.random() * 1000 },
  { id: '#ORD-1002', customer: '客户 2', status: '已完成', amount: Math.random() * 1000 },
  { id: '#ORD-1003', customer: '客户 3', status: '待处理', amount: Math.random() * 1000 },
  { id: '#ORD-1004', customer: '客户 4', status: '已取消', amount: Math.random() * 1000 },
  { id: '#ORD-1005', customer: '客户 5', status: '进行中', amount: Math.random() * 1000 }
];

const getTagType = (status: string) => {
  const typeMap: Record<string, any> = {
    '进行中': 'primary',
    '已完成': 'success',
    '待处理': 'warning',
    '已取消': 'danger'
  };
  return typeMap[status] || '';
};

const initSalesChart = async () => {
  if (!salesChartRef.value) return;
  
  if (!echarts) {
    echarts = await loadECharts();
  }
  
  salesChart = echarts.init(salesChartRef.value);
  
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
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
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
            {
              offset: 0,
              color: 'rgba(59, 130, 246, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(59, 130, 246, 0.1)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
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
  
  orderStatusChart = echarts.init(orderStatusChartRef.value);
  
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
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 35, name: '进行中', itemStyle: { color: '#3b82f6' } },
          { value: 45, name: '已完成', itemStyle: { color: '#10b981' } },
          { value: 15, name: '待处理', itemStyle: { color: '#f59e0b' } },
          { value: 5, name: '已取消', itemStyle: { color: '#ef4444' } }
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
  
  userGrowthChart = echarts.init(userGrowthChartRef.value);
  
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const newUsers = [120, 190, 300, 450, 620, 880];
  const activeUsers = [200, 350, 500, 700, 900, 1200];
  
  const option = {
    animation: !prefersReducedMotion(),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
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
        emphasis: {
          focus: 'series'
        },
        data: newUsers,
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: '活跃用户',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: activeUsers,
        itemStyle: {
          color: '#10b981'
        }
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

watch(timeRange, async () => {
  await initSalesChart();
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

/* 数字对齐 */
.numeric {
  font-variant-numeric: tabular-nums;
}
</style>
