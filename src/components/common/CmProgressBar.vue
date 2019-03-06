<!-- 歌曲详情页进度条组件 -->
<template>
  <div ref="bar" class="cm-pro-bar" @click.stop="progressClick">
    <div class="bar-wrapper">
      <!-- 进度条 -->
      <div ref="barRod" class="bar-rod" :style="{width: percent + '%'}"></div>
      <!-- 进度球 -->
      <div ref="barBall" class="bar-ball-wrapper"
        @touchstart.prevent=""
        @touchmove.prevent=""
        @touchend=""
        :style="{transform: `translateX(${ballPos})`}"
      >
      <!--         :style="{transfrom: translateX(ballPos)}" -->
        <div class="bar-ball"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
export default {
  props: {
    percent: {
      type: Number,
      default: 50
    },
  },
  data () {
    return {
      wrapperWidth: 0,
    }
  },
  computed: {
    ...mapState(['expandPlayer']),
    ballPos () {
      return (this.percent / 100) * this.wrapperWidth + 'px';
    }
  },
  methods: {
    // ...mapActions([]),
  },
  watch: {
    expandPlayer (newVal) {
      if (newVal) {
        this.wrapperWidth = this.$refs.bar.clientWidth;
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.cm-pro-bar {
  opacity: .5;
  .bar-wrapper {
    position: relative;
    background-color: $color-text-light;
    .bar-rod {
      height: 3px;
      background-color: $color-theme;
    }
    .bar-ball-wrapper {
      position: absolute;
      left: -7.5px;
      top: -6px;
      .bar-ball {
        box-sizing: border-box;
        width: 15px;
        height: 15px;
        background-color: $color-theme;
        border: 4px solid $color-text-t-1;
        border-radius: 50%;
      }
    }
  }
}
</style>
