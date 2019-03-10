<template>
  <div id="app" class="flex">
    <!-- 用户信息/操作页 -->
    <div class="user-info drawer"></div>
    <!-- 遮罩层 -->
    <!-- <div class="mask"></div> -->
    <!-- 顶部 -->
    <app-header></app-header>
    <!-- 下方操作区域 -->
    <main class="app-content flex flex-column">
      <keep-alive> 
        <router-view></router-view>
      </keep-alive>
    </main>
    <!-- 播放器 -->
    <app-player></app-player>
    <transition name="slide">
      <router-view name="loginView"></router-view>
    </transition>
    <transition name="slide">
      <router-view name="colView"></router-view>
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
    }
  },
  components: {
    appHeader,
    appPlayer
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
#app {
  height: 100vh;
  flex-direction: column;
  .app-content {
    flex-grow: 1;
  }
  .slide-enter-active, .slide-leave-active {
    transition: .3s all ease;
  }
  .slide-enter, .slide-leave-to {
    transform: translateX(-100%);
  }
}
</style>
