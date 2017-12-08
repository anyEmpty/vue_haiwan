<template>
  <div class="reserveList">
    <CheckTime :startValue="startValue" :endValue="endValue" :key="Date.now()" :changeUpData="changeUpData" ref="CheckTime"></CheckTime>
    <ul class="tab">
      <li v-for="(item, index) in buYtyoe" :class="{active: type === index}" @click.stop.prevent="_typeClick(index)">
        {{item | typeName}}
      </li>
    </ul>
    <div class="container" ref="container">
      <div class="bgImage" v-show="noDataFlag">
        <img src="../../common/images/image_kong.png" height="154" width="195" alt="">
      </div>
      <div class="wrapperContainer" ref="dataWrapper">
        <div class="upData">
          <i class="icon"></i>释放刷新数据！！！！
        </div>
        <ul class="dataWrapper" id="dataWrapper" v-show="!noDataFlag">
          <li v-for="item in dataList">
            <router-link :to="{ path: '/reserveDetail',query:{productId: item.productId, startValue: item.orderDateIn, endValue: item.orderDateOut, residualQuantity: item.residualQuantity}}">
              <div class="imgWrapper">
                <img v-lazyload="item.productPic" alt="">
              </div>
              <div class="server clearfix">
                <span v-for="service in item.servicesList">
                  {{service}}
                </span>
              </div>
              <div class="addres clearfix">
                {{item.productAddress}}
                {{item.productType}}
                <span class="fr">{{item.residualQuantity}}间</span>
              </div>
              <div class="type clearfix">
                <span class="fl">{{item.productName}}</span>
                <span class="fr">
                  <i>&yen;</i>
                  <span class="money">{{item.productPrice}}</span>起
                </span>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <NoMoreData v-show="noMoreDataFlag"></NoMoreData>
  </div>
</template>

<script>
import Loading from '../../components/Loading'
import NoMoreData from '../../components/NoMoreData'
import CheckTime from '../../components/checkTime'
import { mapGetters } from 'vuex'
const SUCCESS_DATA = '0000'
export default {
  name: 'reserveList',
  computed: {
    ...mapGetters({
      num: 'num'
    })
  },
  filters: {
    // 产品类目显示过滤
    typeName (value) {
      if (value.typeName) {
        return value.typeName
      } else if (value.serviceName) {
        return value.serviceName
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      noDataFlag: true,
      dataList: [],
      buYtyoe: [{typeName: ''}],
      page: 1,
      type: 0,
      size: 4,
      hasMoreData: true,
      noMoreDataFlag: false,
      ajaxFlag: true,
      startValue: '',
      endValue: '',
      categoryId: '',
      tabScrollFlag: false
    }
  },
  methods: {
    // 类目点击事件
    _typeClick (index) {
      if (this.type === index) return
      this.type = index
      this.page = 1
      this.tabScrollFlag = true
      this.$nextTick(() => {
        this.$refs.container.scrollTop = 0
        this._getFirstData()
      })
    },
    // 请求接口处理函数
    _resultDeal (data) {
      this.ajaxFlag = true
      this.hasMoreData = !data.isLast
      this.page++
      this.dataList = this.dataList.concat(data.productVOList)
      console.log(data, this.dataList, 'thy')
      if (this.dataList.length > 0) {
        this.noDataFlag = false
      } else {
        this.noDataFlag = true
      }
    },
    // 获取第一页数据
    _getFirstData () {
      this.dataList = []
      this.page = 1
      this.ajaxFlag = false
      let param = {}
      param.page = 1
      param.size = this.size
      param.orderDateIn = this.$refs.CheckTime.startValueAct
      param.orderDateOut = this.$refs.CheckTime.endValueAct
      param.categoryId = this.categoryId
      if (this.buYtyoe[this.type].typeName) {
        param.typeId = this.buYtyoe[this.type].typeId
        param.serviceId = ''
      } else {
        param.serviceId = this.buYtyoe[this.type].serviceId
        param.typeId = ''
      }
      this._$http.post('/haiwan/client/product/findByStartDateOrEndDateOrCategoryIdOrTypeIdOrServiceId', param, res => {
        if (res.code === SUCCESS_DATA) {
          let data = res.data
          this._resultDeal(data)
        }
      }, res => {
      })
    },
    // 子组建选择日期后回掉 x 起始时间 y 结束时间
    changeUpData (x, y) {
      this.startValue = x
      this.endValue = y
      console.log(this)
      this.dataList = []
      this.page = 1
      this.ajaxFlag = false
      let param = {}
      param.page = 1
      param.size = this.size
      param.orderDateIn = this.$refs.CheckTime.startValueAct
      param.orderDateOut = this.$refs.CheckTime.endValueAct
      param.categoryId = this.categoryId
      if (this.buYtyoe[this.type].typeName) {
        param.typeId = this.buYtyoe[this.type].typeId
        param.serviceId = ''
      } else {
        param.serviceId = this.buYtyoe[this.type].serviceId
        param.typeId = ''
      }
      this._$http.post('/haiwan/client/product/findByStartDateOrEndDateOrCategoryIdOrTypeIdOrServiceId', param, res => {
        if (res.code === SUCCESS_DATA) {
          let data = res.data
          this._resultDeal(data)
        }
      }, res => {
      })
    },
    // 更新数据
    _upDataData () {
      this.dataList = []
      this.page = 1
      this.ajaxFlag = false
      let param = {}
      param.page = 1
      param.size = this.size
      param.orderDateIn = this.$refs.CheckTime.startValueAct
      param.orderDateOut = this.$refs.CheckTime.endValueAct
      param.categoryId = this.categoryId
      if (this.buYtyoe[this.type].typeName) {
        param.typeId = this.buYtyoe[this.type].typeId
        param.serviceId = ''
      } else {
        param.serviceId = this.buYtyoe[this.type].serviceId
        param.typeId = ''
      }
      this._$http.post('/haiwan/client/product/findByStartDateOrEndDateOrCategoryIdOrTypeIdOrServiceId', param, res => {
        this.$refs.dataWrapper.style.transition = 'all  0.3s'
        this.$refs.dataWrapper.style.webkitTransition = 'all 0.3s'
        this.$refs.dataWrapper.style.transform = 'translateY(' + 0 + 'px)'
        this.$refs.dataWrapper.style.webkitTransform = 'translateY(' + 0 + 'px)'
        if (res.code === SUCCESS_DATA) {
          let data = res.data
          this._resultDeal(data)
        }
      }, res => {
      })
    },
    // 上拉加载更多函数
    _getMoreData () {
      let param = {}
      param.page = this.page
      param.size = this.size
      param.orderDateIn = this.$refs.CheckTime.startValueAct
      param.orderDateOut = this.$refs.CheckTime.endValueAct
      param.categoryId = this.categoryId
      if (this.buYtyoe[this.type].typeName) {
        param.typeId = this.buYtyoe[this.type].typeId
        param.serviceId = ''
      } else {
        param.serviceId = this.buYtyoe[this.type].serviceId
        param.typeId = ''
      }
      this.ajaxFlag = false
      this._$http.post('/haiwan/client/product/findByStartDateOrEndDateOrCategoryIdOrTypeIdOrServiceId', param, res => {
        if (res.code === SUCCESS_DATA) {
          let data = res.data
          this._resultDeal(data)
        }
      }, res => {
      })
    },
    // 滚动时间
    _scroll () {
      this.$refs.container.addEventListener('scroll', function (e) {
        if (this.tabScrollFlag) {
          this.tabScrollFlag = false
          return ''
        }
        let timer = setTimeout(() => {
          clearTimeout(timer)
          let height = this.$refs.container.offsetHeight
          let wrapperHeight = document.getElementById('dataWrapper').offsetHeight
          if ((wrapperHeight - (this.$refs.container.scrollTop + height)) <= 20) {
            if (this.hasMoreData) {
              if (this.ajaxFlag) {
                this._getMoreData()
              }
            } else {
              // debugger
              this.noMoreDataFlag = true
              let timer = setTimeout(() => {
                this.noMoreDataFlag = false
                clearTimeout(timer)
              }, 1000)
            }
          }
        }, 200)
      }.bind(this))
    },
    // 下拉刷新
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
        // 比较重要
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
  components: {
    Loading,
    NoMoreData,
    CheckTime
  },
  activated () {
    this.startValue = this.$route.query.startValue
    this.endValue = this.$route.query.endValue
    this.categoryId = this.$route.query.categoryId
    // 获取当前类目
    let param = {}
    param.categoryId = this.$route.query.categoryId
    this._$http.post('/haiwan/client/product/queryType', param, res => {
      if (res.code === SUCCESS_DATA) {
        this.buYtyoe = []
        this.buYtyoe = this.buYtyoe.concat(res.data.type, res.data.service)
        this.$nextTick(() => {
          this._getFirstData()
        })
      }
    })
    this.$nextTick(() => {
      this._scroll()
      this._pull()
    })
  },
  created () {
    this.startValue = this.$route.query.startValue
    this.endValue = this.$route.query.endValue
    this.categoryId = this.$route.query.categoryId
    // 获取当前类目
    let param = {}
    param.categoryId = this.$route.query.categoryId
    this._$http.post('/haiwan/client/product/queryType', param, res => {
      if (res.code === SUCCESS_DATA) {
        this.buYtyoe = []
        this.buYtyoe = this.buYtyoe.concat(res.data.type, res.data.service)
        this.$nextTick(() => {
          this._getFirstData()
        })
      }
    })
    this.$nextTick(() => {
      this._scroll()
      this._pull()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
  .reserveList{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .tab{
      display: flex;
      padding-bottom: 0.2rem;
      background-color: #E4E4E4;
      overflow: auto;
      li{
        flex: 0 0 1.4rem;
        text-align: center;
        line-height: 0.88rem;
        height: 0.88rem;
        font-size: 15px;
        font-weight: 900;
        border-top: 1px solid #e0e0e0;
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
      position: absolute;
      top: 1.9rem;
      left: 0;
      bottom: 0;
      width: 100%;
      overflow: auto;
      .bgImage{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
      .wrapperContainer{
        position: relative;
        .upData{
          position: absolute;
          width: 100%;
          height: 0.8rem;
          // line-height: 0.8rem;
          // text-align: center;
          color: red;
          top: -0.8rem;
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
        .dataWrapper {
          li{
            background-color: white;
            padding: 0.18rem 0.2rem 0 0.2rem;
            .imgWrapper{
              height: 2.75rem;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              img{
                display: block;
                width: 100%;
              }
            }
            .server{
              margin-top: 0.24rem;
              span{
                float: left;
                width: 0.8rem;
                height: 0.26rem;
                text-align: center;
                line-height: 0.26rem;
                display: inline-block;
                border-radius: 0.1rem;
                border: 1px solid #666;
                font-size: 12px;
                margin-right: 0.2rem;
                color: #666;
              }
            }
            .addres{
              margin-top: 0.18rem;
              font-size: 13px;
              color: #666;
            }
            .type{
              margin-top: 0.15rem;
              margin-bottom: 0.12rem;
              .fl{
                font-size: 15px;
                color: #333;
              }
              .fr{
                color: #666;
                font-size: 16px;
                i{
                  font-size: 14px;
                  color: #FE0000;
                  font-weight: 900;
                }
                .money{
                  color: #FE0000;
                  font-weight: 900;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
