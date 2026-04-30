<template>
  <div>
    <div class="flex justify-end mb-4">
      <el-button type="primary" text @click="$emit('viewDetails')">查看详情</el-button>
    </div>
    <div ref="chartRef" class="w-full h-72"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { loadECharts } from '../../utils/lazyLoad';

const emit = defineEmits(['viewDetails']);
const chartRef = ref<HTMLElement | null>(null);
let echarts: any = null;
let chart: any = null;

const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const initChart = async () => {
  if (!chartRef.value) return;

  // 确保DOM元素有实际大小
  if (chartRef.value.clientWidth === 0 || chartRef.value.clientHeight === 0) {
    return;
  }

  if (!echarts) {
    echarts = await loadECharts();
  }

  if (chart) {
    chart.dispose();
  }

  chart = echarts.init(chartRef.value);

  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const newUsers = [120, 190, 300, 450, 620, 880];
  const activeUsers = [200, 350, 500, 700, 900, 1200];

  const option = {
    animation: !prefersReducedMotion(),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['新用户', '活跃用户'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: months,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '新用户',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        data: newUsers,
        itemStyle: {
          color: '#5e6ad2',
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: '活跃用户',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        data: activeUsers,
        itemStyle: {
          color: '#10b981',
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  if (chart) {
    chart.setOption(option);
  }
};

const handleResize = () => {
  chart?.resize();
};

onMounted(async () => {
  // 尝试初始化图表
  await initChart();

  // 如果图表未初始化（元素尺寸为0），使用ResizeObserver监听尺寸变化
  if (!chart && chartRef.value) {
    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.value && (chartRef.value.clientWidth > 0 || chartRef.value.clientHeight > 0)) {
        initChart();
        resizeObserver.disconnect();
      }
    });
    resizeObserver.observe(chartRef.value);
  }

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chart?.dispose();
  chart = null;
});
</script>
