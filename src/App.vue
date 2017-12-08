<template>
  <div id="app">
    <Sliding v-show="slidingFlag"></Sliding>
    <transition :name="transitionName">
      <keep-alive :include="/reserveDetails|reserveList/">
          <router-view class="Router"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import Sliding from './components/sliding'
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  computed: {
    ...mapGetters({
      slidingFlag: 'slidingFlag'
    })
  },
  data () {
    return {
      transitionName: 'slide-right'  // 默认动态路由变化为slide-right
    }
  },
  components: {
    Sliding
  },
  watch: {
    $route (to, from) {
      let isBack = this.$router.isBack  //  监听路由变化时的状态为前进还是后退
      if (isBack) {
      // 后退
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    }
  }
}
</script>

<style>
.Router {
  position: absolute;
  width: 100%;
  transition: all .5s ease;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100% 0);
}
.slide-right-enter,
.slide-left-leave-active{
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.slide-right-leave-active,
.slide-left-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100% 0);
}
</style>
