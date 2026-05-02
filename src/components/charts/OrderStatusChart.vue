<template>
  <div>
    <div class="flex justify-end mb-4">
      <a-button type="link" @click="$emit('viewDetails')">查看详情</a-button>
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

const getCSSVariable = (name: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

const getChartColors = () => {
  return {
    primary: getCSSVariable('--ant-primary-color'),
    success: getCSSVariable('--ant-success-color'),
    warning: getCSSVariable('--ant-warning-color'),
    error: getCSSVariable('--ant-error-color'),
    bgContainer: getCSSVariable('--ant-bg-color-container'),
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

  const option = {
    animation: !prefersReducedMotion(),
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: colors.bgContainer,
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 35, name: '进行中', itemStyle: { color: colors.primary } },
          { value: 45, name: '已完成', itemStyle: { color: colors.success } },
          { value: 15, name: '待处理', itemStyle: { color: colors.warning } },
          { value: 5, name: '已取消', itemStyle: { color: colors.error } },
        ],
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
