<!-- subTab 组件 -->
<template>
  <div class="cp-sub-tab flex justify-around">
    <!-- 推荐 -->
    <router-link tag="div" class="tab tab-user-zone" :to="{name: 'indexMusic'}">
      <span class="tab-link">推荐</span>
    </router-link>
    <!-- 电台 -->
    <router-link tag="div" class="tab tab-music-index" :to="{name: 'indexRadio'}">
      <span class="tab-link">电台</span>
    </router-link>
    <!-- 好友 -->
    <router-link tag="div" class="tab tab-music-index" :to="{name: 'userZone'}">
      <span class="tab-link">好友</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "cpSubTab",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.cp-sub-tab {
  padding: 10px 0;
  font-size: $font-size-m;
}
.tab {
  color: $color-text-t-2;
  .tab-link {
    transition: border 0.2s ease;
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


