<!-- 音乐播放器bar -->
<template>
  <div class="cp-musicbar" v-show="playlist.length > 0">
    <!-- mini状态daze -->
    <transition name="mini">
      <div class="mini-player flex justify-between" v-show="!expandPlayer">
        <div class="left-part flex" @click="changePlayerStatus">
          <div class="cover-wrapper">
            <img :class="{paused: !playing, playing: playing}" :src="currentSong.imgUrl">
          </div>
          <div class="song-info flex flex-column justify-center">
            <p class="song-name">{{currentSong.name}}</p>
            <span class="artist">{{artistFormatter(currentSong.artists)}}</span>
          </div>
        </div>
        <div class="right-part flex flex-center">
          <!-- 进度球 -->
          <pro-circle :percent="percent">
            <i
              class="iconfont"
              @click="setPlayingStatus(!playing)"
              :class="{'icon-play': !playing, 'icon-pause': playing}"
            ></i>
          </pro-circle>
          <div class="playlist-switch">
            <i class="iconfont icon-music-list"></i>
          </div>
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
          <!-- 返回按钮 -->
          <span class="back-btn" @click="hidePlayer">
            <i class="iconfont icon-back"></i>
          </span>
          <div class="song-title">
            <p class="head-title no-wrap">{{currentSong.name}}</p>
            <p class="sub-title">{{artistFormatter(currentSong.artists)}}</p>
          </div>
        </header>
        <divider :height="2"></divider>
        <main class="main-area flex flex-center" @touchend="inLyricPage = !inLyricPage">
          <!-- 封面页 -->
          <transition name="fade">
            <div class="song-cover-wrapper" v-show="!inLyricPage">
              <img
                :src="currentSong.imgUrl"
                :class="{paused: !playing, playing: playing}"
                class="song-cover"
              >
            </div>
          </transition>
          <!-- 歌词页 -->
          <transition name="fade">
            <lyric-scroll class="lyric-wrapper" ref="lyricWrapper" v-show="inLyricPage">
              <div class="lyric-pane" ref="lyricPane">
                <p
                  v-for="(line, index) in lyric.lines"
                  :key="index"
                  :class="`lyric-${index}`"
                  class="lyric-item"
                >{{line.txt}}</p>
              </div>
            </lyric-scroll>
          </transition>
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
            <span class="text time-current">{{currentTime | timeParser}}</span>
            <pro-bar :percent="percent" @percentChange="percentChange"></pro-bar>
            <span class="text time-whole">{{duration | timeParser}}</span>
          </div>
          <!-- 播放器控制按钮 -->
          <div class="manipulate-pane flex">
            <i class="iconfont" :class="modeIcon" @click="changeMode"></i>
            <i class="iconfont icon-prev-song" @click="prevSong"></i>
            <i
              class="iconfont"
              :class="{'icon-play': !playing, 'icon-pause': playing}"
              @click="setPlayingStatus(!playing)"
            ></i>
            <i class="iconfont icon-next-song" @click="nextSong"></i>
            <i class="iconfont icon-music-list"></i>
          </div>
        </footer>
      </div>
    </transition>
    <!-- 播放列表 -->
    <playlist v-show="showPlaylist" @cleanout="init">
      <div class="playlist-wrapper">
        <div class="playlist-item flex" v-for="(item, index) in playlist" :key="index">
          <div class="item-content flex">
            <span class="item-name">
              <span v-show="currentIndex === index">
                <i class="iconfont icon-note"></i>
              </span>
              {{item.name}} -
              <span
                class="item-artists"
              >{{artistFormatter(item.artists)}}</span>
            </span>
            <!-- 删除歌曲 -->
            <span class="delete-item" @click="removeSong({id: item.id, index})">
              <i class="iconfont icon-close"></i>
            </span>
          </div>
          <div class="divider">
            <divider :height="2"></divider>
          </div>
        </div>
      </div>
    </playlist>
    <!-- 播放器 -->
    <audio
      @canplay="audioCanplay"
      @error="audioError"
      @timeupdate="audioTimeupdate"
      @ended="audioEnded"
      :src="currentSong.url"
      ref="audio"
    >不支持audio标签</audio>
    <button
      style="position: absolute; top: 120px; left: 0px; z-index: 100"
      @click="showPlaylist = !showPlaylist"
    >test button</button>
  </div>
</template>

<script>
import proCircle from "@/components/common/CmProgressCircle";
import proBar from "@/components/common/CmProgressBar";
import playlist from "@/components/CpPlaylist";
import divider from "@/components/common/CmDivider";
import lyricScroll from "@/components/common/CmScroll";
import { mapState, mapActions, mapMutations } from "vuex";
import songApi from "@/api/composionQuery";
import { PLAY_MODE } from "@/store/state";
import { timeParser, domUtils } from "@/utils/utils";
import Lyric from "@/utils/lyricParser";

//* 导入anime动画库
// import Anime from "animejs";
export default {
  data() {
    return {
      // 标志位，歌曲是否缓存完毕
      canplay: false,
      // 当前歌曲长度
      duration: 0,
      currentTime: 0,
      // 当前歌曲歌词
      lyric: { lines: [] },
      // 是否为歌词页
      inLyricPage: false,
      // 播放列表是否展开
      showPlaylist: false
    };
  },
  computed: {
    ...mapState([
      "expandPlayer",
      "playlist",
      "currentSong",
      "mode",
      "playing",
      "currentIndex"
    ]),
    percent() {
      return (this.currentTime / this.duration) * 100;
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
    }
  },
  filters: {
    timeParser(time) {
      return timeParser(time);
    }
  },
  methods: {
    audioCanplay() {
      this.canplay = true;
      this.duration = this.$refs.audio.duration;
      this._beginPlay();
    },
    audioError() {
      this.canplay = false;
    },
    audioTimeupdate(e) {
      this.currentTime = e.target.currentTime;
    },
    audioEnded() {
      if (this.mode === PLAY_MODE["LOOP"]) {
        this.loopThis();
      } else {
        this.nextSong();
      }
    },
    // 进度条拖动
    percentChange(newPercent) {
      const actualTime = this.duration * newPercent;
      this.$refs.audio.currentTime = actualTime;
      this.lyric.seek(actualTime * 1000); // 歌词重新定位
    },
    _beginPlay() {
      this.$refs.audio.play();
      this.setPlayingStatus(true);
    },
    // 初始化所有状态
    init() {
      this._stopLyricScrolling();
      this.canplay = false;
      this.duration = 0;
      this.currentTime = 0;
      this.lyric = { lines: [] };
      this.inLyricPage = false;
      this.showPlaylist = false;
      this.$refs.audio.url = null;
    },
    // 循环当前歌曲
    loopThis() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this._beginLyricScrolling(0);
      this.setPlayingStatus(true);
    },
    // 进行歌词滚动
    _beginLyricScrolling(currTime) {
      // 清除上一首歌曲歌词存在的样式
      [...this.$refs.lyricPane.children].forEach(element => {
        element.classList.remove("active");
      });
      this.lyric.seek(currTime);
    },
    _stopLyricScrolling() {
      const lyricCtrl = this.lyric;
      lyricCtrl.stop();
    },
    // 获取歌词
    _getLyric(newVal) {
      //! 此时audio可能并未加载完毕，所以currentTime并不准确
      // 歌词更新时进行的dom操作
      let lastEle = null;
      const handler = currentLine => {
        currentLine = currentLine.lineNum;
        const nowEle = document.querySelector(`.lyric-${currentLine}`);
        this.$refs.lyricWrapper.scrollToElement(nowEle, 400, 0, -200);
        nowEle.classList.add("active");
        // 通过闭包实现歌词的样式的移除
        if (lastEle) {
          lastEle.classList.remove("active");
        }
        lastEle = nowEle;
      };
      this.lyric = new Lyric(newVal.lyric.lyric, handler); // api如此..
      this._beginLyricScrolling(0);
    },
    // 切换下一首
    nextSong() {
      if (!this.canplay) {
        return;
      }
      if (this.playlist.length === 1) {
        console.log("next!");
        this.loopThis();
      } else {
        let index = this.currentIndex;
        // 最后一首，重新开始播放
        if (index === this.playlist.length - 1) {
          index = 0;
        } else {
          index += 1;
        }
        this.setCurrentIndex(index);
        this.canplay = false;
      }
    },
    // 切换上一首
    prevSong() {
      if (!this.canplay) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loopThis();
      } else {
        const index =
          this.currentIndex === 0
            ? this.playlist.length - 1
            : this.currentIndex - 1;
        this.setCurrentIndex(index);
        this.canplay = false;
      }
    },
    // 改变播放模式
    changeMode() {
      let result =
        this.mode === PLAY_MODE.LOOP
          ? PLAY_MODE.RANDOM
          : this.mode === PLAY_MODE.RANDOM
          ? PLAY_MODE.LISTLOOP
          : PLAY_MODE.LOOP;
      this.setMode(result);
    },
    // 收起面板
    hidePlayer() {
      this.changePlayerStatus();
    },
    // 开关歌曲列表面板
    togglePlaylistPane() {},
    // 收藏歌曲
    toggleLike(val, id) {
      // val ? this._addFavourite(id) : this._deleteFavourite(id);
    },
    //! 添加歌曲至收藏目录 / 登录
    _addLike(id) {},
    // 取消收藏
    _deleteLike(id) {},
    // 查看是否歌曲被收藏
    _isLiked(id) {},
    // 将artists对象转换为字符串
    artistFormatter(artists) {
      return artists.map(art => art.name).join(" / ");
    },
    ...mapActions(["removeSong"]),
    ...mapMutations([
      "changePlayerStatus",
      "setPlayingStatus",
      "setCurrentIndex",
      "setCurrentSongByIndex",
      "setMode"
    ])
  },
  watch: {
    // 改变Index触发currentSong的变化，注意删除播放列表导致的index扰动
    currentIndex(newVal, oldVal) {
      if (
        newVal === -1 ||
        newVal === oldVal ||
        this.currentSong.id === this.playlist[newVal].id
      ) {
        return;
      }
      if (oldVal !== -1) {
        // 停止歌词滚动
        if (this.lyric instanceof Lyric) {
          this._stopLyricScrolling();
        }
        this.setCurrentSongByIndex(newVal);
      }
    },
    // 检测currentSong的变化
    currentSong(newVal, oldVal) {
      // 无歌曲播放，退出
      if (!newVal || !newVal.id) {
        return;
      }
      // 停止歌词滚动
      if (this.lyric instanceof Lyric) {
        this._stopLyricScrolling();
      }
      // 进行歌词初始化
      if (newVal.allLyric !== oldVal.allLyric) {
        this._getLyric(newVal.allLyric, 0);
      }
    },
    // 切换播放与暂停状态
    playing(newVal, oldVal) {
      //! audio.canplay()会调用setPlayingStatus(true); 但此时this.lyric可能还没初始化 也可能已经初始化，因为url与lyric的获取是各自异步的
      //! 不想这么麻烦可以去action中将url与lyric获取绑定在一起获取
      const audio = this.$refs.audio;
      console.log("Playing detection", newVal, this.lyric.state);
      if (this.lyric instanceof Lyric) {
        // 检测是否已经初始化lyric
        if ((!newVal && this.lyric.state) || (newVal && !this.lyric.state)) {
          // 开关歌词滚动
          this.lyric.togglePlay();
        }
      }
      this.$nextTick(() => (newVal ? audio.play() : audio.pause()));
    }
  },
  components: {
    proCircle,
    proBar,
    playlist,
    divider,
    lyricScroll
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
          animation: rotate 30s linear infinite;
          &.playing {
            animation-play-state: running;
          }
          &.paused {
            animation-play-state: paused;
          }
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
      color: $color-text-light;
      .cm-pro-cir {
        margin: 0 10px;
      }
      .playlist-switch {
        font-size: 30px;
        font-weight: bold;
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
    bottom: -1px;
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
        padding: 0 8px;
      }
      .song-title {
        max-width: 80%;
        .head-title {
          font-size: 16px;
          color: $color-text-t-1;
          padding-bottom: 5px;
        }
        .sub-title {
          font-size: $font-size-m;
          color: $color-text-t-3;
        }
      }
    }
    .main-area {
      flex-grow: 1;
      position: relative;
      .song-cover-wrapper {
        width: 70%;
        margin: 0 auto;
        img {
          border: 10px solid $color-text-t-3;
          border-radius: 50%;
          width: 100%;
          animation: rotate 30s linear infinite;
          &.playing {
            animation-play-state: running;
          }
          &.paused {
            animation-play-state: paused;
          }
        }
      }
      .lyric-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 3;
        overflow: hidden;
        .lyric-pane {
          display: flex;
          flex-direction: column;
          align-items: center;
          .lyric-item {
            padding: 10px;
            color: $color-text-t-2;
            font-size: $font-size-m;
            text-align: center;
            transition: all 0.2s ease;
            &.active {
              color: $color-text-light;
              font-size: 15px;
            }
          }
        }
      }
      .song-cover-wrapper,
      .lyric-wrapper {
        &.fade-enter-active,
        &.fade-leave-active {
          transition: all 0.1s linear;
        }
        &.fade-enter,
        &.fade-leave-to {
          opacity: 0;
        }
      }
    }
    .bottom-area {
      padding-top: 8px;
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
  .playlist-wrapper {
    .playlist-item {
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
            padding: 0 2px;
            font-size: $font-size-s;
            color: $color-text-t-1;
          }
        }
        .delete-item {
        }
      }
      .divider {
        width: 100%;
      }
    }
  }
}
</style>
