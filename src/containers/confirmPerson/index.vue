<template>
  <div class="confirmPerson">
    <div class="userInfo clearfix">
      <p class="name"><span class="left">名字:</span><span class="right" @click.stop.prevent="_change">{{name}}</span><i class="change"></i></p>
      <p class="userNum"><span class="left">身份证:</span><span class="right">{{userIdentityNo}}</span></p>
    </div>
    <div class="agree">
      <button @click.stop.prevent="_goPay">去支付</button>
    </div>
  </div>
</template>

<script>
const SUCCESS_DATA = '0000'
export default {
  name: 'confirmPerson',
  data () {
    return {
      name: '',
      userIdentityNo: ''
    }
  },
  methods: {
    // 点击去付款
    _goPay () {
      let orderId = this.$route.query.orderId
      let price = this.$route.query.price
      this.$router.push({path: '/pay', query: {orderId: orderId, price: price}})
    },
    // 修改订单卖家信息
    _change () {
      // debugger
      let userId = this.$route.query.userId
      let orderId = this.$route.query.orderId
      this.$router.push({path: '/addPerson', query: {userId: userId, orderId: orderId, price: this.$route.query.price}})
    }
  },
  created () {
    let userId = this.$route.query.userId
    // 展示订单用户信息
    if (userId) {
      let param = {}
      param.userId = userId
      this._$http.post('/haiwan/client/order/queryRoomUser', param, res => {
        if (res.code === SUCCESS_DATA) {
          let data = res.data
          this.name = data.userName
          this.userIdentityNo = data.userIdentityNo
        }
      })
    }
  },
  mounted () {
  },
  components: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.confirmPerson{
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: #f4f4f4;
  .userInfo{
    background-color: white;
    padding: 0 0.2rem;
    font-size: 0;
    p{
      line-height: 0.9rem;
      height: 0.9rem;
      border-bottom: 1px solid #e4e4e4;
      position: relative;
      .change{
        position: absolute;
        top: 0;
        right: 0;
        width: 0.6rem;
        padding: 0.15rem;
        height: 0.6rem;
        background: url(../../common/images/icon_bi.png) center center no-repeat;
        background-size: 50%;
      }
      .left{
        font-size: 15px;
        font-weight: 900;
        color: #333;
      }
      .right{
        width: 5rem;
        float: right;
        font-size: 15px;
        color: #333;
      }
    }
  }
  .agree{
    margin-top: 0.6rem;
    padding: 0 0.2rem;
    button{
      width: 100%;
      height: 1rem;
      border: none;
      background-color: #ecc138;
      font-size: 18px;
      color: #333;
      border-radius: 5px;
    }
  }
  .read{
    margin-top: 0.3rem;
    color: #333;
    font-size: 13px;
    text-align: center;
    span{
      text-decoration: underline;
      color: #3399ff;
      padding: 0 0.1rem;
    }
  }
}
</style>
