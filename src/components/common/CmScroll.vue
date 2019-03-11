<!-- betterScroll 组件 -->
<template>
  <div ref="wrapper" class="cm-scroll">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  components: {},
  data () {
    return {};
  },
  props: {
    // 传入的数据
    data: {
      type: Array,
      default: null
    },
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 是否开启上拉刷新
    pullup: {
      type: Boolean,
      default: false
    },
    // 滚动前是否触发事件，如：滚动前让输入框失去焦点，避免滚动搜索结果时移动端键盘遮挡
    beforeScroll: {
      type: Boolean,
      default: false
    },
    // 是否水平滚动
    scrollX: {
      type: Boolean,
      default: false
    },
    // 延迟刷新
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  methods: {
    _initScroll() {
      // 避免初始渲染未完成便初始化
      let setting = {
        probeType: this.probeType,
        click: this.click,
      }
      if (!this.$refs.wrapper) {
        return;
      }
      if (this.scrollX) {
        Object.assign(setting, {
          scrollX: true,
          momentum: false,
          snap: {
            threshold: 0.3,
            speed: 400
          }
        })
      }
      this.scroll = new BScroll(this.$refs.wrapper, setting);
      // 派发监听滚动位置事件
      if (this.listenScroll) {
        const me  = this;
        this.scroll.on('scroll', (pos) => {
          // 向父组件传值
          me.$emit('scroll', pos);
        })
      }
      // 派发上拉刷新事件
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            // 滑动到底部
            this.$emit('scrollToEnd');
          }
        })
      }
      // 滚动前是否触发事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll');
        })
      }
    },
    // 对 better-scroll 事件进行代理
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      // ?
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    on() {
      this.scroll && this.scroll.on.apply(this.scroll, arguments);
    },
    getCurrentPage() {
      this.scroll && this.scroll.getCurrentPage.apply(this.scroll, arguments);
    }
  },
  mounted () {
    // 在下一次dom更新时再进行初始化
    this.$nextTick(() => {
      this._initScroll();
    })
    // setTimeout(() => {
    //   this._initScroll()
    // }, 20)
  }
};
</script>
