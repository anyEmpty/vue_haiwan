<template>
  <div class="addPerson">
    <div class="userInfo clearfix">
      <p class="name"><span class="left">入住人姓名</span><input type="text" placeholder="与证件一致" class="right" v-model="name"></p>
      <p class="type"><span class="left">证件类型</span><span class="right">身份证</span></p>
      <p class="userNum"><span class="left">证件号码</span><input type="text" placeholder="与证件一致" class="right" v-model="userIdentityNo"></p>
      <p class="userPhone"><span class="left">手机号</span><input type="text" placeholder="用于接收变更信息" class="right" v-model="phone"></p>
    </div>
    <div class="agree">
      <button @click.stop.prevent="_save">保存</button>
    </div>
    <p class="read">我已阅读并同意<span class="auther"><<海湾森林公园入住协议>></span></p>
  </div>
</template>

<script>
const SUCCESS_DATA = '0000'
export default {
  name: 'addPerson',
  data () {
    return {
      name: '',
      userIdentityNo: '',
      phone: '',
      userId: ''
    }
  },
  methods: {
    // 点击保存按钮事件
    _save () {
      let param = {}
      param.orderId = this.$route.query.orderId
      param.userName = this.name
      param.userIdentityNo = this.userIdentityNo
      param.userMobile = this.phone
      param.buyerId = JSON.parse(window.localStorage.getItem('buyerId'))
      param.userId = this.userId
      console.log(param)
      this._$http.post('/haiwan/client/order/saveRoomUser', param, res => {
        if (res.code === SUCCESS_DATA) {
          let data = res.data
          this.userId = data.userId
          // 判断是否为订单详情页的跳转修改用户信息
          let comeOrder = this.$route.query.comeOrder
          if (comeOrder) {
            this.$router.push({path: '/orderDetails', query: {orderId: this.$route.query.orderId}})
            return
          }
          // 确认用户
          this.$router.push({path: '/confirmPerson', query: {userId: this.userId, orderId: this.$route.query.orderId, price: this.$route.query.price}})
        }
      })
    }
  },
  created () {
    // let orderId = this.$route.query.orderId
    this.userId = this.$route.query.userId
    // 如果已经存在用户id, 显示对应的用户信息
    if (this.userId) {
      let param = {}
      param.userId = this.userId
      this._$http.post('/haiwan/client/order/queryRoomUser', param, res => {
        if (res.code === SUCCESS_DATA) {
          let data = res.data
          this.name = data.userName
          this.userIdentityNo = data.userIdentityNo
          this.phone = data.userMobile
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
.addPerson{
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
      .left{
        font-size: 15px;
        font-weight: 900;
        color: #333;
      }
      .right{
        width: 5rem;
        float: right;
        font-size: 15px;
        height: 0.3rem;
        padding-top: 0.3rem;
        color: #333;
        &::-webkit-input-placeholder{
          color: #666;
          font-size: 15px;
        }
      }
    }
    .type{
      .right{
        padding-top: 0;
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
