<!-- 分割线组件 -->
<template>
  <div class="cm-divider">

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
    }
  }
}
</script>

<style scoped>
  .cm-divider {
    height: .5px;
    background-color: rgba(255, 255, 255, .1);
  }
</style>

