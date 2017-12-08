<template>
  <div class="sliding">
    <img src="./circles.svg" alt="">
  </div>
</template>

<script>

export default {
  name: 'sliding',
  methods: {
  },
  data () {
    return {
    }
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.sliding{
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: red;
  width: 1.6rem;
  height: 1.6rem;
  // background-color: red;
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    width: 70%;
    display: block;
    background-color: #666;
    border-radius: 50%;
  }
}
</style>
