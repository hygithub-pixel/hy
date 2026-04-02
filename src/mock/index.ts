import { setupMenuMock } from './menu';

export const setupMock = () => {
  const enableMock = import.meta.env.VITE_ENABLE_MOCK === 'true' || import.meta.env.DEV;
  if (enableMock) {
    setupMenuMock();
    console.log('[Mock] Mock 服务已启动');
  }
};

export { setupMenuMock } from './menu';
