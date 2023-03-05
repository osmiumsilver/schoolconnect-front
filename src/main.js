import Vue from 'vue'
import App from './App'
import store from './store'
import uView from 'uview-ui';
Vue.use(uView);
// import course from './pages/course/course.vue'
// Vue.component('course', course)

import home from './pages/home/home.vue'
Vue.component('home', home)

import my from './pages/my/my.vue'
Vue.component('my', my)

//引入组件ColorUI
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

Vue.prototype.$store = store

import {
    req,
	reqs,
    formatNumber,
} from "utils/util.js"
Vue.prototype.$req = req
Vue.prototype.$reqs = reqs
Vue.prototype.$formatNumber = formatNumber

Vue.config.productionTip = false

App.mpType = 'app'

function isPromise(obj) {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  }
  
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res;
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0]);
          } else {
            resolve(res[1]);
          }
        });
      });
    },
  });

const app = new Vue({
    store,
    ...App
})
app.$mount()



