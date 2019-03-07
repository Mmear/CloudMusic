<!-- 播放进度球组件 -->
<template>
  <div class="cm-pro-cir">
    <!-- 通过svg路径动画实现进度球 -->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="circle-background" cx="50" cy="50" r="50" fill="transparent"></circle>
      <circle class="circle-rod" cx="50" cy="50" r="50" fill="transparent" :stroke-dasharray="dasharray" :stroke-dashoffset="getDashoffset"></circle>
    </svg>
    <div class="circle-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 当前的播放进度
    percent: {
      type: Number,
      default: 0.1
    },
    // 半径
    radius: {
      type: Number,
      default: 32
    }
  },
  data () {
    return {
      dasharray: Math.PI * 100,
    }
  },
  computed: {
    getDashoffset () {
      return (100 - this.percent / 100) * this.dasharray;
    }
  }
  
}
</script>

<style lang="scss" scoped>
.cm-pro-cir {
  position: relative;
  svg {
    display: block; // svg为行内元素，会产生幽灵节点撑高盒子
  }
  circle {
    stroke-width: 7px;
    transform-origin: center; // 设置变换中心
    &.circle-background {
      transform: scale(.9);
      stroke: $color-theme-t;
    }
    &.circle-rod {
      transform: scale(.9) rotate(-90deg);
      stroke: #f1f1f1;
    }
  }
  .circle-wrapper {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    .iconfont {
      display: block;
      font-size: 32px;
      opacity: .5;
    }
  }
}
</style>
