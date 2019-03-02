import Vue from 'vue'
import App from './App.vue'
import router from '@/router';
Vue.config.productionTip = false

// 消除 click 移动浏览器300ms延迟
import attachFastClick from 'fastclick'
attachFastClick.attach(document.body);

import '@/assets/scss/base.scss';
import '@/assets/scss/reset.scss';

// 图片懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  loading: require('@/assets/img/logo.png')
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
