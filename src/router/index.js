import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store/index.js'

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'ReserveMine',
      component (resolve) {
        require(['../containers/reserveMine'], resolve)
      }
    },
    {
      path: '/reserveList',
      name: 'ReserveList',
      component (resolve) {
        require(['../containers/reserveList'], resolve)
      },
      meta: { keepAlive: true }
    },
    {
      path: '/reserveDetail',
      name: 'ReserveDetail',
      component (resolve) {
        require(['../containers/reserveDetails'], resolve)
      }
    },
    {
      path: '/sign',
      name: 'Sign',
      component (resolve) {
        require(['../containers/sign'], resolve)
      }
    },
    {
      path: '/orderList',
      name: 'OrderList',
      component (resolve) {
        require(['../containers/orderList'], resolve)
      }
    },
    {
      path: '/orderDetails',
      name: 'OrderDetails',
      component (resolve) {
        require(['../containers/orderDetails'], resolve)
      }
    },
    {
      path: '/addPerson',
      name: 'AddPerson',
      component (resolve) {
        require(['../containers/addPerson'], resolve)
      }
    },
    {
      path: '/confirmPerson',
      name: 'ConfirmPerson',
      component (resolve) {
        require(['../containers/confirmPerson'], resolve)
      }
    },
    {
      path: '/pay',
      name: 'Pay',
      component (resolve) {
        require(['../containers/pay'], resolve)
      }
    },
    {
      path: '/test',
      name: 'Test',
      component (resolve) {
        require(['../containers/test'], resolve)
      }
    },
    {
      path: '*',
      name: 'ReserveMine',
      component (resolve) {
        require(['../containers/reserveMine'], resolve)
      }
    }
  ]
})

const sessionHistory = window.sessionStorage
// sessionHistory.clear()
// 历史记录
let fromPath = []
sessionHistory.setItem('fromPath', JSON.stringify(fromPath))

router.beforeEach(function (to, from, next) {
  // debugger
  // store.dispatch('slidingFlagchange', true)
  let sessionFromPath = JSON.parse(sessionHistory.getItem('fromPath'))
  // 获取历史站的-1的历史记录
  let sessionFromPathPre = sessionFromPath[sessionFromPath.length - 2]
  // 要去的历史记录
  let toPath = to.path
  // 如果相等
  if (toPath === sessionFromPathPre) {
    // 后退
    VueRouter.prototype.isBack = true
    // 历史站最新记录删除  同时不记录新的历史
    sessionFromPath.pop()
  } else {
    // 前进
    VueRouter.prototype.isBack = false
    // 记录新的历史
    sessionFromPath.push(toPath)
  }
  // 存储在session里面
  sessionHistory.setItem('fromPath', JSON.stringify(sessionFromPath))
  // 跳转链接
  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})

router.afterEach((to) => {
  const timer = setTimeout(() => {
    // store.dispatch('slidingFlagchange', false)
    clearTimeout(timer)
  }, 500)
})

export default router
