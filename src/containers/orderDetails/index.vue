<template>
  <div class="orderDetails">
    <div class="toast" v-show="value.orderStatus !== '新订单'"></div>
    <alert v-model="alertShow" title="提示" :content="alertContent"></alert>
    <div class="timerDowmWrapper" v-show="value.orderStatus === '新订单'">
      <TimerDown :startPropsTimer="value.orderDate" :key="value.orderDate" :reload="_reload"></TimerDown>
    </div>
    <div class="contentWrapper">
      <div class="contentWrapperBox">
        <div class="imgWrapper">
          <img :src="value.productPic" alt="">
        </div>
        <div class="content">
          <p class="title clearfix">
            <span class="fl">
              {{value.productName}}
            </span>
            <span class="fr">
              <i>&yen;</i>
              {{value.productPrice}}
            </span>
          </p>
          <p class="type">
            {{value.productType}}
          </p>
          <p class="num clearfix">
            <span class="checkNum fl">
              数量: {{num}}
            </span>
            <span class="fr">
              <span class="dec" @click.stop.prevent="_dec"></span>
              <span class="num">{{num}}</span>
              <span class="add" @click.stop.prevent="_add"></span>
            </span>
          </p>
        </div>
      </div>
      <p class="orderTime clearfix">
        <span class="fl">
          订单时间: {{value.orderDate}}
        </span>
      </p>
      <p class="orderNum clearfix">
        <span class="fl">
          下单编号: {{value.orderId}}
        </span>
        <span class="fr">
          {{value.orderStatus}}
        </span>
      </p>
    </div>
    <div class="checkTimeWrapper">
      <span class="in">入住</span>
      <CheckTime ref="CheckTime" :startValue="value.orderDateIn" :endValue="value.orderDateOut" :key="value.orderDate" :changeUpData="changeUpData"></CheckTime>
      <span class="out">离开</span>
    </div>
    <div class="personInfo">
      <span class="icon" @click.stop.prevent="_changePersonInfo"></span>
      <p class="name">{{value.userName}}</p>
      <p class="iden">身份证: {{value.userIdentityNo}}</p>
      <p class="phone">手机号: {{value.userMobile}}</p>
    </div>
    <div class="foot">
      <span class="money">总额:
        <span class="showMoney"><i>&yen;</i> {{orderAmount}}</span>
      </span>
      <button class="pay" @click.stop.prevent="_goPay">去付款</button>
    </div>
  </div>
</template>

<script>
import TimerDown from '../../components/timerDown'
import CheckTime from '../../components/checkTime'
import {Alert} from 'vux'
const CODE_SUCCESS = '0000'
export default {
  name: 'orderDetails',
  methods: {
    // 点击去付款
    _goPay () {
      let canParam = {}
      canParam.orderDateIn = this.$refs.CheckTime.startValueAct
      canParam.orderDateOut = this.$refs.CheckTime.endValueAct
      canParam.productId = this.productId
      // 数量验证
      this._$http.post('/haiwan/client/product/findByStartDateAndEndDateAndProductId', canParam, res => {
        if (res.code === CODE_SUCCESS) {
          let residualQuantity = res.data.residualQuantity
          if (residualQuantity < this.num) {
            this.alertContent = '网络异常，请稍后再试'
            this.alertShow = true
          } else {
            // 修改预定信息
            let upParam = {}
            upParam.orderDateIn = this.$refs.CheckTime.startValueAct
            upParam.orderDateOut = this.$refs.CheckTime.endValueAct
            upParam.orderId = this.orderId
            upParam.orderAmount = this.orderAmount
            upParam.productId = this.productId
            upParam.orderCount = this.num
            this._$http.post('/haiwan/client/order/updateOrder', upParam, res => {
              if (res.code === CODE_SUCCESS) {
                // 付款
                this.$router.push({path: '/pay', query: {orderId: this.orderId, price: this.orderAmount}})
              }
            })
          }
        }
      })
    },
    // 修改用户信息
    _changePersonInfo () {
      this.$router.push({path: '/addPerson', query: {userId: this.userId, orderId: this.orderId, comeOrder: 1}})
    },
    // 减
    _dec () {
      if (Number(this.num) <= 1) {
        this.alertContent = '预定房间数不得小于1间！'
        this.alertShow = true
        return
      }
      this.num--
      this.orderAmount = (Number(this.danPrice) * Number(this.num)) * Number(this.$refs.CheckTime.manyDayVal).toFixed(2)
    },
    // 加
    _add () {
      this.num++
      this.orderAmount = (Number(this.danPrice) * Number(this.num)) * Number(this.$refs.CheckTime.manyDayVal).toFixed(2)
    },
    // 子组建日期改编后的回掉函数
    changeUpData () {
      this.orderAmount = (Number(this.danPrice) * Number(this.num)) * Number(this.$refs.CheckTime.manyDayVal).toFixed(2)
    },
    // 倒计时结束后重新获取函数
    _reload () {
      this._getData()
    },
    _getData () {
      this.orderId = this.$route.query.orderId
      let param = {}
      param.orderId = this.orderId
      this._$http.post('/haiwan/client/order/queryOrderDetails', param, res => {
        if (res.code === CODE_SUCCESS) {
          let data = res.data
          this.num = data.orderCount
          this.danPrice = data.productPrice
          this.orderAmount = data.orderAmount
          this.userId = data.userId
          this.productId = data.productId
          this.value = data
        }
      })
    }
  },
  data () {
    return {
      value: {},
      num: 1,
      danPrice: 0,
      orderAmount: 0,
      alertShow: false,
      alertContent: '预定房间数不得小于1间！',
      userId: '',
      orderId: '',
      productId: ''
    }
  },
  computed: {
  },
  mounted () {
    this._getData()
  },
  components: {
    TimerDown,
    CheckTime,
    Alert
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.orderDetails{
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: #f4f4f4;
  padding-top: 0.2rem;
  .toast{
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: black;
    opacity: 0.4;
    z-index: 100;
  }
  .timerDowmWrapper{
    padding-left: 0.2rem;
    line-height: 0.6rem;
    background-color: #fef7db;
    font-size: 12px;
    color: #333;
  }
  .contentWrapper{
    background-color: white;
    padding: 0.2rem 0.2rem;
    box-sizing: border-box;
    .contentWrapperBox{
      display: flex;
      padding-bottom: 0.2rem;
      border-bottom: 1px dashed #b4b4b4;
      .imgWrapper{
        flex: 0 0 1.5rem;
        // background-color: pink;
        margin-right: 0.2rem;
        overflow: hidden;
        img{
          display: block;
          width: 100%;
        }
      }
      .content{
        flex: 1;
        .title{
          font-size: 12px;
          font-weight: 900;
          color: #333;
          .fr{
            color: #ff0000;
            font-size: 16px;
            i{
              font-size: 14px;
            }
          }
        }
        .type{
          font-size: 10px;
        }
        .num{
          .fl{
            padding-top: 0.15rem
          }
          .fr{
            display: inline-block;
            line-height: 0.6rem;
            height: 0.6rem;
            span.num{
              display: inline-block;
              height: 0.6rem;
              line-height: 0.6rem;
              vertical-align: top;
              width: 0.5rem;
              text-align: center;
              overflow: hidden;
            }
            span.dec{
              background: url('./button_jian.png') no-repeat center center;
            }
            span.add{
              background: url('./button_jia.png') no-repeat center center;
            }
            span.add, span.dec{
              display: inline-block;
              width: 22px;
              height: 22px;
              padding: 0.08rem 0.2rem;
              background-size: 50%;
            }
          }
        }
      }
    }
    .orderTime{
      line-height: 0.3rem;
      padding-top: 0.2rem;
    }
    .orderNum{
      padding-top: 0.1rem;
      line-height: 0.3rem;
      .fr{
        font-size: 14px;
        color: #ffc300;
        margin-top: -0.1rem;
      }
    }
  }
  .checkTimeWrapper{
    margin-top: 0.2rem;
    background-color: white;
    text-align: center;
    height: 0.8rem;
    line-height: 0.8rem;
    vertical-align: bottom;
    .in,.out{
      font-size: 16px;
      color: #ffc300;
    }
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .personInfo{
    margin-top: 0.2rem;
    background-color: white;
    padding: 0 0.2rem;
    box-sizing: border-box;
    position: relative;
    .icon{
      position: absolute;
      height: 0.6rem;
      width: 0.6rem;
      top: 0rem;
      right: 0.2rem;
      padding: 0.11rem;
      background: url('../../common/images/icon_bi.png') center center no-repeat;
      background-size: 50%;
      background-clip: content-box;
      background-origin: content-box;
    }
    p{
      line-height: 0.82rem;
      height: 0.82rem;
      color: #333;
      font-size: 14px;
      border-top: 1px solid #f4f4f4;
    }
    p:first-child{
      border-top: none;
    }
  }
  .foot{
    position: absolute;
    bottom: 0;
    height: 0.9rem;
    background-color: white;
    width: 100%;
    left: 0;
    display: flex;
    padding-left: 0.2rem;
    box-sizing: border-box;
    >span{
      flex: 1;
      height: 0.9rem;
      line-height: 0.9rem;
      font-size: 14px;
      .showMoney{
        color: red;
        i{
          font-size: 12px;
        }
      }
    }
    .pay{
      felx: 0 0 2.1rem;
      width: 2.1rem;
      height: 100%;
      background-color: #FFC300;
      border: none;
      font-weight: 900;
      font-size: 16px;
    }
  }
}
</style>
