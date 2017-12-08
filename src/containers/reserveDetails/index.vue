<template>
  <div class="reserveDetails">
    <alert v-model="alertShow" title="提示" :content="alertContent"></alert>
    <div class="popImageWrapper" v-show="popShowFlag" @click.stop.prevent="_popShowCancel">
      <div class="popImageWrapperContainer" >
        <swiper :show-dots="false" v-model="popIndex">
          <swiper-item v-for="(item, index) in photoList" :key="index">
            <img :src="item" class="popImage">
          </swiper-item>
        </swiper>
      </div>
    </div>
    <div class="container">
      <div class="detailTop">
        <div class="imgWrapper">
          <img :src="data.productPic" alt="">
        </div>
        <p class="type clearfix">
          {{data.productName}}
          <span class="residualQuantity">{{residualQuantity}}间</span>
          <span class="fr"><span><i>&yen;</i>{{data.productPrice}}</span></span>
        </p>
        <div class="addreNum clearfix" >
          <span class="fl one-txt-cut"><i></i>地址: {{data.productAddress}}</span>
          <span class="fr">
            <span class="dec" @click.stop.prevent="_dec"></span>
            <span class="num">{{num}}</span>
            <span class="add" @click.stop.prevent="_add"></span>
          </span>
        </div>
      </div>
      <div class="serverPrev">
        <h3><i></i>提供服务</h3>
        <ul class="clearfix">
          <li v-for="item in data.servicesList" class="weiyu">
            <img :src="item.src" alt="">
            <p>{{item.text}}</p>
          </li>
        </ul>
        <p class="infoCon">
          {{data.productDescription}}
        </p>
      </div>
      <div class="inOrder">
        <h3 @click.stop.prevent="_ruZhuClick" ><i></i><span>入住须知</span><i></i></h3>
        <div class="infoWrapper" v-show="ruZhuFlag">
          <ul v-for="item in data.itemDescriptionList">
            <li class="title">
              {{item.itemTitle}}
            </li>
            <li class="content">
              {{item.itemDescription}}
            </li>
          </ul>
        </div>
      </div>
      <div class="aboutImg">
        <h3><i></i>相关图片</h3>
        <div class="imgWrapper">
          <ul class="clearfix">
            <li v-for="(photo, index) in photoList" @click.stop.prevent="_imageClick(index)">
              <img :src="photo" alt="">
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="foot">
      <div class="pop"></div>
      <button class="fr btn" @click.stop.prevent="_orderPay">预定</button>
      <div class="data">
        <CheckTime :startValue="startValue" :endValue="endValue" ref="CheckTime"></CheckTime>
      </div>
    </div>
  </div>
</template>

<script>
import CheckTime from '../../components/checkTime'
import { Swiper, SwiperItem, Alert } from 'vux'
const SUCCESS_DATA = '0000'
export default {
  name: 'reserveDetails',
  data () {
    return {
      alertShow: false,
      alertContent: '已经是最大可预定房间了！',
      ruZhuFlag: false,
      data: [],
      photoList: [],
      popIndex: 0,
      popShowFlag: false,
      startValue: '',
      endValue: '',
      num: 1,
      residualQuantity: 1,
      danPrice: 0
    }
  },
  computed: {
    // 金额
    price () {
      if (this.$refs) {
        return (Number(this.danPrice) * Number(this.num)) * Number(this.$refs.CheckTime.manyDayVal).toFixed(2)
      } else {
        return ''
      }
    }
  },
  methods: {
    // 减
    _dec () {
      if (Number(this.num) <= 1) {
        this.alertContent = '预定房间数不得小于1间！'
        this.alertShow = true
        return
      }
      this.num--
    },
    // 加
    _add () {
      if (Number(this.num) >= Number(this.residualQuantity)) {
        this.alertShow = true
        return
      }
      this.num++
    },
    // 时间转化 汉字 To -
    hanZiTranStrict (str) {
      if (!str) return
      str = str.replace(/[\u4e00-\u9fa5]/g, '-')
      return str.substr(0, str.length - 1)
    },
    // 图片弹窗
    _popShowCancel () {
      this.popShowFlag = false
    },
    // 图片点击
    _imageClick (index) {
      // debugger
      this.popIndex = index
      this.popShowFlag = true
    },
    // 入住须知点击
    _ruZhuClick () {
      this.ruZhuFlag = !this.ruZhuFlag
    },
    // 预定
    _orderPay () {
      let canParam = {}
      canParam.orderDateIn = this.$refs.CheckTime.startValueAct
      canParam.orderDateOut = this.$refs.CheckTime.endValueAct
      canParam.productId = this.$route.query.productId
      // 数量验证
      this._$http.post('/haiwan/client/product/findByStartDateAndEndDateAndProductId', canParam, res => {
        if (res.code === SUCCESS_DATA) {
          let residualQuantity = res.data.residualQuantity
          if (residualQuantity < this.num) {
            this.alertContent = '网络异常，请稍后再试'
            this.alertShow = true
          } else {
            // 判断是否登陆
            let buyerId = JSON.parse(window.localStorage.getItem('buyerId'))
            if (buyerId) {
              let orderParam = {}
              orderParam.productId = this.$route.query.productId
              orderParam.orderAmount = this.price
              orderParam.orderDateIn = this.$refs.CheckTime.startValueAct
              orderParam.orderDateOut = this.$refs.CheckTime.endValueAct
              orderParam.orderCount = this.num
              orderParam.buyerId = buyerId
              this._$http.post('/haiwan/client/order/reserve', orderParam, res => {
                if (res.code === SUCCESS_DATA) {
                  let data = res.data
                  let orderId = data.orderId
                  let userId = data.userId
                  // 添加用户
                  this.$router.push({path: '/addPerson', query: {orderId: orderId, userId: userId, price: this.price}})
                } else {
                  this.alertContent = res.msg
                  this.alertShow = true
                }
              })
            } else {
              // 登陆
              this.$router.push({path: '/sign', query: {}})
            }
          }
        } else {
          this.alertContent = res.msg
          this.alertShow = true
        }
      })
    }
  },
  activated () {
    this.residualQuantity = Number(this.$route.query.residualQuantity)
    this.startValue = this.hanZiTranStrict(this.$route.query.startValue)
    this.endValue = this.hanZiTranStrict(this.$route.query.endValue)
    let id = this.$route.query.productId
    let param = {}
    param.productId = id
    // 请求详情
    this._$http.post('/haiwan/client/product/queryProductDetails', param, res => {
      if (res.code === SUCCESS_DATA) {
        let data = res.data
        this.data = data
        this.danPrice = data.productPrice
        let picParam = {}
        picParam.productId = id
        picParam.page = 1
        picParam.size = 99
        // 图片请求
        this._$http.post('/haiwan/client/product/queryPictures', picParam, res => {
          if (res.code === SUCCESS_DATA) {
            let data = res.data
            this.photoList = data.photoUrlList
          }
        })
      }
    })
  },
  created () {
    this.residualQuantity = Number(this.$route.query.residualQuantity)
    this.startValue = this.hanZiTranStrict(this.$route.query.startValue)
    this.endValue = this.hanZiTranStrict(this.$route.query.endValue)
    let id = this.$route.query.productId
    let param = {}
    param.productId = id
    // 请求详情
    this._$http.post('/haiwan/client/product/queryProductDetails', param, res => {
      if (res.code === SUCCESS_DATA) {
        let data = res.data
        this.data = data
        this.danPrice = data.productPrice
        let picParam = {}
        picParam.productId = id
        picParam.page = 1
        picParam.size = 99
        // 图片请求
        this._$http.post('/haiwan/client/product/queryPictures', picParam, res => {
          if (res.code === SUCCESS_DATA) {
            let data = res.data
            this.photoList = data.photoUrlList
          }
        })
      }
    })
  },
  components: {
    CheckTime,
    Swiper,
    SwiperItem,
    Alert
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.reserveDetails{
  background-color: #E4E4E4;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  .popImageWrapper{
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: center;
    .popImageWrapperContainer{
      width: 6rem;
      height: 6rem;
      overflow: hidden;
      .vux-slider{
        width: 100%;
        .popImage{
          display: block;
          width: 100%;
        }
      }
    }
  }
  .foot{
    position: absolute;
    bottom: 0;
    height: 0.9rem;
    width: 100%;
    left: 0;
    border-top: 1px solid #b4b4b4;
    .pop{
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
        background-color: white;
        z-index: 20;
        opacity: 1;
        padding-top: 1px;
        margin-top: -1px;
    }
    .btn{
      width: 2.1rem;
      height: 100%;
      background-color: #FFC300;
      border: none;
      font-weight: 900;
      font-size: 16px;
    }
    .data{
      overflow: hidden;
      height: 100%;
      padding-left: 0.2rem;
    }
  }
  .container{
    position: absolute;
    top: 0;
    bottom: 0.91rem;
    width: 100%;
    left: 0;
    overflow: auto;
    .detailTop{
      background-color: white;
      .imgWrapper{
        height: 4.72rem;
        overflow: hidden;
        img{
          display: block;
          width: 100%;
        }
      }
      .type{
        padding: 0.3rem 0 0.12rem 0.3rem;
        font-size: 18px;
        font-weight: 900;
        color: #333;
        .residualQuantity{
          margin-left: 0.7rem;
          color: #666;
          font-size: 13px;
          display: inline-block;
        }
        .fr{
          color: #999;
          font-size: 16px;
          padding-right: 0.2rem;
          vertical-align: bottom;
          span{
            color: #ff0000;
            font-size: 16px;
            i{
              font-size: 14px;
            }
          }
        }
      }
      .addreNum{
        padding: 0 0.2rem 0.2rem 0.2rem;
        .fl{
          width: 4.6rem;
          font-size: 13px;
          color: #666;
          height: 0.6rem;
          display: inline-block;
          line-height: 0.6rem;
          i{
            vertical-align: middle;
            width: 24px;
            height: 30px;
            display: inline-block;
            background: url('./icon_dizhi.png') no-repeat center center;
            background-size: 50%;
            margin-top: -4px;
          }
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
    .serverPrev{
      background-color: white;
      margin-top: 0.2rem;
      h3{
        padding: 0.3rem 0;
        text-align: center;
        font-size: 17px;
        color: #333;
        i{
          vertical-align: middle;
          display: inline-block;
          width: 15px;
          height: 19px;
          background: white url('./icon_fuwu.png') no-repeat center center;
          background-size: 100%;
          margin-right: 0.2rem;
        }
      }
      ul{
        li{
          float: left;
          width: 25%;
          text-align: center;
          padding-bottom: 0.38rem;
          img{
            vertical-align: middle;
            display: inline-block;
            width: 20px;
            height: 20px;
          }
          p{
            text-align: center;
            font-size: 12px;
            color: #333;
          }
        }
      }
      .infoCon{
        padding: 0.38rem 0.2rem;
        border-top: 1px solid #e0e0e0;
        font-size: 12px;
        line-height: 0.36rem;
        color: #333;
        font-weight: 900;
      }
    }
    .inOrder{
      margin-top: 0.2rem;
      padding: 0 0.2rem;
      background-color: white;
      h3{
        padding: 0.3rem 0;
        text-align: center;
        font-size: 17px;
        color: #333;
        span{
          margin: 0 0.2rem;
        }
        i{
          vertical-align: middle;
          display: inline-block;
          width: 13px;
          height: 16px;
          background: url('./icon_xuzhi.png') no-repeat center center;
          background-size: 100%;
        }
        i:last-child{
          width: 18px;
          height: 9px;
          background: url('./icon_xiala.png') no-repeat center center;
          background-size: 100%;
        }
      }
      .infoWrapper{
        ul{
          li{
            font-size: 12px;
            line-height: 0.36rem;
            color: #333;
            font-weight: 900;
          }
          li:last-child{
            padding-bottom: 0.2rem;
          }
          li.title{
            font-size: 14px;
            padding-top: 10px;
          }
          li.content{
            letter-spacing: 3px;
            color: #666;
          }
        }
      }

    }
    .aboutImg{
      margin-top: 0.2rem;
      padding: 0 0.2rem;
      background-color: white;
      box-sizing: border-box;
      h3{
        padding: 0.3rem 0;
        text-align: center;
        font-size: 17px;
        color: #333;
        i{
          vertical-align: middle;
          display: inline-block;
          width: 15px;
          height: 15px;
          background: url('./icon_tupian.png') no-repeat center center;
          background-size: 100%;
          margin-right:0.2rem;
        }
      }
      .imgWrapper{
        max-height: 4.02rem;
        overflow: auto;
        ul{
          li{
            float: left;
            width: 2.18rem;
            height: 1.34rem;
            margin-right: 0.25rem;
            // background-color: pink;
            margin-bottom: 0.2rem;
            overflow: hidden;
            img{
              display: block;
              width: 100%;
            }
          }
          li:nth-of-type(3n){
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
