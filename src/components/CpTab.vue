<!-- tab切换组件 -->
<template>
  <div class="cm-tab flex justify-around">
    <!-- 用户中心标签 -->
    <router-link tag="div" class="tab-item" :to="{name: 'userZone'}">
      <span class="tab-link">
        <i class="iconfont icon-note"></i>
      </span>
    </router-link>
    <!-- 音乐首页标签 -->
    <router-link tag="div" class="tab-item" :to="{path: '/index'}">
      <span class="tab-link">
        <i class="iconfont icon-music-intro"></i>
      </span>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.cm-tab {
  padding: 10px 0;
}
.tab-item {
  color: $color-text-t-2;
  .tab-link {
    transition: border .2s ease;
    border-bottom: 2px solid $color-bg-d;
  }
  &.router-link-active {
    .tab-link {
      color: $color-theme;
      border-bottom: 2px solid $color-theme;
    }
  }
}
</style>


