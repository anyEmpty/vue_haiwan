<template>
  <div class="timerDown" v-show="showFlag">
    请在{{time.fen}}分{{time.miao}}秒内完成支付,否则系统将自动取消本次交易
  </div>
</template>

<script>
const SET_TIME_LONG = 600000
export default {
  name: 'timerDown',
  methods: {
    // 计算时分秒
    _countTime (longTime) {
      let longTimer = longTime
      let obj = {
        'fen': 0,
        'miao': 0
      }
      obj.fen = Math.floor(longTimer / 60000)
      obj.miao = Math.floor((longTimer % 60000) / 1000)
      return obj
    },
    // 倒计时函数
    _timeDown (startTime) {
      if (!startTime) return
      let startTimer = startTime.replace(/-/g, '/')
      startTimer = (new Date(startTimer).getTime()) + SET_TIME_LONG
      let endTimer = Date.now()
      let long = Number(startTimer) - Number(endTimer)
      let timer = setInterval(() => {
        if (long > 0) {
          let obj = this._countTime(long)
          this.$nextTick(() => {
            this.time.fen = obj.fen
            this.time.miao = obj.miao
          })
          long = long - 1000
        } else {
          clearInterval(timer)
          this.showFlag = false
          // orderlist 组建倒计时结束后需要删除该数据
          if (this.dataList) {
            this.dataList.splice(this.index, 1)
          } else {
            // 订单详情页面需要重新加载
            this.reload()
          }
        }
      }, 1000)
    }
  },
  props: {
    // 下单时间
    startPropsTimer: {
      type: String,
      default: ''
    },
    // orderlist 组建倒计时结束后需要删除该数据  列表数据
    dataList: {
      type: Array
    },
    // orderlist 组建倒计时结束后需要删除该数据  列表数据index
    index: {
      type: Number
    },
    // 订单详情页面需要重新加载
    reload: {
      type: Function,
      default () {
        return () => {
        }
      }
    }
  },
  data () {
    return {
      time: {
        fen: 0,
        miao: 0
      },
      showFlag: true
    }
  },
  created () {
    this._timeDown(this.startPropsTimer)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.timerDown{
}
</style>
