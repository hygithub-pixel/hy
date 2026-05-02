import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import * as AntdIconsVue from '@ant-design/icons-vue';
import {
  theme,
  ConfigProvider,
} from 'ant-design-vue';
import router from './router';
import i18n, { initI18n } from './locales';
import App from './App.vue';
import './assets/styles/main.scss';
import '@wangeditor/editor/dist/css/style.css';
import 'virtual:uno.css';
import { setupMock } from './mock';
import { registerCommonShortcuts } from './utils/keyboardShortcuts';
import { useCacheStore } from './stores/cacheStore';
import { setupGlobalErrorHandler } from './utils/errorHandler';
import { performanceMonitor } from './utils/performance';
import { registerServices, provideServices } from './services';
import { componentManager } from './components/registry';
import { configManager } from './config/schema/config-manager';
import { moduleConfigs } from './config/modules';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.config.globalProperties.$appTitle = import.meta.env.VITE_APP_TITLE || 'Vue3 Admin';
document.title = import.meta.env.VITE_APP_TITLE || 'Vue3 Admin';

for (const [key, component] of Object.entries(AntdIconsVue)) {
  app.component(key, component);
}

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(Antd);

setupMock();

configManager.registerModules(moduleConfigs);
console.log('[Main] Config manager initialized with modules:', configManager.getAllModules().map(m => m.id));

registerServices();
provideServices(app);

const cacheStore = useCacheStore();
cacheStore.initCache();

registerCommonShortcuts();

setupGlobalErrorHandler();

if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logReport();
    }, 1000);
  });
}

initI18n().then(() => {
  app.mount('#app');
});
