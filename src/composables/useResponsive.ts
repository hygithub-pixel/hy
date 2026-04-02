import { ref, onMounted, onUnmounted, computed } from 'vue';

export const useResponsive = () => {
  const windowWidth = ref(window.innerWidth);
  const windowHeight = ref(window.innerHeight);

  const handleResize = () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  };

  const isMobile = computed(() => windowWidth.value < 768);
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024);
  const isDesktop = computed(() => windowWidth.value >= 1024);
  const isLargeDesktop = computed(() => windowWidth.value >= 1280);
  const isExtraLargeDesktop = computed(() => windowWidth.value >= 1536);

  const isExtraSmall = computed(() => windowWidth.value < 480);
  const isSmall = computed(() => windowWidth.value < 640);
  const isMedium = computed(() => windowWidth.value >= 640 && windowWidth.value < 1024);
  const isLarge = computed(() => windowWidth.value >= 1024 && windowWidth.value < 1280);
  const isExtraLarge = computed(() => windowWidth.value >= 1280 && windowWidth.value < 1536);
  const is2ExtraLarge = computed(() => windowWidth.value >= 1536);

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    windowWidth,
    windowHeight,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isExtraLargeDesktop,
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    is2ExtraLarge
  };
};

export default useResponsive;
