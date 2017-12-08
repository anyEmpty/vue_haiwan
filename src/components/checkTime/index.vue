<template>
  <div class="checkTime clearfix">
    <alert v-model="alertShow" title="提示" :content="alertContent"></alert>
    <span class="startTime">
      {{startTimeShow}}
      <group class="dataPick startTimeContainer">
        <calendar title="" v-model="startValueAct" @on-change="_startTimeChange" :render-on-value-change='false' :replace-text-list="{'TODAY':'今'}" :disable-past="true"></calendar>
      </group>
    </span>
    <span class="checkAllTime">共{{manyDayVal}}晚</span>
    <span class="endTime">
      {{endTimeShow}}
      <group class="dataPick endTimeContainer">
        <calendar title="" v-model="endValueAct" @on-change="_endTimeChange" :render-on-value-change='false' :replace-text-list="{'TODAY':'今'}" :disable-past="true"></calendar>
      </group>
    </span>
  </div>
</template>

<script>
import { Group, Calendar, Alert } from 'vux'
import { formatDate } from '../../common/js/data.js'
export default {
  name: 'checkTime',
  props: {
    // 起始时间
    startValue: {
      type: String,
      default () {
        console.log(this)
        return formatDate(Date.now(), 'yyyy-MM-dd')
      }
    },
    // 结束时间
    endValue: {
      type: String,
      default () {
        let value = this.startValue
        console.log(value, 191919)
        if (value === formatDate(Date.now(), 'yyyy-MM-dd')) {
          return formatDate((Date.now() + 86400000), 'yyyy-MM-dd')
        }
      }
    },
    // reservelist 选择日期后的回掉函数
    changeUpData: {
      type: Function
    }
  },
  computed: {
    // 展示起始时间
    startTimeShow () {
      if (!this.startValueAct) return ''
      let arr = this.startValueAct.split('-')
      return arr[1] + '月' + arr[2] + '日'
    },
    // 展示结束时间
    endTimeShow () {
      if (!this.endValueAct) return ''
      let arr = this.endValueAct.split('-')
      return arr[1] + '月' + arr[2] + '日'
    }
  },
  data () {
    return {
      manyDayVal: 1, // 多少天
      startValueAct: this.startValue,
      endValueAct: this.endValue,
      alertShow: false,
      alertContent: '请输入有效的起始时间'
    }
  },
  methods: {
    //  标准模式
    dataTranXieGang (str) {
      if (!str) return
      return str.replace(/-/g, '/')
    },
    // 时间戳转化
    dataShijianchuoTran (str, fmt) {
      let date = formatDate(str, fmt)
      return date
    },
    // 计算天数
    countManyDay (strT, endT) {
      if (!strT || !endT) return
      let Obj = {}
      let now = new Date(strT)
      let nowTime = now.getTime()
      let end = new Date(endT)
      let endTime = end.getTime()
      Obj.count = ((endTime - nowTime) / 86400000)
      return Obj
    },
    // 初始后默认计算函数
    firstCount () {
      let x = this.startValue
      let y = this.endValue
      if (!x || !y) return
      let obj = this.countManyDay(this.dataTranXieGang(x), this.dataTranXieGang(y))
      if (obj.count < 0) {
        this.startValueAct = ''
        this.alertShow = true
        obj.count = 0
      } else {
        this.manyDayVal = obj.count
      }
    },
    // 起始时间选择执行函数
    _startTimeChange () {
      console.log(this.startValueAct, '你好啊')
      if (!this.startValueAct || !this.endValueAct) return
      let obj = this.countManyDay(this.dataTranXieGang(this.startValueAct), this.dataTranXieGang(this.endValueAct))
      if (obj.count < 0) {
        this.startValueAct = ''
        this.alertShow = true
        obj.count = 0
      } else {
        this.manyDayVal = obj.count
        if (this.changeUpData) {
          this.changeUpData(this.startValueAct, this.endValueAct)
        }
      }
    },
    // 结束时间选择执行函数
    _endTimeChange () {
      console.log(this.endValueAct, '你好')
      console.log(this.endValueAct)
      if (!this.startValueAct || !this.endValueAct) return
      let obj = this.countManyDay(this.dataTranXieGang(this.startValueAct), this.dataTranXieGang(this.endValueAct))
      if (obj.count < 0) {
        this.endValueAct = ''
        this.alertShow = true
        obj.count = 0
      } else {
        this.manyDayVal = obj.count
        if (this.changeUpData) {
          this.changeUpData(this.startValueAct, this.endValueAct)
        }
      }
    }
  },
  created () {
    // 起始时间
    if (!this.startValue) {
      this.startValueAct = formatDate(Date.now(), 'yyyy-MM-dd')
    } else {
      this.startValueAct = this.startValue
    }

    // 结束时间
    if (!this.endValue) {
      if (!this.startValue) {
        this.endValueAct = formatDate((Date.now() + 86400000), 'yyyy-MM-dd')
      } else {
        this.endValueAct = ''
      }
    } else {
      this.endValueAct = this.endValue
    }
    // 初始计算次相差多少天
    this.firstCount()
  },
  components: {
    Group,
    Calendar,
    Alert
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.checkTime{
  display: inline-block;
  height: 0.8rem;
  line-height: 0.8rem;
  padding: 0 0.2rem;
  >span{
    display: inline-block;
    height: 0.3rem;
    float: left;
    line-height: 0.3rem;
    font-size: 15px;
    padding: 0.3rem 0 0.1rem 0;
    text-decoration: underline;
    color: #3399fc;
  }
  .startTime{
    position: relative;
    width: 1.4rem;
    height: 0.3rem;
    text-align: center;
    overflow: hidden;
    .startTimeContainer{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
      z-index: 20;
    }
  }
  .endTime{
    position: relative;
    width: 1.4rem;
    overflow: hidden;
    .endTimeContainer{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
      z-index: 20;
    }
  }
  .checkAllTime{
    position: relative;
    color: #666;
    text-align: center;
    &::before{
      content: "";
      background: url('./details_icon_jiantou.png') center center no-repeat;
      position: absolute;
      background-size: 50%;
      width: 1.35rem;
      height: 0.26rem;
      left: -4px;
      top: 0.15rem;
    }
    padding: 0.4rem 0.45rem 0 0.4rem;
    text-decoration: none;
    font-size: 10px;
  }
}
</style>
