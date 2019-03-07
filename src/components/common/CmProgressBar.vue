<!-- 歌曲详情页进度条组件 -->
<template>
  <div ref="bar" class="cm-pro-bar" @click.stop="progressClick">
    <div class="bar-wrapper">
      <!-- 进度条 -->
      <div ref="barRod" class="bar-rod" :style="{width: curPos}"></div>
      <!-- 进度球 -->
      <div
        ref="barBall"
        class="bar-ball-wrapper"
        @touchstart.prevent="ballStart"
        @touchmove.prevent="ballMove"
        @touchend="ballEnd"
        :style="{transform: `translateX(${curPos})`}"
      >
        <div class="bar-ball"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: {
    percent: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      touch: {
        init: false, // touch开始
        startX: null, // 开始位置
        left: null, // 偏移位置
        finalPos: null
      },
      wrapperWidth: 1
    };
  },
  computed: {
    ...mapState(["expandPlayer"]),
    curPos() {
      // 若不处于触碰事件 或 第一次触碰（touchStart）时
      if (!this.touch.init || !this.touch.finalPos) {
        return (this.percent / 100) * this.wrapperWidth + "px";
      } else {
        return this.touch.finalPos;
      }
    }
  },
  methods: {
    // ...mapActions([]),
    progressClick(e) {
      const barLeft = this.$refs.bar.getBoundingClientRect().left;
      const posX = e.pageX - barLeft;
      this._move(posX);
      this._percentChange();
    },
    ballStart(e) {
      console.log("touch start");
      this.touch.init = true;
      this.touch.startX = e.touches[0].pageX; // e.touch 返回一个触碰列表
      this.touch.left = this.$refs.barRod.clientWidth;
    },
    ballMove(e) {
      if (!this.touch.init) {
        return;
      }
      // 手指滑动的差值
      const deltaX = e.touches[0].pageX - this.touch.startX;
      // 小球与进度条随之变化
      // 最终得到的位置值
      const finalPos = this.touch.left + deltaX;
      this.touch.finalPos = finalPos;
      this._move(finalPos);
    },
    ballEnd(e) {
      // 先提交更改
      this._percentChange();
      // 在父组件更新percent值后再停止touch事件
      // 一个nextTick周期还是会出现左右闪动的情况
      setTimeout(() => {
        this.touch.init = false;
      }, 34); // 浏览器的一次渲染时间约为17ms
    },
    _move(offset) {
      console.log("moving..", offset);
      // 检查左右边界
      const boundryRight = this.$refs.bar.clientLeft + this.$refs.bar.clientWidth;
      const boundryLeft = this.$refs.bar.clientLeft;
      offset =
        offset > boundryRight
          ? boundryRight
          : offset < boundryLeft
          ? boundryLeft
          : offset;
      this.$refs.barBall.style["tranform"] = `translateX(${offset}px)`;
      this.$refs.barBall.style["webkitTransform"] = `translateX(${offset}px)`;
      this.$refs.barRod.style.width = `${offset}px`;
    },
    _percentChange() {
      const newPercent =
        this.$refs.barRod.style.width.slice(0, -2) / this.wrapperWidth;
      this.$emit("percentChange", newPercent);
    }
  },
  watch: {
    expandPlayer(newVal) {
      if (newVal) {
        this.wrapperWidth = this.$refs.bar.clientWidth;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.cm-pro-bar {
  opacity: 0.5;
  .bar-wrapper {
    position: relative;
    background-color: $color-text-light;
    .bar-rod {
      height: 3px;
      max-width: 100%;
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
