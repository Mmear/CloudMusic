<!-- 音乐播放器bar -->
<template>
  <div class="cp-musicbar" v-show="playlist.length > 0">
    <!-- mini状态daze -->
    <transition name="mini">
      <div class="mini-player flex justify-between" v-show="!expandPlayer">
        <div class="left-part flex">
          <div class="cover-wrapper">
            <img :src="currentSong.imgUrl">
          </div>
          <div class="song-info flex flex-column justify-center">
            <p class="song-name">{{currentSong.name}}</p>
            <span class="artist">{{_artistFormatter(currentSong.artists)}}</span>
          </div>
        </div>
        <div class="right-part flex flex-center">
          <!-- 进度球 -->
          <pro-circle>
            <i class="iconfont icon-play"></i>
          </pro-circle>
          <!-- 播放列表 -->
          <playlist></playlist>
        </div>
      </div>
    </transition>
    <!-- 完全体状态 -->
    <transition name="normal">
      <div class="normal-player flex flex-column" v-show="expandPlayer">
        <div class="player-background">
          <img :src="currentSong.imgUrl" alt="background image">
        </div>
        <header class="top-area flex">
          <span class="back-btn" @click="hidePlayer">
            <i class="iconfont icon-back"></i>
          </span>
          <div class="song-title">
            <p class="head-title">{{currentSong.name}}</p>
            <p class="sub-title">{{_artistFormatter(currentSong.artists)}}</p>
          </div>
        </header>
        <divider :height="2"></divider>
        <main class="main-area flex flex-center">
          <div class="song-cover-wrapper">
            <img :src="currentSong.imgUrl" alt class="song-cover">
          </div>
        </main>
        <footer class="bottom-area flex flex-column">
          <!-- 收藏，歌曲信息面板等按钮 -->
          <div class="operation-pane flex">
            <i class="iconfont icon-favorites-filling"></i>
            <i class="iconfont icon-download"></i>
            <i class="iconfont icon-category"></i>
            <i class="iconfont icon-share"></i>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper flex flex-center">
            <span class="text time-current">00:00</span>
            <pro-bar></pro-bar>
            <span class="text time-whole">04:21</span>
          </div>
          <!-- 播放器控制按钮 -->
          <div class="manipulate-pane flex">
            <i class="iconfont icon-play-random"></i>
            <i class="iconfont icon-prev-song"></i>
            <i class="iconfont icon-play"></i>
            <i class="iconfont icon-next-song"></i>
            <i class="iconfont icon-music-list"></i>
          </div>
        </footer>
      </div>
    </transition>
    <!-- 播放器 -->
    <audio :src="songUrl"></audio>
  </div>
</template>

<script>
import proCircle from "@/components/common/CmProgressCircle";
import proBar from "@/components/common/CmProgressBar";
import playlist from "@/components/CpPlaylist";
import divider from "@/components/common/CmDivider";
import { mapState, mapActions, mapMutations } from "vuex";
import songApi from "@/api/composionQuery";

//* 导入anime动画库
import Anime from "animejs";
export default {
  data() {
    return {
      songUrl: ""
    };
  },
  computed: {
    ...mapState(["expandPlayer", "playlist", "currentSong", "mode", "playing"])
  },
  methods: {
    test() {
      this.changePlayerStatus();
    },
    // 收起面板
    hidePlayer() {
      this.changePlayerStatus();
    },
    _artistFormatter(artists) {
      return artists.map(art => art.name).join(' / ');
    },
    ...mapMutations(["changePlayerStatus"])
  },
  watch: {
    // 检测currentSong的变化
    currentSong(newVal, oldVal) {
      // 无歌曲播放 || 歌曲相同，退出
      if (!newVal || !newVal.id || oldVal.id === newVal.id) {
        return;
      }
      // console.log('Bar: ' + JSON.stringify(newVal));
    }
  },
  components: {
    proCircle,
    proBar,
    playlist,
    divider
  }
};
</script>

<style lang="scss" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.cp-musicbar {
  .mini-player {
    height: 40px;
    background-color: #2f343b;
    padding: 5px;
    .left-part {
      .cover-wrapper {
        line-height: 0;
        width: 40px;
        img {
          border-radius: 50%;
          width: 100%;
        }
      }
      .song-info {
        padding-left: 10px;
        .song-name {
          font-size: $font-size-m;
          color: $color-text-light;
          padding-bottom: 4px;
        }
        .artist {
          font-size: $font-size-s;
          color: $color-text-t-2;
        }
      }
    }
    .right-part {
      .cm-pro-cir {
        margin: 0 10px;
        color: $color-text-light;
      }
      .cp-playlist {
      }
    }
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.2s;
    }
    &.mini-enter,
    &.mini-leave-to {
      transform: translateY(100%);
    }
  }
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    background-color: $color-bg;
    .player-background {
      position: fixed;
      width: 100%;
      height: 100%;
      filter: blur(20px);
      opacity: 0.2;
      z-index: -1;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top-area {
      align-items: center;
      padding: 15px 0;
      .back-btn {
        font-size: 1.3rem;
        color: $color-text-light;
        padding: 0 10px;
      }
      .song-title {
        .head-title {
          font-size: $font-size-l;
          color: $color-text-light;
          padding-bottom: 3px;
        }
        .sub-title {
          font-size: $font-size-m;
          color: $color-text-t-3;
        }
      }
    }
    .main-area {
      flex-grow: 1;
      .song-cover-wrapper {
        width: 70%;
        margin: 0 auto;
        img {
          border-radius: 50%;
          width: 100%;
          animation: rotate 30s linear infinite;
        }
      }
    }
    .bottom-area {
      .operation-pane {
        justify-content: space-around;
        .iconfont {
          font-size: 1.2rem;
          color: $color-text-light;
          &.icon-favorites-filling {
            color: $color-theme;
          }
        }
      }
      .progress-wrapper {
        margin: 30px 0;
        .text {
          font-size: $font-size-s;
          color: $color-text-t-2;
          padding: 0 10px;
        }
        .cm-pro-bar {
          width: 70%;
        }
      }
      .manipulate-pane {
        justify-content: space-around;
        padding-bottom: 20px;
        .iconfont {
          font-size: 2rem;
          color: $color-text-t-2;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top-area,
      .bottom-area {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      transform: translateX(-100%) translateY(100%) scale(0);
      .bottom-area {
        transform: translateY(100%);
      }
    }
  }
}
</style>
