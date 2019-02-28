import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 消除 click 移动浏览器300ms延迟
import attachFastClick from 'fastclick'
attachFastClick.attach(document.body)

// 图片懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  loading: require('@/assets/img/logo.png')
})

new Vue({
  render: h => h(App),
}).$mount('#app')
