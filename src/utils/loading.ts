import { Spin } from 'ant-design-vue';

let loadingInstance: any = null;
let loadingCount = 0;

export const showLoading = () => {
  loadingCount++;
  if (!loadingInstance) {
    loadingInstance = Spin.setDefaultIndicator({
      indicator: () => {
        return 'loading...';
      },
    });
  }
};

export const hideLoading = () => {
  loadingCount--;
  if (loadingCount <= 0) {
    loadingInstance = null;
    loadingCount = 0;
  }
  if (loadingCount < 0) {
    loadingCount = 0;
  }
};
