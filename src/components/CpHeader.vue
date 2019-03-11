<!-- 应用 header -->
<template>
  <div class="cp-header flex">
    <div class="toggle user-info flex align-center">
      <span><i class="iconfont icon-category"></i></span>
    </div>
    <div class="menu-tab"><menu-tab></menu-tab></div>
    <router-link tag="div" :to="{name: 'search'}" class="toggle search flex align-center">
      <span><i class="iconfont icon-search"></i></span>
    </router-link>
  </div>
</template>

<script>
import menuTab from '@/components/CpTab';

export default {
  name: 'CpHeader',
  components: {
    menuTab
  },
  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>
.cp-header {
  height: 45px;
  font-size: 1.3rem;
  justify-content: space-between;
  padding: 3px 10px;
  color: $color-text-t-2;
  .menu-tab {
    width: 50%;
  }
}
</style>
