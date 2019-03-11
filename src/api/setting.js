//发送拦截请求
import Vue from "vue";
import axios from "axios";

//创建axios实例
export const instance = axios.create({
  baseURL: "http://localhost:3000", //基础请求地址
  timeout: 10 * 1000, //超时时间
  withCredentials: true,
});

//添加请求拦截器
instance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//添加响应拦截器
// instance.interceptors.response.use(
//   response => {
//     return Promise.resolve(response);
//   },
//   error => {
//     //输出错误信息
//     return Promise.reject(error);
//   }
// );

Plugin.install = function(Vue) {
  Vue.axios = instance;
  window.axios = instance;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return instance;
      }
    },
    //vm.$axios
    $axios: {
      get() {
        return instance;
      }
    }
  });
};
Vue.use(Plugin);

export default Plugin;
