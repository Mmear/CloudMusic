<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <i class="iconfont icon-play"></i>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-text-dark;
  margin-top: 60px;
}
</style>
