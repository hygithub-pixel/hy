import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/styles/element-plus-theme.scss';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
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
import { performanceMonitor } from './utils/performanceMonitor';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.config.globalProperties.$appTitle = import.meta.env.VITE_APP_TITLE || 'Vue3 Admin';
document.title = import.meta.env.VITE_APP_TITLE || 'Vue3 Admin';

app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(pinia);
app.use(router);
app.use(i18n);

setupMock();

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
