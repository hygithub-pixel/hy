<template>
  <div>
    <div class="flex justify-end mb-4">
      <el-select v-model="timeRange" size="small" class="w-32">
        <el-option label="近7天" value="7" />
        <el-option label="近30天" value="30" />
        <el-option label="近90天" value="90" />
      </el-select>
    </div>
    <div ref="chartRef" class="w-full h-64 sm:h-72 lg:h-80"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { loadECharts } from '../../utils/lazyLoad';

const chartRef = ref<HTMLElement | null>(null);
const timeRange = ref('7');
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
          backgroundColor: '#6a7985',
        },
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: dates,
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '¥{value}',
        },
      },
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
              color: 'rgba(94, 106, 210, 0.5)',
            },
            {
              offset: 1,
              color: 'rgba(94, 106, 210, 0.1)',
            },
          ]),
        },
        lineStyle: {
          color: '#5e6ad2',
          width: 2,
        },
        itemStyle: {
          color: '#5e6ad2',
        },
        emphasis: {
          focus: 'series',
        },
        data: sales,
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

watch(timeRange, async () => {
  await initChart();
});

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
