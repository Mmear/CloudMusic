<!-- 搜索页 -->
<template>
  <div class="pg-search flex flex-column" ref="page">
    <header class="search-header flex align-center">
      <div class="back-btn" @click="$router.back()">
        <i class="iconfont icon-back"></i>
      </div>
      <input
        class="input-field"
        v-model="inputVal"
        v-on:keyup.enter="search"
        type="text"
        placeholder="输入搜索内容"
        ref="inputField"
      >
    </header>
    <!-- 热搜 -->
    <section class="hot-search search-section" v-show="!showResult">
      <div class="title">
        <span class="icon-wrapper">
          <i class="iconfont icon-star"></i>
        </span>
        <span class="text">热搜</span>
      </div>
      <div class="tags-wrapper flex">
        <span @click="search(item.first)" class="tag" v-for="(item, index) in hotSearch" :key="index">{{item.first}}</span>
      </div>
    </section>
    <!-- 搜索历史 -->
    <section class="search-history search-section" v-show="!showResult">
      <div class="title">
        <span class="icon-wrapper">
          <i class="iconfont icon-play-history"></i>
        </span>
        <span class="text">历史记录</span>
      </div>
      <div class="tags-wrapper flex" v-if="historySearch.length > 0">
        <span @click="search(item)" class="tag" v-for="(item, index) in historySearch" :key="index">{{item}}</span>
      </div>
      <div class="no-result flex flex-column flex-center" v-else>
        <img src="@/assets/img/logo.png" alt>
        <span>暂无搜索历史</span>
      </div>
    </section>
    <!-- 搜索结果 -->
    <transition name="slideTop">
      <main class="result-pane" v-show="showResult">
        <scroll-pane :scrollX="true" class="scroll-pane">
          <div class="tabs-wrapper flex">
            <nav
              class="tab"
              v-for="(cat, index) in Object.keys(result)"
              :key="index"
              @click="turnPage(`#${cat}-pane`)"
            >{{cat | tabFilter}}</nav>
          </div>
        </scroll-pane>
        <keep-alive>
          <scroll-pane :scrollX="true" class="scroll-pane_content" ref="scrollContent">
            <div class="content-wrapper flex" ref="contentWrapper">
              <div class="result-detail" id="artists-pane">
                <div class="art-item flex" v-for="(art, index) in result.artists" :key="index">
                  <img :src="art.picUrl" alt="">
                  <div class="art-info">
                    <p class="art-name">歌手：{{art.name}}</p>
                    <p class="art-albumsize">专辑数量：{{art.albumSize}}</p>
                  </div>
                </div>
              </div>
              <div class="result-detail" id="songs-pane">
                <div @click="insertSong(song)" class="song-item flex" v-for="(song, index) in result.songs" :key="index">
                  <p class="index">{{index}}</p>
                  <p class="song-name">{{song.name}} - </p>
                  <p class="artists">{{artistFormatter(song.artists)}}</p>
                </div>
              </div>
              <div class="result-detail" id="playlists-pane">
                <router-link
                  tag="div"
                  :to="{name: 'colList', params: {col}}"
                  class="col-item"
                  v-for="(col, index) in result.playlists"
                  :key="index"
                >
                  <img class="cover-img" :src="col.coverImgUrl">
                  <p class="col-info">
                    <span class="col-name">{{col.name}}</span>
                    <span class="col-track-count">
                      <i class="iconfont icon-selected"></i>
                      {{col.trackCount}}首
                    </span>
                  </p>
                </router-link>
              </div>
            </div>
          </scroll-pane>
        </keep-alive>
      </main>
    </transition>
  </div>
</template>

<script>
import scrollPane from "@/components/common/CmScroll";
import loading from "@/components/common/CmLoading";
import storeApi from "@/utils/storage";
import { getHotSearch, searchByKeyword } from "@/api/recommendQuery";
import {mapActions} from 'vuex';

export default {
  data() {
    return {
      showResult: false, // 标志位，是否开始搜索
      inputVal: "", // input field的值
      hotSearch: [], // 热搜
      historySearch: [], // 历史搜索
      result: {}, // 搜索结果
      tabIndex: 0 // 当前搜索结果tab序号
    };
  },
  methods: {
    test() {
      this.tabIndex = (this.tabIndex + 1 )% 3;
      this.$refs.scrollContent.scrollToElement(`#e${this.tabIndex}`, 200);
    },
    // 将artists对象转换为字符串
    artistFormatter(artists) {
      return artists.map(art => art.name).join(" / ");
    },
    // 滑动结束
    scrollEndHandler (e) {
      console.log('hiii', e);
    },
    // 区域滑动
    turnPage(val) {
      console.log(val);
      this.$refs.scrollContent.scrollToElement(val, 100);
    },
    search(val) {
      if (!val) {
        val = this.inputVal;
      } else {
        this.inputVal = val;
      }
      if (!val) {
        return;
      }
      // 关键词搜索
      searchByKeyword(val).then(res => {
        this.addRecord(val);
        this.showResult = true;
        this.result = res.order.reduce((pre, cur) => {
          if (cur === "mvs" || cur === "albums") return pre;
          pre[cur] = res[cur];
          return pre;
        }, {});
        // 设置滚动区域宽度
        [...document.querySelectorAll(".result-detail")].forEach(element => {
          element.style.width = this.$refs.page.clientWidth + "px";
        });
        this.$refs.scrollContent.on('scrollEnd', this.scrollEndHandler);
      });
    },
    // 添加搜索记录
    addRecord(val) {
      if (this.historySearch.indexOf(val) >= 0) {
        return;
      }
      this.historySearch.push(val);
      storeApi.setItem("search_history", this.historySearch);
    },
    ...mapActions(['insertSong'])
  },
  created() {
    // 获取热搜
    getHotSearch().then(res => (this.hotSearch = res));
    const history = storeApi.getItem("search_history");
    if (!history) {
      storeApi.setItem("search_history", []);
    } else {
      this.historySearch = history;
    }
  },
  mounted() {
    // 输入框聚焦
    this.$refs.inputField.focus();
  },
  filters: {
    tabFilter(val) {
      switch (val) {
        case "albums":
          return "专辑";
        case "artists":
          return "歌手";
        case "songs":
          return "歌曲";
        case "mvs":
          return "视频";
        case "playlists":
          return "歌单";
      }
    }
  },
  components: {
    scrollPane
  }
};
</script>

<style lang="scss" scoped>
.pg-search {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: $color-bg;
  font-size: 16px;
  color: $color-text-t-1;
  .search-header {
    padding: 10px 8px;
    height: 30px;
    background-color: $color-bg-d;
    .back-btn {
      width: 30px;
    }
    .input-field {
      flex-grow: 1;
      height: 30px;
      border: none;
      border-bottom: 1px solid $color-text-t-1;
      color: $color-text-t-1;
      font-size: 18px;
      outline: none;
      background-color: transparent;
    }
  }
  .search-section {
    display: flex;
    flex-direction: column;
    padding: 20px 10px;
    .title {
      font-size: 16px;
      font-weight: bold;
      padding: 5px 0;
      .icon-wrapper {
        padding-right: 6px;
      }
    }
    .tags-wrapper {
      flex-wrap: wrap;
      .tag {
        margin: 5px 0;
        padding: 5px 10px;
        margin-right: 8px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        &:first-child {
          color: #56b6c2;
        }
      }
    }
    .no-result {
      filter: brightness(50%);
      img {
        width: 40vw;
        padding: 20px;
      }
    }
  }
  .result-pane {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .scroll-pane {
      width: 100%;
      overflow: hidden;
      padding: 10px 0;
      background-color: $color-bg-d;
      .tabs-wrapper {
        justify-content: space-around;
        align-items: center;
        height: 100%;
        .tab {
          font-size: $font-size-m;
        }
      }
    }
    .scroll-pane_content {
      width: 100%;
      overflow: hidden;
      flex-grow: 1;
      .content-wrapper {
        width: 300%;
        .result-detail {
        }
        #artists-pane {
          .art-item {
            padding: 5px 5px;
            background-color: $color-theme;
            border-right: 3px dotted $color-bg;
            margin-bottom: 5px;
            img {
              filter: brightness(80%);
              width: 15vw;
              height: 15vw;
            }
            .art-info {
              display: flex;
              align-items: center;
              .art-name, .art-albumsize {
                padding: 0 5px;
                border-radius: 10px;
                padding: 5px 10px;
                background-color: $color-text-t-3;
                margin-left: 5px;
              }
            }
          }
        }
        #songs-pane {
          .song-item {
            height: 30px;
            padding: 5px;
            margin-bottom: 5px;
            background-color: $color-theme;
            border-right: 3px dotted $color-bg;
            .song-name, .artists {
              line-height: 30px;
              @include no-wrap;
            }
            .index {
              color: $color-bg-d;
              font-weight: bold;
            }
            .song-name {
              padding: 0 6px;
            }
            .artists {
              font-size: $font-size-s;
              color: $color-text-t-2;
            }
          }
        }
        #playlists-pane {
          .col-item {
            background-color: $color-theme;
            border-right: 3px dotted $color-bg;
            margin-bottom: 5px;
            padding: 10px;
            display: flex;
            .cover-img {
              width: 50px;
              height: 50px;
            }
            .col-info {
              padding: 0 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              .col-name {
              }
              .col-track-count {
                .iconfont {
                  color: $color-text-t-1;
                  border-radius: 50%;
                  border: 0.4px solid;
                }
                color: $color-text-t-1;
                font-size: $font-size-m;
              }
            }
          }
        }
      }
    }
    &.slideTop-enter-active,
    &.slideTop-leave-active {
      transition: 0.2s all ease;
    }
    &.slideTop-enter,
    &.slideTop-leave-to {
      transform: translateY(100%);
    }
  }
}
</style>
