<template>
  <div id="app" class="flex">
    <!-- 用户信息/操作页 -->
    <div class="user-info drawer"></div>
    <!-- 遮罩层 -->
    <!-- <div class="mask"></div> -->
    <!-- 顶部 -->
    <app-header></app-header>
    <!-- 下方操作区域 -->
    <main class="app-content flex">
      <keep-alive> 
        <transition name="slideLeft" mode="out-in">
          <router-view></router-view>
        </transition>
      </keep-alive>
    </main>
    <!-- 播放器 -->
    <app-player></app-player>
    <transition name="slideLeft">
      <router-view name="extraView"></router-view>
      <router-view name="searchView"></router-view>
    </transition>
  </div>
</template>

<script>
import appHeader from '@/components/CpHeader';
import appPlayer from '@/components/CpMusicBar';
export default {
  name: 'app',
  data () {
    return {
      tName: '',
    }
  },
  components: {
    appHeader,
    appPlayer
  },
  methods: {
  },
  watch: {
    // '$route': function(to, from) {
    //   const paths = to.path.split('/');
    //   if (paths.indexOf('music') > 0) {
    //   console.log("music")
    //     this.tName = 'slideLeft';
    //   } else {
    //   console.log("user")
    //     this.tName = 'slideRight';
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
#app {
  height: 100vh;
  flex-direction: column;
  .app-content {
    flex-grow: 1;
    position: relative;
  }
  .slideLeft-enter-active,.slideLeft-leave-active {
    transition: .2s all ease;
  }
  .slideLeft-enter,.slideLeft-leave-to {
    transform: translateX(100%);
  }
}
</style>
