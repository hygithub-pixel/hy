import { ElLoading } from 'element-plus';
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading';

let loadingInstance: LoadingInstance | null = null;
let loadingCount = 0;

export const showLoading = (text = '加载中...') => {
  loadingCount++;
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }
};

export const hideLoading = () => {
  loadingCount--;
  if (loadingCount <= 0 && loadingInstance) {
    try {
      loadingInstance.close();
    } catch (error) {
      console.error('关闭 loading 失败:', error);
    }
    loadingInstance = null;
    loadingCount = 0;
  }
  // 确保 loadingCount 不会为负数
  if (loadingCount < 0) {
    loadingCount = 0;
  }
};
