<!-- 播放列表组件 -->
<template>
  <transition name="playlist">
    <div class="cp-playlist flex flex-column" @click="$emit('close')">
      <div class="content-container flex flex-column">
        <!-- 头部操作区域 -->
        <header class="list-header">
          <span class="icon-wrapper" @click.stop="changeMode">
            <i class="iconfont" :class="modeIcon"></i>
            <span>{{modeText}} ({{playlist.length}})</span>
          </span>
          <span class="icon-wrapper">
            <i class="iconfont icon-favorite"></i>
            收藏全部
          </span>
          <span class="icon-wrapper" @click.stop="emptyPlaylist">
            <i class="iconfont icon-delete"></i>
          </span>
        </header>
        <divider :height="2"></divider>
        <!-- 播放列表滚动区域 -->
        <div class="list-wrapper">
          <list-scroll class="list-pane">
            <div class="playlist-wrapper">
              <div 
                class="playlist-item flex" 
                v-for="(item, index) in playlist" 
                :key="index"
                @click.stop="setCurrentIndex(index)"
                >
                <div class="item-content flex">
                  <span class="item-name">
                    <span v-show="currentIndex === index" style="font-size: 16px;">
                      <i class="iconfont icon-note"></i>
                    </span>
                    {{item.name}} -
                    <span
                      class="item-artists"
                    >{{artistFormatter(item.artists)}}</span>
                  </span>
                  <!-- 删除歌曲 -->
                  <span class="delete-item" @click.stop="deleteSong({id: item.id, index})">
                    <i class="iconfont icon-close"></i>
                  </span>
                </div>
                <div class="divider">
                  <divider :height="2"></divider>
                </div>
              </div>
            </div>
          </list-scroll>
        </div>
      </div>
      <!-- 删除操作提示窗 -->
      <confirm-window></confirm-window>
    </div>
  </transition>
</template>

<script>
import confirmWindow from "@/components/common/CmConfirm";
import listScroll from "@/components/common/CmScroll";
import divider from "@/components/common/CmDivider";
import { mapState, mapActions, mapMutations } from "vuex";
import { PLAY_MODE } from "@/store/state";
export default {
  props: {},
  data() {
    return {};
  },
  components: {
    confirmWindow,
    listScroll,
    divider
  },
  methods: {
    changeMode() {
      let result =
        this.mode === PLAY_MODE.LOOP
          ? PLAY_MODE.RANDOM
          : this.mode === PLAY_MODE.RANDOM
          ? PLAY_MODE.LISTLOOP
          : PLAY_MODE.LOOP;
      this.setMode(result);
    },
    emptyPlaylist() {
      this.$emit('cleanout');
      this.removeAllSongs();
      this.$emit('close');
    },
    deleteSong(payload) {
      this.$emit('delete', payload);
    },
    artistFormatter(artists) {
      return artists.map(art => art.name).join(" / ");
    },
    ...mapActions(['removeAllSongs']),
    ...mapMutations(['setMode', 'setPlayingStatus', "setCurrentIndex"])
  },
  computed: {
    modeText() {
      let modeText = "";
      switch (this.mode) {
        case PLAY_MODE.LOOP:
          modeText = "单曲循环";
          break;
        case PLAY_MODE.RANDOM:
          modeText = "随机播放";
          break;
        case PLAY_MODE.LISTLOOP:
          modeText = "列表循环";
      }
      return modeText;
    },
    modeIcon() {
      let iconCls = "";
      switch (this.mode) {
        case PLAY_MODE.LOOP:
          iconCls = "icon-loop-single";
          break;
        case PLAY_MODE.RANDOM:
          iconCls = "icon-play-random";
          break;
        case PLAY_MODE.LISTLOOP:
          iconCls = "icon-loop-list";
      }
      return iconCls;
    },
    ...mapState(["playlist", "mode", "currentIndex"])
  }
};
</script>
<style lang="scss" scoped>
.cp-playlist {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  justify-content: flex-end;
  color: $color-text-light;
  font-size: $font-size-m;
  background-color: rgba(40, 40, 40, 0.5);
  &.playlist-enter-active,
  &.playlist-leave-active {
    transition: opacity 0.3s;
    .content-container {
      transition: all 0.3s;
    }
  }
  &.playlist-enter,
  &.playlist-leave-to {
    opacity: 0;
    .content-container {
      transform: translateY(100%);
    }
  }
  .content-container {
    height: 50%;
    padding: 0 5px;
    background-color: $color-theme;
    border-radius: 10px 10px 0 0;
    .list-header {
      padding: 15px 0;
      display: grid;
      grid-template-columns: 8fr 3fr 1fr;
      text-align: right;
      .icon-wrapper {
        color: $color-text-light;
        &:nth-child(1) {
          text-align: left;
        }
      }
    }
    .list-wrapper {
      flex-grow: 1;
      position: relative;
      .list-pane {
        position: absolute;
        height: 100%;
        width: 100%;
        overflow: hidden;
        .playlist-wrapper {
          .playlist-item {
            width: 100%;
            position: relative;
            flex-wrap: wrap;
            .item-content {
              flex-grow: 1;
              padding: 10px 0;
              justify-content: space-between;
              .item-name {
                padding: 0 2px;
                display: inline-block;
                width: 80%;
                @include no-wrap();
                .item-artists {
                  display: inline-block;
                  @include no-wrap();
                  padding: 0 2px;
                  font-size: $font-size-s;
                  color: $color-text-t-1;
                }
              }
              .delete-item {
                position: absolute;
                right: 0;
                height: 10px;
                margin: auto 0;
              }
            }
            .divider {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
