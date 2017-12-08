// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import LazyLoad from '../src/common/js/lazyloadImg.js'
import Api from '../src/common/js/api'
import './common/less/index.less'
import {phoneType} from '../src/common/js/phoneType.js'
FastClick.attach(document.body)
require('es6-promise').polyfill()

Vue.config.productionTip = false

let api = new Api()

Vue.prototype._$http = api

window.sessionStorage.setItem('phoneType', JSON.stringify(phoneType()))

Vue.use(LazyLoad)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
