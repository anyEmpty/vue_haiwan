<template>
  <div class="loading">
  	<img src="./jiazai.gif" height="38" width="38" alt="">
  </div>
</template>

<script>

export default {
  name: 'loading',
  methods: {
  },
  data () {
    return {
      msg: '加载中......'
    }
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.loading{
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
	text-align: center;
	color: red;
  width: 1rem;
  height: 1rem;
  img{
    width: 100%;
    display: block;
  }
}
</style>
