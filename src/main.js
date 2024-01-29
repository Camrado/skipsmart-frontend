import './assets/styles/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Vue3TouchEvents from 'vue3-touch-events';

// vue-toastification options
const optionsToast = {
  position: 'top-left',
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false //right to left
};

// vue3-touch-events options
const optionsTouch = {
  swipeTolerance: 50 // px
};

createApp(App).use(store).use(ElementPlus).use(Toast, optionsToast).use(router).use(Vue3TouchEvents, optionsTouch).mount('#app');
