<template>
  <div class="orderList">
    <alert v-model="alertShow" title="提示" :content="alertContent"></alert>
    <confirm v-model="ConfirmShowFlag"
    title="提示"
    @on-cancel="_onCancel"
    @on-confirm="_onConfirm">
      <p style="text-align:center; color:red;">{{ConfirmText}}</p>
    </confirm>
    <ul class="tab">
      <li :class="{active: type === 'null'}" @click.stop.prevent='_typeClick("null", 1)'>全部</li>
      <li :class="{active: type === '0'}" @click.stop.prevent='_typeClick("0", 2)'>待付款</li>
      <li :class="{active: type === '3'}" @click.stop.prevent='_typeClick("3", 3)'>已付款</li>
      <li :class="{active: type === '4'}" @click.stop.prevent='_typeClick("4", 4)'>已完成</li>
      <li :class="{active: type === '7'}" @click.stop.prevent='_typeClick("7", 5)'>退款</li>
    </ul>
    <div class="container" ref="container">
      <div class="bgImage" v-show="noDataFlag">
        <img src="../../common/images/image_kong.png" height="154" width="195" alt="">
      </div>
      <ul ref="dataWrapper" id="dataWrapper">
        <div class="upData">
          <i class="icon"></i>释放刷新数据！！！！
        </div>
        <li v-for="(item, index) in dataList[valueType - 1]" >
          <router-link :to="{ path: '/orderDetails',query:{orderId: item.orderId}}">
            <div class="timerDec" v-if="item.orderStatus === '新订单'">
              <TimeDown :startPropsTimer="item.orderDate" :dataList="dataList[valueType - 1]" :index="index"></TimeDown>
            </div>
            <div class="wrapper">
              <div class="imgWrapper">
                <img :src="item.productPic" alt="">
              </div>
              <div class="warpperContent">
                <p class="clearfix type">
                  <span class="fl">{{item.productName}}</span>
                  <span class="fr">{{item.orderStatus}}</span>
                </p>
                <p class="num">
                  <span>{{item.productType}}</span>
                  <span class="allNum">数量: {{item.orderCount}}</span>
                </p>
                <p class="money"><span>&yen;</span>{{item.orderAmount}}</p>
                <div class="action clearfix" v-show="item.orderStatus === '新订单'">
                  <router-link :to="{path: '/pay', query: {orderId: item.orderId, price: item.orderAmount}}">
                    <button class="pay fr">支付</button>
                  </router-link>
                  <button class="del fr" @click.stop.prevent="_del(index, item.orderId)">删除</button>
                </div>
                <div class="action clearfix" v-show="item.orderStatus === '待使用'">
                  <button class="del fr return" @click.stop.prevent="_return(index, item.orderId)">退款</button>
                </div>
              </div>
            </div>
            <div class="finish" v-if="item.orderStatus === '已完成'"></div>
          </router-link>
        </li>
      </ul>
    </div>
    <NoMoreData v-show="noMoreDataFlag"></NoMoreData>
  </div>
</template>

<script>
import TimeDown from '../../components/timerDown'
import Loading from '../../components/Loading'
import NoMoreData from '../../components/NoMoreData'
import { Alert, Confirm } from 'vux'
const CODE_SUCCESS = '0000'
export default {
  name: 'orderList',
  data () {
    return {
      ConfirmShowFlag: false,
      ConfirmText: '确定删除吗',
      alertShow: false,
      alertContent: '已经是最大可预定房间了！',
      noDataFlag: true,
      dataList: [],
      page: 1,
      type: 'null', // 请求类型索引
      hasMoreData: [],
      noMoreDataFlag: false,
      ajaxFlag: true,
      tabScrollFlag: false,
      pageSize: 10,
      valueType: 1, // 存储索引
      dealIndex: 0, // 操作索引
      dealOrderId: 0, // 操作id
      dealType: 0 // 操作类型 1 取消 2 退款
    }
  },
  computed: {
  },
  methods: {
    _onCancel () {
      this.dealIndex = 0
      this.dealOrderId = 0
      this.dealType = 0
      this.ConfirmShowFlag = false
    },
    _onConfirm () {
      switch (this.dealType) {
        case 1 :
          this.dataList[this.valueType - 1].splice(this.dealIndex, 1)
          // 取消订单
          let param = {}
          param.orderId = this.dealOrderId
          this._$http.post('/haiwan/client/order/cancel', param, res => {
            if (res.code === CODE_SUCCESS) {
              // 成功
              this.alertContent = res.msg
              this.alertShow = true
            }
          })
          return ''
        case 2 :
          // 退款
          this._$http.get('/haiwan/pay/refund?orderId=' + this.dealOrderId, res => {
            if (res.code === CODE_SUCCESS) {
              this.dataList[this.valueType - 1].splice(this.dealIndex, 1)
              // 成功
              this.alertContent = res.msg
              this.alertShow = true
            } else {
              this.alertContent = res.msg
              this.alertShow = true
            }
          })
          return ''
      }
    },
    _return (index, orderId) {
      this.ConfirmText = '确定退款吗！'
      this.dealIndex = index
      this.dealOrderId = orderId
      this.dealType = 2
      this.ConfirmShowFlag = true
    },
    _del (index, orderId) {
      this.ConfirmText = '确定删除吗！'
      this.dealIndex = index
      this.dealOrderId = orderId
      this.dealType = 1
      this.ConfirmShowFlag = true
    },
    // 订单状态点击
    _typeClick (index, saveindex) {
      if (index === this.type) return
      this.tabScrollFlag = true
      this.type = index
      this.valueType = saveindex
      this.page = 1
      if (!this.dataList[this.valueType - 1]) {
        this.$set(this.dataList, this.valueType - 1, [])
        this.noDataFlag = true
      }
      if (this.dataList[this.valueType - 1].length > 0) {
        this.noDataFlag = false
        this.page = Math.ceil(Number(this.dataList[this.valueType - 1].length) / Number(this.pageSize)) + 1
        return
      }
      this.$nextTick(() => {
        this.$refs.container.scrollTop = 0
        this._getFirstData()
      })
    },
    // 请求处理函数
    _resultDeal (data) {
      this.ajaxFlag = true
      this.hasMoreData[this.valueType - 1] = !data.isLast
      this.page++
      this.$nextTick(() => {
        if (!this.dataList[this.valueType - 1]) {
          this.$set(this.dataList, this.valueType - 1, [])
        }
        this.$set(this.dataList, this.valueType - 1, this.dataList[this.valueType - 1].concat(data.orderVOList))
        if (this.dataList[this.valueType - 1].length > 0) {
          this.noDataFlag = false
        } else {
          this.noDataFlag = true
        }
      })
    },
    // 获取第一页数据
    _getFirstData () {
      this.ajaxFlag = false
      this.page = 1
      let param = {}
      param.page = 1
      param.size = this.pageSize
      param.status = this.type
      param.buyerId = JSON.parse(window.localStorage.getItem('buyerId'))
      // debugger
      console.log(param, JSON.parse(window.localStorage.getItem('buyerId')), 'who why')
      this._$http.post('/haiwan/client/order/queryOrder', param, res => {
        if (res.code === CODE_SUCCESS) {
          let data = res.data
          this._resultDeal(data)
        } else {
          this.alertContent = res.msg
          this.alertShow = true
        }
      })
    },
    // 获取更多数据函数
    _getMoreData () {
      this.ajaxFlag = false
      let param = {}
      param.page = this.page
      param.size = this.pageSize
      param.status = this.type
      param.buyerId = JSON.parse(window.localStorage.getItem('buyerId'))
      this._$http.post('/haiwan/client/order/queryOrder', param, res => {
        if (res.code === CODE_SUCCESS) {
          let data = res.data
          this._resultDeal(data)
        }
      })
    },
    // 滚动函数
    _scroll () {
      this.$refs.container.addEventListener('scroll', function () {
        if (this.tabScrollFlag) {
          this.tabScrollFlag = false
          return ''
        }
        if (!this.tabScrollFlag) {
          let timer = setTimeout(() => {
            clearTimeout(timer)
            let height = this.$refs.container.offsetHeight
            let wrapperHeight = document.getElementById('dataWrapper').offsetHeight
            if ((wrapperHeight - (this.$refs.container.scrollTop + height)) <= 20) {
              if (this.hasMoreData[this.valueType - 1]) {
                // debugger
                if (this.ajaxFlag) {
                  this._getMoreData()
                }
              } else {
                this.noMoreDataFlag = true
                let timer = setTimeout(() => {
                  this.noMoreDataFlag = false
                  clearTimeout(timer)
                }, 1000)
              }
            }
          }, 200)
        }
      }.bind(this))
    },
    // 更新数据函数
    _upDataData () {
      this.ajaxFlag = false
      this.page = 1
      let param = {}
      param.page = 1
      param.size = this.pageSize
      param.status = this.type
      param.buyerId = JSON.parse(window.localStorage.getItem('buyerId'))
      this._$http.post('/haiwan/client/order/queryOrder', param, res => {
        this.$refs.dataWrapper.style.transition = 'all  0.3s'
        this.$refs.dataWrapper.style.webkitTransition = 'all 0.3s'
        this.$refs.dataWrapper.style.transform = 'translateY(' + 0 + 'px)'
        this.$refs.dataWrapper.style.webkitTransform = 'translateY(' + 0 + 'px)'
        if (res.code === CODE_SUCCESS) {
          let data = res.data
          this.ajaxFlag = true
          this.hasMoreData[this.valueType - 1] = !data.isLast
          this.page++
          this.$nextTick(() => {
            if (!this.dataList[this.valueType - 1]) {
              this.$set(this.dataList, this.valueType - 1, [])
            }
            this.$set(this.dataList, this.valueType - 1, data.orderVOList)
            if (this.dataList[this.valueType - 1].length > 0) {
              this.noDataFlag = false
            } else {
              this.noDataFlag = true
            }
          })
        }
      })
    },
    // 下拉函数
    _pull () {
      let startY = 0
      let startX = 0
      let distancex = 0
      let distancey = 0
      let isMove = false
      this.$refs.dataWrapper.addEventListener('touchstart', function (e) {
        startY = e.touches[0].clientY
        startX = e.touches[0].clientX
      })
      this.$refs.dataWrapper.addEventListener('touchmove', (e) => {
        distancex = e.touches[0].clientX - startX
        distancey = e.touches[0].clientY - startY
        if ((Math.abs(distancex) < Math.abs(distancey)) && (Number(this.$refs.container.scrollTop) <= 20) && distancey > 0) {
          e.preventDefault()
          isMove = true
          distancey = Math.abs(distancey) > 40 ? 40 : Math.abs(distancey)
          this.$refs.dataWrapper.style.transform = 'translateY(' + distancey + 'px)'
          this.$refs.dataWrapper.style.webkitTransform = 'translateY(' + distancey + 'px)'
        }
      })
      this.$refs.dataWrapper.addEventListener('touchend', function (e) {
        if (distancey === 40 && isMove && Number(this.$refs.container.scrollTop) <= 20) {
          this._upDataData()
        } else {
          this.$refs.dataWrapper.style.transition = 'all  0.3s'
          this.$refs.dataWrapper.style.webkitTransition = 'all 0.3'
          this.$refs.dataWrapper.style.transform = 'translateY(' + 0 + 'px)'
          this.$refs.dataWrapper.style.webkitTransform = 'translateY(' + 0 + 'px)'
        }

        startY = 0
        startX = 0
        distancex = 0
        distancey = 0
        isMove = false
      }.bind(this))
    }
  },
  created () {
    this._getFirstData()
    this.$nextTick(() => {
      this._scroll()
      this._pull()
    })
  },
  components: {
    TimeDown,
    Loading,
    NoMoreData,
    Alert,
    Confirm
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.orderList{
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  overflow: hidden;
  background-color: #f4f4f4;
  .tab{
    display: flex;
    background-color: #E4E4E4;
    li{
      flex: 1;
      text-align: center;
      line-height: 0.88rem;
      height: 0.88rem;
      font-size: 15px;
      font-weight: 900;
      border-right: 1px solid #e0e0e0;
      border-bottom: 2px solid white;
      background-color: white;
    }
    li:last-child{
      border-right:none;
    }
    li.active{
      color: #ffc300;
      border-bottom-color: #ffc300;
    }
  }
  .container{
    padding: 0.1rem 0.2rem 0.2rem 0.2rem;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    top: 0.91rem;
    bottom: 0;
    overflow: auto;
    // background-color: white;
    .bgImage{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
    ul{
      position: relative;
      .upData{
          position: absolute;
          width: 100%;
          height: 0.8rem;
          // line-height: 0.8rem;
          // text-align: center;
          color: red;
          top: -1.1rem;
          vertical-align: bottom;
          background-color: #f4f4f4;
          color: black;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon{
            display: inline-block;
            width: 0.8rem;
            height: 0.8rem;
            background: url('../../common/images/jiazai.gif') center center no-repeat;
            background-size: 50%;
          }
      }
      li{
        background-color: white;
        margin-top: 0.2rem;
        position: relative;
        .finish{
          position: absolute;
          width: 1.6rem;
          height: 1.48rem;
          background: url('../../common/images/icon_yishiyong.png') center center no-repeat;
          background-size: 50%;
          right: 0;
          bottom: 0;
        }
        .timerDec{
          padding-left: 0.2rem;
          line-height: 0.6rem;
          background-color: #fef7db;
          font-size: 12px;
          color: #333;
        }
        .wrapper{
          padding: 0.2rem 0.2rem 0 0.2rem;
          box-sizing: border-box;
          display: flex;
          .imgWrapper{
            flex: 0 0 1.96rem;
            width: 1.96rem;
            height: 1.60rem;
            margin-right: 0.2rem;
            img{
              display: block;
              width: 100%;
            }
          }
        }
        .warpperContent{
          flex: 1;
          padding-bottom: 0.2rem;
          .type{
            padding-top: 0.2rem;
            font-weight: 900;
            .fl{
              font-size: 12px;
              color: #333;
            }
            .fr{
              font-size: 13px;
              color: #ffa25f;
            }
          }
          .num{
            padding-top: 0.2rem;
            font-size: 10px;
            color: #666;
            .allNum{
              margin-left: 0.3rem;
            }
          }
          .money{
            padding-top: 0.2rem;
            color: #ff0000;
            font-size: 16px;
            font-weight: 900;
            span{
              font-size: 14px;
            }
          }
          .action{
            button{
              border: none;
              font-size: 13px;
              border-radius: 5px;
              text-align: center;
              height: 0.6rem;
              line-height: 0.6rem;
              width: 1.6rem;
              color: #333;
            }
            .pay{
              background-color: #ffc300;
              margin-left: 0.2rem;
            }
            .del{
              background-color: white;
              border: 1px solid #b4b4b4;
            }
          }
        }
      }
    }
  }
}
</style>
