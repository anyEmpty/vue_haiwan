<template>
  <div class="pay">
    <div class="wrapper">
      <div class="item weixin">
        <img class="bigImg" src="./image_weixin.png" alt="">
        <i class="smaImg"></i>
        <span>微信</span>
      </div>
      <div class="item zhifubao">
        <img class="bigImg" src="./image_zhifubao.png" alt="">
        <i class="smaImg"></i>
        <span>支付宝</span>
      </div>
    </div>
    <div class="foot">
      <button class="fr btn" @click.stop.prevent=_pay>确认付款</button>
      <div class="money">
        <span>总额 :</span>
        <span class="text"> &yen;{{price}}<span class="moneyAll"></span></span>
      </div>
    </div>
  </div>
</template>

<script>
// const SUCCESS_DATA = '0000'
export default {
  name: 'pay',
  data () {
    return {
      price: ''
    }
  },
  methods: {
    _pay () {
      let orderId = this.$route.query.orderId
      let openId = JSON.parse(window.localStorage.getItem('User')).openid
      // 线上
      // window.location.href = 'http://haiwan.xylbn.cn/haiwan/pay/create?orderId=' + orderId + '&openId= '+ openId
      // 测试
      window.location.href = 'http://test.xylbn.cn/haiwan/pay/create?orderId=' + orderId + '&openId=' + openId
    }
  },
  created () {
    // 订单金额
    this.price = this.$route.query.price
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.pay{
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #e4e4e4;
  .wrapper{
    height: 3rem;
    background-color: white;
    display: flex;
    align-items: center;
    .item{
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      .bigImg{
        width: 1rem;
        height: 1rem;
      }
      .smaImg{
        display: inline-block;
        width: 26px;
        height: 26px;
        margin: 0 0.16rem 0 0.3rem;
      }
      span{
        font-size: 18px;
        color: #333;
      }
    }
    .weixin{
      .smaImg{
        background: url('./icon_gouxuan.png') no-repeat center center;
        background-size: 50%;
      }
    }
    .zhifubao{
      .smaImg{
        background: url('./icon_kuang.png') no-repeat center center;
        background-size: 50%;
      }
    }
  }
  .foot{
    height: 0.90rem;
    line-height: 0.90rem;
    // background-color: pink;
    border-top: 1px solid #e0e0e0;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    .btn{
      width: 2.1rem;
      height: 100%;
      background-color: #FFC300;
      border: none;
      font-weight: 900;
      font-size: 16px;
      color: #333;
    }
    .money{
      background-color: white;
      overflow: hidden;
      height: 100%;
      padding-left: 0.2rem;
      color: #333;
      font-size: 14px;
      .text{
        font-weight: 900;
        color: #FF0101;
        .moneyAll{
          font-size: 16px;
        }
      }
    }
  }
}
</style>
