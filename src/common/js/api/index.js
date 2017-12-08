import axios from 'axios'
import config from './config'
import store from '../../../store/index.js'

import Vue from 'vue'
import { ToastPlugin, LoadingPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

// 失败后提示
function toast (error) {
  Vue.$vux.toast.show({
    text: '无法连接到服务器<br />' + error,
    type: 'warn',
    position: 'middle',
    width: '20em'
  })
}
// function closeLoading () {
//   // let Timer = setTimeout(() => {
//     // Vue.$vux.loading.hide()
//     // clearTimeout(Timer)
//   // }, 10)
//   Vue.$vux.loading.hide()
// }
class API {
  // 获取已授权列表
  get (url, success, errFun) {
    // loading
    // Vue.$vux.loading.show({
    //   text: 'Loading'
    // })
    axios.get(url).then(res => {
      // closeLoading()
      // 请求状态不为200
      if (res.status !== 200) {
        toast(res.status)
        return
      }
      if (res.data.code !== '0000') {
        toast(res.data.msg)
        return
      }
      let data = res.data
      // 成功回掉
      success(data)
    }).catch(error => {
      // 失败提示 和 回掉
      // closeLoading()
      toast(error)
      errFun(error)
    })
  }
  // 添加授权
  post (path, param, success, errFun) {
    // loading
    // Vue.$vux.loading.show({
    //   text: 'Loading'
    // })
    store.dispatch('slidingFlagchange', true)
    axios.post(path, param, config).then(res => {
      // closeLoading()
      store.dispatch('slidingFlagchange', false)
      // 请求状态不为200
      if (res.status !== 200) {
        toast(res.status)
        return
      }
      if (res.data.code !== '0000') {
        toast(res.data.msg)
        // return
      }
      let data = res.data
      // 成功回掉
      success(data)
    }).catch(error => {
      // 失败提示 和 回掉
      // closeLoading()
      store.dispatch('slidingFlagchange', false)
      toast(error)
      errFun(error)
    })
  }
}
export default API
