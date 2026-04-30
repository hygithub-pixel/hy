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
          borderColor: '#fff',
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
          { value: 35, name: '进行中', itemStyle: { color: '#5e6ad2' } },
          { value: 45, name: '已完成', itemStyle: { color: '#10b981' } },
          { value: 15, name: '待处理', itemStyle: { color: '#f59e0b' } },
          { value: 5, name: '已取消', itemStyle: { color: '#ef4444' } },
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
