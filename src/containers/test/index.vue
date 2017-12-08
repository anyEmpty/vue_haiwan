<template>
  <div class="test">
    <!-- <div id="allmap"></div> -->
    <a href="http://api.map.baidu.com/geocoder?address=上海虹桥机场&output=html" target='_blank'></a>
  </div>
</template>

<script>
// let BMAP_STATUS_SUCCESS = 0
export default {
  name: 'test',
  data () {
    return {
      map: {}
    }
  },
  methods: {
  },
  mounted () {
    // let geolocation = new window.BMap.Geolocation()
    // let x = ''
    // let y = ''
    // var that = this
    // geolocation.getCurrentPosition(function (r) {
    //   x = r.point.lng
    //   y = r.point.lat
    //   console.log('您的位置：' + r.point.lng + ',' + r.point.lat)
    //   console.log('您的位置：' + x + ',' + y)
    //   if (this.getStatus() === 0) {
    //     that.map = new window.BMap.Map('allmap')
    //     that.$nextTick(() => {
    //       var point = new window.BMap.Point(String(x), String(y))
    //       that.map.centerAndZoom(point, 15)
    //       let marker = new window.BMap.Marker(point)
    //       that.map.addOverlay(marker)
    //       that.map.panTo(point)
    //     })
    //     that.map.enableScrollWheelZoom(true)
    //   } else {
    //     console.log('failed' + this.getStatus())
    //   }
    // }, {enableHighAccuracy: true})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.test{
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  #allmap{
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
  }
  a{
    width: 200px;
    height: 200px;
    background-color: red;
    display: inline-block;
  }
}
</style>
