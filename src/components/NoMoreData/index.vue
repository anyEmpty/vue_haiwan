<template>
  <div class="noMoreData">
  	{{msg}}
  </div>
</template>

<script>

export default {
  name: 'noMoreData',
  methods: {
  },
  data () {
    return {
      msg: '没有更多数据啦！！！！'
    }
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.noMoreData{
	position: fixed;
	left: 50%;
  width: 60%;
	bottom: 0.8rem;
	transform: translateX(-50%);
	text-align: center;
	color: white;
  background-color: black;
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 14px;
  opacity: 0.5;
  border-radius: 5px;
}
</style>
