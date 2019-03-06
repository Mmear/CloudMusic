<!-- 分割线组件 -->
<template>
  <div class="cm-divider" :style="{height: height + 'px'}">
  </div>
</template>

<script>
export default {
  props: {
    bold: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    },
    transparent: {
      type: Number,
      default: 1
    },
    height: {
      type: Number,
      default: 0.5
    }
  }
}
</script>

<style scoped>
  .cm-divider {
    background-color: rgba(255, 255, 255, .1);
  }
</style>

