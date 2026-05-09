import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import './style.css';
import App from './App.vue';
import { setupRouter } from './router';

const app = createApp(App);
app.use(Antd);

setupRouter().then(router => {
  app.use(router);
  app.mount('#app');
});
