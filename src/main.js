import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'babel-polyfill';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'material-design-icons/iconfont/material-icons.css';
import Toast from 'muse-ui-toast';
import Message from 'muse-ui-message';
import Loading from 'muse-ui-loading';
import store from './store/index';

import './global.less';
import 'lib-flexible';
import imgprive from './utils/ImagePeive';
// 滑屏组件
// import Vconsole from 'vconsole';

import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
// // 调试
// const vConsole = new Vconsole();
// Vue.use(vConsole);
Vue.use(VueAwesomeSwiper);
// 图片预览
Vue.use(imgprive);
Vue.use(MuseUI); // 引入全局muse-ui
Vue.use(Toast, {
  position: 'bottom', // 弹出的位置
  time: 2000, // 显示的时长
  closeIcon: 'close', // 关闭的图标
  close: true, // 是否显示关闭按钮
  successIcon: 'check_circle', // 成功信息图标
  infoIcon: 'info', // 信息信息图标
  warningIcon: 'priority_high', // 提醒信息图标
  errorIcon: 'warning' // 错误信息图标
});
// 消息提示组件
Vue.use(Message);
// loading
Vue.use(Loading, {
  overlayColor: 'hsla(0, 0%, 0%, 0.3)', // 背景色
  size: 24,
  color: '#FF7600' // 文字颜色
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
