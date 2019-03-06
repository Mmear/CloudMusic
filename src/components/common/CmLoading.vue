<!-- 加载动画组件 -->
<template>
  <div class="cm-loading">
    <img src="@/assets/img/loading.gif">
    <p class="desc">{{loadingText}}</p>
  </div>
</template>

<script>
export default {
  props: {
    loadingText: {
      type: String,
      default: "加载中"
    }
  }
};
</script>

<style lang="scss" scoped>
.cm-loading {
  width: 100%;
  text-align: center;
  img {
    width: 80%;
  }
  .desc {
    line-height: 20px;
    font-size: $font-size-m;
    color: $color-text-light;
  }
}
</style>
