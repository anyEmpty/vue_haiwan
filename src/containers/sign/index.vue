<template>
  <div class="sign">
    <toast v-model="messege" type="text" position="middle" width="20em">短信发送成功</toast>
    <div class="wrapper">
      <h3>手机动态验证登录</h3>
      <div class="container">
        <div class="phone">
          <i></i>
          <input type="text" placeholder="请输入手机号" v-model="phone" autofocus=”autofocus” @blur="_phoneBlur">
        </div>
        <div class="passworld">
          <i></i>
          <input type="passworld" placeholder="请输入密码" v-model="passworld" @blur="_passworldBlur">
          <input type="button" class="button"  :disabled="getPassWorldFlag" @click.stop.prevent="_getPassWorld" :class="{active: getPassWorldFlag}" v-model="getPassWorld"></input>
        </div>
        <div class="alert" v-show="alertFlag"><span><i></i>{{alert}}</span></div>
      </div>
      <div class="submitWrapper">
        <button class="submit" @click.stop.prevent="_sign">登陆</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vux'
const SUCCESS_DATA = '0000'
export default {
  name: 'sign',
  methods: {
    // 手机号输入失去焦点事件验证
    _phoneBlur () {
      let phone = this.phone
      if (!(phone.trim()) || !(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(phone))) {
        this.alert = '请输入正确的手机号'
        this.alertFlag = true
        let timer = setTimeout(() => {
          this.alertFlag = false
          clearTimeout(timer)
        }, 1000)
      }
    },
    // 验证码输入失去焦点事件验证
    _passworldBlur () {
      let passworld = this.passworld
      if (!(passworld.trim()) || !(/^\d{6}$/.test(passworld))) {
        this.alert = '验证码输入错误'
        this.alertFlag = true
        let timer = setTimeout(() => {
          this.alertFlag = false
          clearTimeout(timer)
        }, 1000)
      }
    },
    // 点击获取验证码时间
    _getPassWorld () {
      this.getPassWorld = `${this.timer}秒后重新获取`
      this.getPassWorldFlag = true
      let timer = setInterval(() => {
        if (this.timer > 0) {
          this.timer--
          this.getPassWorld = `${this.timer}秒后重新获取`
        } else {
          this.getPassWorld = '获取验证码'
          this.getPassWorldFlag = false
          this.timer = 60
          clearInterval(timer)
        }
      }, 1000)
      let param = {}
      param.mobile = this.phone
      // 发送验证码
      this._$http.post('/haiwan/client/user/sendMsgs', param, res => {
        if (res.code === SUCCESS_DATA) {
          this.messege = true
        } else {
          this.timer = 0
        }
      }, res => {
        this.timer = 0
      })
    },
    // 点击登陆按钮
    _sign () {
      let param = {}
      param.mobile = this.phone
      param.code = this.passworld
      param.openId = JSON.parse(window.localStorage.getItem('User')).openid
      this._$http.post('/haiwan/client/user/login', param, res => {
        console.log(res, 'jhjhjhjhjhjhjhjhj')
        if (res.code === SUCCESS_DATA) {
          console.log(res)
          let data = res.data
          let buyerId = data.buyerId
          // 存储用户buyerId
          window.localStorage.setItem('buyerId', JSON.stringify(buyerId))
          window.history.go(-1)
        }
      })
    }
  },
  data () {
    return {
      phone: '',
      passworld: '',
      alert: '请输入正确的手机号',
      alertFlag: false,
      getPassWorldFlag: false,
      getPassWorld: '获取验证码',
      timer: 60,
      messege: false
    }
  },
  created () {
    // 历史返回返回到该页面时
    let userId = JSON.parse(window.localStorage.getItem('buyerId'))
    if (userId) {
      window.history.go(-1)
    } else {
      return ''
    }
  },
  components: {
    Toast
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import url('../../common/less/index.less');
.sign{
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: #E4E4E4;
  padding: 0.2rem 0.2rem 0.2rem 0.2rem;
  box-sizing: border-box;
  .wrapper{
    background-color: white;
    h3{
      line-height: 1.36rem;
      height: 1.36rem;
      background-color: white;
      font-size: 15px;
      text-align: center;
      font-weight: 900;
      color: #333;
      .border-1px(#b4b4b4);
    }
    .container{
      padding: 0.20rem 0.3rem 0.9rem 0.20rem;
      background-color: white;
      position: relative;
      .phone{
        height: 1rem;
        line-height: 1rem;
        display: flex;
        align-items: center;
        i{
          felx: 0 0 0.46rem;
          width: 0.46rem;
          height: 0.46rem;
          display: inline-block;
          background: url('./icon_shouji.png') center center no-repeat;
          background-size: 50%;
          margin-right: 0.24rem;
        }
        input{
          color: #333;
          border-bottom: 1px solid #b4b4b4;
          flex: 1;
          padding: 0.3rem 0;
            &::-webkit-input-placeholder{
                color:#b4b4b4;
                font-size: 15px;
            }
        }
      }
      .passworld{
        height: 0.94rem;
        line-height: 0.94rem;
        display: flex;
        align-items: center;
        position: relative;
        i{
          felx: 0 0 0.46rem;
          width: 0.46rem;
          height: 0.46rem;
          display: inline-block;
          background: url('./icon_duanxin.png') center center no-repeat;
          background-size: 50%;
          margin-right: 0.24rem;
        }
        input{
          color: #333;
          border-bottom: 1px solid #b4b4b4;
          flex: 1;
          padding: 0.3rem 0;
          &::-webkit-input-placeholder{
              color:#b4b4b4;
              font-size: 15px;
          }
        }
        .button{
          position: absolute;
          width: 2rem;
          padding: 0;
          height: 0.6rem;
          line-height: 0.6rem;
          right: 0;
          bottom: 0.16rem;
          border: none;
          border-radius: 5px;
          color: #333;
          font-size: 13px;
          text-align: center;
          background-color: #ffc300;
          &.active{
            background-color: #b4b4b4;
          }
        }
      }

      .alert{
        width: 100%;
        height: 0.6rem;
        line-height: 0.6rem;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        background-color: white;
        span{
          width: 3rem;
          background-color: #fef7db;
          text-align: center;
          border-radius: 10px;
          color: #333;
          font-size: 13px;
          i{
            width: 0.46rem;
            height: 0.46rem;
            display: inline-block;
            background: url('./icon_gantan.png') center center no-repeat;
            background-size: 50%;
            vertical-align: top;
            margin-top: 3px;
          }
        }
      }
    }
    .submitWrapper{
      width: 100%;
      padding: 0 0.1rem;
      margin-top: 0.3rem;
      border: none;
      box-sizing: border-box;
      .submit{
        width: 100%;
        height: 0.86rem;
        line-height: 0.86rem;
        border: none;
        background-color: #ffc300;
        margin-bottom: 0.6rem;
        border-radius: 10px;
        color: #333;
        font-size: 16px;
      }
    }
  }
}
</style>
