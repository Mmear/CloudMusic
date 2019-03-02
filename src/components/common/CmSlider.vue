<!-- 轮播图组件 -->
<template>
  <div class="cm-slider" ref="slider">
    <!-- 轮播区域 -->
    <div class="slider-wrapper flex" ref="sliderWrapper">
      <slot></slot>
    </div>
    <!-- 轮播点 -->
    <div class="slider-dots">
      <span
        v-for="(num, index) in dots"
        :key="index"
        :class="{active: currentIndex === index}"
        class="slider-dot"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { domUtils } from "@/utils/utils";
export default {
  data() {
    return {
      slider: null, // 轮播组件实例
      timer: null, // 轮播计时器
      imgList: [], // 图片实例
      dots: 0, // 轮播点
      currentIndex: 0 // 当前轮播序号
    };
  },
  props: {
    // 循环播放
    loop: {
      type: Boolean,
      default: true
    },
    // 自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播延时
    delay: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    /**
     * @description 获取轮播区域DOM元素的宽度
     * @param {Boolean} isResize 窗口大小是否改变
     */
    _setSliderWidth (isResize) {
      // 获取图片（slot）
      this.imgList = this.$refs.sliderWrapper.children;
      let width = 0;
      // 获取父元素（轮播组件）的宽度
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.imgList.length; i++) {
        const imgDom = this.imgList[i];
        domUtils.addClass(imgDom, "slider-item");
        imgDom.style.width = `${sliderWidth}px`;
        width += sliderWidth;
      }
      // 显示出循环的效果，如果是窗口调整导致的宽度计算则无需进行（因为已经初始化过了）
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderWrapper.style.width = `${width}px`;
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 水平滚动
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      this.slider.on('scrollEnd', () => {
        let nowIndex = this.slider.getCurrentPage().pageX;
        this.currentIndex = nowIndex;
        if (this.autoPlay) { // 重新设置计时器
          clearTimeout(this.timer);
          this._initPlay();
        }
      })
    },
    // 初始化轮播点
    _initDots () {
      this.dots = this.imgList.length;
    },
    // 自动播放
    _initPlay() {
      this.timer = setTimeout(() => {
        this.slider.next(); // 会触发scrollEnd事件，从而触发循环
      }, this.delay);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      if (this.autoPlay) {
        this._initPlay();
      }
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);
        this.slider.refresh();
      })
    })
  },
  destroyed () {
    clearTimeout(this.timer);
  }
};
</script>

<style lang="scss" scoped>
.cm-slider {
  min-height: 1px;
  position: relative;
  .slider-wrapper {
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      a {
        display: block;
        width: 100%;
        text-decoration: none;
      }
      img {
        display: block;
        max-width: 100%;
      }
    }
  }
  .slider-dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 8px;
    text-align: center;
    .slider-dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $color-text-t-2;
      transition: all 100ms ease;
      &.active {
        width: 16px;
        border-radius: 3px;
        background-color: $color-text-t-3;
      }
    }
  }
}
</style>

