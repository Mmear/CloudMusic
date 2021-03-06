<!-- 歌单页 -->
<template>
  <div class="pg-col-list flex flex-column">
    <!-- 固定头部 -->
    <nav class="col-header flex align-center" @click="$router.back()">
      <div>
        <i class="iconfont icon-back"></i>
      </div>
      <div class="brief-info">
        <p class="col-name">歌单：{{col.name}}</p>
        <p class="brief-desc">by {{colDetail.creator.name}}</p>
      </div>
    </nav>
    <!-- 滚动区域 -->
    <scroll-pane class="col-scroll" ref="scroll">
      <div class="scroll-pane">
        <!-- 歌单信息 -->
        <header class="col-info-header">
          <div class="header-top">
            <div class="cover-wrapper">
              <img class="cover" :src="col.picUrl || colDetail.coverImgUrl" alt>
            </div>
            <div class="info-wrapper">
              <p class="col-name">{{col.name}}</p>
              <div class="creator-info">
                <img v-lazy="colDetail.creator.avatarUrl" class="creator-avatar">
                <span class="creator-name">{{colDetail.creator.name}}</span>
              </div>
            </div>
          </div>
          <!-- 歌单操作面板 -->
          <div class="header-bottom flex">
            <span class="icon-wrapper">
              <i class="iconfont icon-comments"></i>
              <span>{{colDetail.commentCount}}</span>
            </span>
            <span class="icon-wrapper">
              <i class="iconfont icon-share"></i>
              <span>{{colDetail.shareCount}}</span>
            </span>
            <span class="icon-wrapper">
              <i class="iconfont icon-download"></i>
              <span>下载</span>
            </span>
            <span class="icon-wrapper" @click.stop="showInfo = true">
              <i class="iconfont icon-information"></i>
              <span>信息</span>
            </span>
          </div>
        </header>
        <!-- 开始播放按钮与收藏全部按钮 -->
        <section class="col-operation-pane flex flex-center">
          <div class="play-all-btn" @click.stop="addSongInCol(0)">
            <span>
              <i class="iconfont icon-play"></i>
            </span>
            <span>播放全部（{{colDetail.tracks.length}}）</span>
          </div>
          <div class="like-all-btn">
            <span>
              <i class="iconfont icon-favorite"></i>
            </span>
            <span>收藏（{{colDetail.subscribedCount}}）</span>
          </div>
        </section>
        <main class="col-list-wrapper">
          <div
            class="song-item flex align-center"
            v-for="(song, index) in colDetail.tracks"
            :key="index"
            @click.stop="addSongInCol(index)"
          >
            <span class="song-index" style="color: red;" v-if="currentSong.id === song.id">
              <i class="iconfont icon-play"></i>
            </span>
            <span class="song-index" v-else>{{index+1}}</span>
            <div class="song-info">
              <p class="song-name">{{song.name}}</p>
              <span class="song-from">{{artistFormatter(song.artists)}} - {{song.album.name}}</span>
            </div>
          </div>
        </main>
      </div>
    </scroll-pane>
    <!-- 当播放器出现时，让其出现撑高scrollPane -->
    <div class="padding-div" v-show="playlist.length > 0"></div>
    <!-- 返回顶端 -->
    <div class="toTop"></div>
    <!-- 歌单详情面板 -->
    <transition name="info">
      <div class="col-info-pane flex flex-column" v-show="showInfo">
        <div class="background">
          <img class="bg-img" :src="col.picUrl || colDetail.coverImgUrl" alt="">
        </div>
        <span class="icon-wrapper" @click="showInfo = false">
          <i class="iconfont icon-close"></i>
        </span>
        <div class="cover-wrapper">
          <img class="cover" :src="col.picUrl || colDetail.coverImgUrl" alt>
        </div>
        <p class="col-name">
          {{col.name}}
        </p>
        <div class="tags">
          <span class="tag" v-for="(tag, index) in colDetail.tags" :key="index">
            {{tag}}
          </span>
        </div>
        <div class="desc">
          <scroll-pane class="col-desc-wrapper">
            <div class="p-wrapper">
              <p class="col-desc" v-for="(p, index) in descFormatter(this.colDetail.desc)" :key="index">
                {{p}}
              </p>
            </div>
          </scroll-pane>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import scrollPane from "@/components/common/CmScroll";
import { getColListDetail } from "@/api/recommendQuery";
export default {
  // props: ["col"],
  data() {
    return {
      col: {},
      colDetail: {
        creator: {},
        tracks: [],
        desc: '',
      },
      showInfo: false, //
      hasAdded: false // 歌单是否已经被添加至播放列表中
    };
  },
  // 使用路由元守卫在导航完成前进行数据获取
  // 也可在created中获取
  beforeRouteEnter(to, from, next) {
    getColListDetail(to.params.col.id).then(res => {
      next(vm => {vm.colDetail = res; vm.col = to.params.col;});
    });
  },
  beforeRouteUpdate(to, from, next) {
    getColListDetail(to.params.col.id).then(res => {
      this.colDetail = res;
      this.col = to.params.col;
      next();
    });
  },
  mounted() {
    this.$nextTick(() => this.descFormatter(this.colDetail.desc));
  },
  methods: {
    descFormatter(paragraph) {
      if (paragraph) {
        const pArr = paragraph.split('\n');
        return pArr;
      }
    },
    _getColList(id) {
      getColListDetail(id).then(res => (this.colDetail = res));
    },
    artistFormatter(artists) {
      return artists.map(art => art.name).join(" / ");
    },
    addSongInCol(index) {
      if (index < 0 || this.colDetail.tracks.length <= 0) {
        return;
      }
      if (!this.hasAdded) {
        // 将歌单中所有歌曲添加至playlist中
        this.insertSongs({ songs: this.colDetail.tracks, activeIndex: index });
        this.hasAdded = true;
      } else {
        // 只插入当前选中的歌曲
        const song = this.colDetail.tracks[index];
        this.insertSong(song);
      }
    },
    ...mapActions(["insertSongs", "insertSong"])
  },
  created() {
    // _getColList(this.col.id);
  },
  watch: {
    playlist() {
      if (this.playlist.length === 0) {
        // mini播放器消失，重新计算高度
        this.$nextTick(() => this.$refs.scroll.refresh());
        this.hasAdded = false;
      }
    }
  },
  computed: {
    ...mapState(["playlist", "currentSong"])
  },
  components: {
    scrollPane
  }
};
</script>

<style lang="scss" scoped>
$fixed-header: 50px;
.pg-col-list {
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: $color-bg-d;
  color: $color-text-t-1;
  .col-header {
    position: fixed;
    height: $fixed-header;
    width: 100%;
    font-size: $font-size-m;
    color: $color-text-t-1;
    background-color: $color-theme;
    .iconfont {
      font-size: 1.3rem;
    }
    .brief-info {
      line-height: 1.2;
      width: 100%;
      .brief-desc {
        color: $color-text-t-2;
        @include no-wrap;
        width: 80%;
      }
    }
  }
  .col-scroll {
    margin-top: $fixed-header;
    flex-grow: 1;
    flex-basis: 0%; // 必须提供 否则填充物 padding-div 的高度不能正确显示
    overflow: hidden;
    .scroll-pane {
      .col-info-header {
        padding-bottom: 15px;
        .header-top {
          padding: 15px 10px;
          display: flex;
          .cover-wrapper {
            .cover {
              width: 150px;
              border-radius: 5px;
            }
          }
          .info-wrapper {
            padding: 10px 0 10px 10px;
            line-height: 1.2;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .creator-info {
              display: flex;
              align-items: center;
              .creator-avatar {
                width: 35px;
                border-radius: 50%;
              }
              .creator-name {
                padding: 0 10px;
                color: $color-text-t-2;
                font-weight: normal;
                font-size: $font-size-m;
              }
            }
          }
        }
        .header-bottom {
          display: flex;
          color: $color-text-t-2;
          justify-content: space-around;
          .icon-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            span {
              padding-top: 5px;
              font-size: $font-size-s;
            }
          }
        }
      }
      .col-operation-pane {
        height: 50px;
        padding: 0 10px;
        font-size: $font-size-m;
        background-color: $color-bg;
        border-bottom: 1px dashed $color-text-t-3;
        // border-radius:0 0 8px 8px;
        .iconfont {
          padding: 0 5px;
        }
        .play-all-btn {
          flex-basis: 50%;
        }
        .like-all-btn {
          text-align: right;
          flex-basis: 50%;
        }
      }
      .col-list-wrapper {
        background-color: $color-bg;
        .song-item {
          height: 50px;
          font-size: $font-size-m;
          color: $color-text-t-2;
          border-bottom: 1px solid rgba(0, 0, 0, 0.3);
          .song-index {
            padding: 0 15px;
          }
          .song-info {
            @include no-wrap;
            .song-name {
              @include no-wrap;
              color: $color-text-t-1;
              padding: 5px 2px;
            }
            .song-from {
              @include no-wrap;
              font-size: $font-size-s;
            }
          }
        }
      }
    }
  }
  .col-info-pane {
    position: fixed;
    height: 100%;
    padding: 0 10px;
    background-color: $color-bg;
    font-size: $font-size-m;
    color: $color-text-t-1;
    .background {
      position: absolute;
      height: 100%;
      width: 100%;
      filter: blur(30px);
      opacity: .3;
      z-index: -1;
      .bg-img {
        height: 100%;
        width: 100%;
      }
    }
    .icon-wrapper {
      height: 40px;
      line-height: 40px;
      text-align: right;
      .iconfont {

      }
    }
    .cover-wrapper {
      text-align: center;
      .cover {
        width: 45%;
      }
    }
    .col-name {
      padding: 10px 0;
      text-align: center;
      font-size: $font-size-l;
      font-weight: bold;
    }
    .tags {
      padding: 15px 0;
      .tag {
        display: inline-block;
        line-height: 15px;
        padding: 3px 5px;
        margin: 0 3px;
        color: $color-text-t-2;
        border: 1px solid $color-text-t-2;
        border-radius: 5px;
      }
    }
    .desc {
      padding: 5px 0;
      flex-grow: 1;
      position: relative;
      overflow: hidden;
      .col-desc-wrapper {
        position: absolute;
        height: 100%;
        width: 100%;
        // overflow: hidden;
        .p-wrapper {
          .col-desc {
            padding: 5px 0;
            line-height: 1.5;
          }
        }
      }
    }
    &.info-enter-active, &.info-leave-active {
      transition: opacity .3s ease; 
    }
    &.info-enter, &.info-leave-to {
      opacity: 0;
    }
  }
  .padding-div {
    flex-basis: 50px;
    background-color: $color-bg;
  }
}
</style>

