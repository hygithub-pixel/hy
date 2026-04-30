import { ref, onMounted, onUnmounted, computed } from 'vue';
import { throttle } from '../utils/debounceThrottle';

/**
 * 响应式布局组合函数
 * @returns 响应式相关状态
 * @example
 * ```typescript
 * const { windowWidth, isMobile, isDesktop } = useResponsive();
 * 
 * if (isMobile.value) {
 *   console.log('当前是移动设备');
 * } else if (isDesktop.value) {
 *   console.log('当前是桌面设备');
 * }
 * ```
 */
export const useResponsive = () => {
  /** 窗口宽度 */
  const windowWidth = ref(window.innerWidth);
  /** 窗口高度 */
  const windowHeight = ref(window.innerHeight);

  /**
   * 处理窗口 resize 事件
   */
  const handleResize = throttle(() => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  }, 100);

  /** 是否为移动设备 (< 768px) */
  const isMobile = computed(() => windowWidth.value < 768);
  /** 是否为平板设备 (768px - 1023px) */
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024);
  /** 是否为桌面设备 (>= 1024px) */
  const isDesktop = computed(() => windowWidth.value >= 1024);
  /** 是否为大屏幕桌面设备 (>= 1280px) */
  const isLargeDesktop = computed(() => windowWidth.value >= 1280);
  /** 是否为超大屏幕桌面设备 (>= 1536px) */
  const isExtraLargeDesktop = computed(() => windowWidth.value >= 1536);

  /** 是否为超小屏幕 (< 480px) */
  const isExtraSmall = computed(() => windowWidth.value < 480);
  /** 是否为小屏幕 (< 640px) */
  const isSmall = computed(() => windowWidth.value < 640);
  /** 是否为中等屏幕 (640px - 1023px) */
  const isMedium = computed(() => windowWidth.value >= 640 && windowWidth.value < 1024);
  /** 是否为大屏幕 (1024px - 1279px) */
  const isLarge = computed(() => windowWidth.value >= 1024 && windowWidth.value < 1280);
  /** 是否为超大屏幕 (1280px - 1535px) */
  const isExtraLarge = computed(() => windowWidth.value >= 1280 && windowWidth.value < 1536);
  /** 是否为2倍超大屏幕 (>= 1536px) */
  const is2ExtraLarge = computed(() => windowWidth.value >= 1536);

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    /** 窗口宽度 */
    windowWidth,
    /** 窗口高度 */
    windowHeight,
    /** 是否为移动设备 (< 768px) */
    isMobile,
    /** 是否为平板设备 (768px - 1023px) */
    isTablet,
    /** 是否为桌面设备 (>= 1024px) */
    isDesktop,
    /** 是否为大屏幕桌面设备 (>= 1280px) */
    isLargeDesktop,
    /** 是否为超大屏幕桌面设备 (>= 1536px) */
    isExtraLargeDesktop,
    /** 是否为超小屏幕 (< 480px) */
    isExtraSmall,
    /** 是否为小屏幕 (< 640px) */
    isSmall,
    /** 是否为中等屏幕 (640px - 1023px) */
    isMedium,
    /** 是否为大屏幕 (1024px - 1279px) */
    isLarge,
    /** 是否为超大屏幕 (1280px - 1535px) */
    isExtraLarge,
    /** 是否为2倍超大屏幕 (>= 1536px) */
    is2ExtraLarge,
  };
};

export default useResponsive;
