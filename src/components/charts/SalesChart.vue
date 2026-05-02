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

const getCSSVariable = (name: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

const getChartColors = () => {
  const primary = getCSSVariable('--ant-primary-color');
  const textSecondary = getCSSVariable('--ant-text-color-secondary');
  const borderColor = getCSSVariable('--ant-border-color');
  return {
    primary,
    textSecondary,
    borderColor,
    primaryAlpha: primary + '80',
    primaryAlphaLight: primary + '1a',
  };
};

const initChart = async () => {
  if (!chartRef.value) return;

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
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: colors.textSecondary,
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
              color: colors.primaryAlpha,
            },
            {
              offset: 1,
              color: colors.primaryAlphaLight,
            },
          ]),
        },
        lineStyle: {
          color: colors.primary,
          width: 2,
        },
        itemStyle: {
          color: colors.primary,
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
  await initChart();

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
