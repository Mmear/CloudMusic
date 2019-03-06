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
}
</style>
