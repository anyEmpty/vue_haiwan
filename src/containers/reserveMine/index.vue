<template>
  <div class="reserveMine">
    <alert v-model="alertShow" title="提示" :content="alertContent"></alert>
    <confirm v-model="ConfirmShowFlag"
    title="提示"
    @on-cancel="_onCancel"
    @on-confirm="_onConfirm">
      <p style="text-align:center; color:red;">确定退出登录吗！</p>
    </confirm>
    <div class="delUser" @click.stop.prevent="_delUser" v-show="hasLogin">退出登录</div>
    <div class="container">
      <div class="headerImg">
        <img src="./image_yuding.png" height="447" width="750" alt="">
      </div>
      <div class="searchMain">
        <div class="serchInfo">
          <div class="serchInfoTop">
            <span class="startTime" id="startTime">
              <span class="showValue">{{startTimeShow}}</span>
              <group class="dataPick">
                <calendar title="" v-model="startValue" @on-change="_startTimeChange" :render-on-value-change='false' :replace-text-list="{'TODAY':'今'}" :disable-past="true"></calendar>
              </group>
            </span>
            <span class="count"><i></i><span class="countAll">共{{manyDay}}晚</span></span>
            <span class="endTime" id="endTime">
              <span class="showValue">{{endTimeShow}}</span>
              <group class="dataPick">
                <calendar title="" v-model="endValue" @on-change="_endTimeChange" :render-on-value-change='false' :replace-text-list="{'TODAY':'今'}" :disable-past="true"></calendar>
              </group>
            </span>
          </div>
          <div class="serchInfoBottom">
            <p class="clearfix"><span class="fl">入住</span><span class="fr">离开</span></p>
          </div>
          <div class="serchInfoType" @click.stop.prevent='_typeShowClick'>
            <p class="clearfix"><span class="fl">{{typeShowData[typeCheck].categoryName}}</span><span class="fr"></span></p>
          </div>
        </div>
          <div class="serchBtn" @click.stop.prevent='_search'>
            <button class="btn">查询</button>
          </div>
      </div>
      <div class="infoFoot">
        <p>海湾国家公园&nbsp;&nbsp;休闲度假胜地</p>
        <ul class="clearfix">
          <li class="ser"><i></i>7x24h客服</li>
          <li class="online"><i></i>网络覆盖</li>
          <li class="safe"><i></i>安全保障</li>
        </ul>
      </div>
    </div>
    <div class="foot">
      <ul class="clearfix">
        <router-link :to="{ path: '/reserveList',query:{categoryId:'30'}}">
          <li class="fl schedule">
            <i></i>
            <div>房车预定</div>
          </li>
        </router-link>
        <router-link :to="{ path: '/reserveList',query:{categoryId:'31'}}">
        <li class="fl rate ">
          <i></i>
          <div>帐篷预定</div>
        </li>
        </router-link>
        <li class="fl order" @click.stop.prevent="_myOrder">
          <i></i>
          <div>我的订单</div>
        </li>
      </ul>
    </div>
    <div class="typeSelet" v-show="typeShow">
        <div class="typeSeletContainer">
        <h3>选择住宿类型</h3>
        <ul>
          <li v-for="(item, index) in typeShowData" :class="{active: typeCheck === index}" @click.stop.prevent='_typeCheckClick(index)'>
            {{item.categoryName}}
          </li>
        </ul>
        <div class="check">
          <button class="cancel" @click.stop.prevent="_cancelClick">取消</button>
          <button class="sure" @click.stop.prevent="_sureClick">确定</button>
        </div>
        </div>
    </div>
  </div>
</template>
<script>
import { Group, Calendar, Alert, Confirm } from 'vux'
import { mapGetters } from 'vuex'
import { formatDate } from '../../common/js/data.js'
const SUCCESS_DATA = '0000'
export default {
  name: 'reserveMine',
  computed: {
    ...mapGetters({
      test1: 'test1'
    }),
    hasLogin () {
      let buyerId = this.buyerId
      if (buyerId) {
        return true
      }
      return false
    },
    // 起始时间展示
    startTimeShow () {
      if (!this.startValue) return ''
      let arr = this.startValue.split('-')
      return arr[1] + '月' + arr[2] + '日'
    },
    // 结束时间展示
    endTimeShow () {
      if (!this.endValue) return ''
      let arr = this.endValue.split('-')
      return arr[1] + '月' + arr[2] + '日'
    }
  },
  data () {
    return {
      ConfirmShowFlag: false,
      typeCheck: 0,
      typeShow: false,
      typeShowData: [{categoryName: '不限', categoryId: ''}],
      startValue: this.dataShijianchuoTran(Date.now(), 'yyyy-MM-dd'),
      endValue: this.dataShijianchuoTran((Date.now() + 86400000), 'yyyy-MM-dd'), // 当前日期加1
      manyDay: 1,
      alertShow: false,
      alertContent: '请输入有效的起始时间',
      checkStartTimeFlag: true,
      buyerId: window.localStorage.getItem('buyerId')
    }
  },
  methods: {
    _onCancel () {
    },
    _onConfirm () {
      window.localStorage.removeItem('buyerId')
      this.buyerId = undefined
    },
    _delUser () {
      this.ConfirmShowFlag = true
    },
    // 点击查询时间
    _search () {
      this.$router.push({path: '/reserveList', query: {categoryId: this.typeShowData[this.typeCheck].categoryId, startValue: this.startValue, endValue: this.endValue}})
    },
    // 起始时间选择
    _startTimeChange () {
      if (!this.endValue || !this.startValue) return
      let obj = this.countManyDay(this.dataTranXieGang(this.startValue), this.dataTranXieGang(this.endValue))
      if (this.checkStartTimeFlag) {
        if (obj.count < 0) {
          this.checkStartTimeFlag = false
          this.endValue = ''
          obj.count = 0
        }
      } else {
        if (obj.count < 0) {
          this.endValue = ''
          obj.count = 0
          this.alertShow = true
        }
      }
      this.manyDay = obj.count
    },
    // 结束时间选择
    _endTimeChange () {
      if (!this.endValue || !this.startValue) return
      let obj = this.countManyDay(this.dataTranXieGang(this.startValue), this.dataTranXieGang(this.endValue))
      if (obj.count < 0) {
        this.alertShow = true
        this.endValue = ''
        obj.count = 0
      }
      this.manyDay = obj.count
    },
    // 时间转化 - to /
    dataTranXieGang (str) {
      if (!str) return
      return str.replace(/-/g, '/')
    },
    // 计算相隔多少天
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
    // 时间戳转化
    dataShijianchuoTran (str, fmt) {
      let date = formatDate(str, fmt)
      return date
    },
    // 点击我的订单
    _myOrder () {
      let buyerId = JSON.parse(window.localStorage.getItem('buyerId'))
      if (buyerId) {
        this.$router.push({path: '/orderList', query: {}})
      } else {
        this.$router.push({path: '/sign', query: {}})
      }
    },
    // 选额类型点击
    _typeShowClick () {
      this.typeShow = true
    },
    // 选额类型点击
    _typeCheckClick (index) {
      this.typeCheck = index
    },
    // 取消
    _cancelClick () {
      this.typeShow = false
      this.typeCheck = 0
    },
    // 确定
    _sureClick () {
      this.typeShow = false
    }
  },
  created () {
    // 获取openid
    console.log(window.location.search.split('='), 111111111)
    let User = JSON.parse(window.localStorage.getItem('User'))
    // debugger
    if (!User || window.localStorage.getItem('User') === '{}') {
      console.log(window.location.search.split('='), 222222222)
      let openid = window.location.search.split('=')[1]
      let User = {}
      User.openid = openid
      window.localStorage.setItem('User', JSON.stringify(User))
    }
    // 获取当前产品类型
    this._$http.post('/haiwan/client/product/queryCategory', {}, res => {
      console.log(res)
      if (res.code === SUCCESS_DATA) {
        let data = res.data
        this.typeShowData = this.typeShowData.concat(data)
      }
    })
  },
  components: {
    Group,
    Calendar,
    Alert,
    Confirm
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.reserveMine{
  background-color: #e4e4e4;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  .delUser{
    position: absolute;
    width: 1rem;
    height: 0.8rem;
    border-radius: 50%;
    line-height: 0.8rem;
    background-color: #fefefe;
    color: black;
    opacity: 0.8;
    top: 0.5rem;
    text-align: center;
    right: 0.5rem;
    z-index: 1000;
  }
  .container{
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 1rem;
    .headerImg{
      height: 4.48rem;
      overflow: hidden;
      img{
        display: block;
        width: 100%;
      }
    }
    .searchMain{
      height: 5.1rem;
      position: relative;
      margin-top: -1.18rem;
      padding: 0 0.2rem;
      box-sizing: border-box;
      .serchInfo{
        margin-bottom: 0.34rem;
        background-color: white;
        .serchInfoTop{
          padding: 0.3rem 0.8rem 0 0.8rem;
          .count{
            padding:0 0.5rem;
            vertical-align: top;
            position: relative;
            width: 1.32rem;
            height: 1.4rem;
            display: inline-block;
            i{
              position: absolute;
              top: 0;
              display: inline-block;
              width: 1rem;
              height: 1rem;
              background: url('./details_icon_jiantou.png') no-repeat center center;
              background-size: 0.8rem 0.2rem;
              border-radius: 50%;
              background-color: #ffc500;
              transform: translateX(-50%);
              left: 50%;
            }
            .countAll{
              position: absolute;
              bottom: -0.1rem;
              transform: translateX(-50%);
              left: 50%;
              width: 1.2rem;
              font-size: 12px;
              color: #666;
              text-align: center;
              border: 1px solid #333;
              border-radius: 0.1rem;
            }
          }
          .startTime,.endTime{
              vertical-align: top;
              display: inline-block;
              font-size: 30px;
              height: 1.4rem;
              line-height: 0.7rem;
              width: 1.5rem;
              color: #333;
              text-align: center;
              overflow : hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              position: relative;
              .dataPick{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                overflow: hidden;
                z-index: 50;
                opacity: 0;
              }
              .showValue{
                background-color: white;
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                z-index: 50;
              }
          }
        }
        .serchInfoBottom{
          margin-top: 0.1rem;
          padding: 0 1.3rem 0.3rem 1.2rem;
        }
        .serchInfoType{
          height: 0.88rem;
          line-height: 0.88rem;
          padding-left: 1rem;
          font-size: 15px;
          font-weight: 900;
          padding-right: 0.8rem;
          color: #b4b4b4;
          .fr{
            display: inline-block;
            width: 0.24rem;
            height: 0.44rem;
            padding: 0.22rem 0;
            background: url('./icon_jiantou.png') no-repeat center center;
            background-size: 0.24rem 0.44rem;
          }
        }
      }
      .serchBtn{
        padding: 0 0.3rem;
        .btn{
          width: 100%;
          height: 0.9rem;
          background-color: #ffc500;
          border: none;
          text-align: center;
          line-height: 0.9rem;
          color: #333;
          font-size: 20px;
          border-radius: 5px;
        }
      }
    }
    .infoFoot{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      p{
        text-align: center;
        color: #666;
        font-size: 13px;
        margin-bottom: 0.2rem;
      }
      ul{
        padding: 0 0 0.3rem 1.1rem;
        li{
          float: left;
          cursor: pointer;
          margin-right: 0.36rem;
          font-size: 10px;
          color: #b4b4b4;
          line-height: 0.6rem;
          height: 0.6rem;
          cursor:pointer;
          i{
            vertical-align: bottom;
            display: inline-block;
            width: 0.52rem;
            height: 0.6rem;
          }
        }
        li:last-child{
          margin-right: 0;
        }
        li.ser{
          i{
            background: url('./icon_24xiaoshi.png') no-repeat center center;
            background-size: 50%;
          }
        }
        li.online{
          i{
            background: url('./icon_wangluo.png') no-repeat center center;
            background-size: 50%;
          }
        }
        li.safe{
          i{
            background: url('./icon_anquan.png') no-repeat center center;
            background-size: 50%;
          }
        }
      }
    }
  }
  .foot{
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1rem;
    width: 100%;
    background-color: white;
    ul{
      li{
        i{
          display: inline-block;
          width: 0.48rem;
          margin-top:0.16rem;
          height: 0.3rem;
        }
        div{
          height: 0.4rem;
          font-size: 10px;
          font-weight: 900;
          color: #333;
        }
        width: 33.333%;
        height: 1rem;
        text-align: center;
      }
      li.active{
        div{
          color:#ff0000;
        }
      }
      li.schedule{
        i{
          background: url('./icon_fangche_hei.png') no-repeat center center;
          background-size: 100%;
        }
      }
      li.rate{
        i{
          background: url('./icon_zhangpeng_hei.png') no-repeat center center;
          background-size: 100%;
        }
      }
      li.order{
        i{
          width: 0.26rem;
          height: 0.31rem;
          background: url('./icon_dingdan_hei.png') no-repeat center center;
          background-size: 100%;
        }
      }

      li.schedule.active{
        i{
          background: url('./icon_fangche.png') no-repeat center center;
          background-size: 100%;
        }
      }
      li.rate.active{
        i{
          background: url('./icon_zhangpeng.png') no-repeat center center;
          background-size: 100%;
        }
      }
      li.order.active{
        i{
          width: 0.26rem;
          height: 0.31rem;
          background: url('./icon_dingdan.png') no-repeat center center;
          background-size: 100%;
        }
      }
    }
  }
  .typeSelet{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 100;
    .typeSeletContainer{
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: white;
      width: 100%;
      h3{
        padding: 0.4rem 0 0.65rem 0.2rem;
        color: #333;
        font-size: 15px;
        font-weight: 900;
      }
      ul{
        padding: 0 0.2rem;
        li{
          line-height: 0.76rem;
          text-align: center;
          font-weight: 900;
          color: #999;
          border-top: 1px solid #c8c8c8;
        }
        li.active{
          color: #333;
        }
      }
      .check{
        button{
          width: 50%;
          float: left;
          border: none;
          height: 0.8rem;
          line-height: 0.8rem;
          text-align: center;
          color: #333;
          border-top: 1px solid #c8c8c8;
        }
        .cancel{
          background-color: white;
        }
        .sure{
          background-color: #FFc300;
        }
      }
    }
  }
}
</style>
