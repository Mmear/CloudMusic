<!-- 推荐页面 -->
<template>
  <div class="pg-intro flex flex-column">
    <scroll-pane ref="scroll" class="intro-content">
      <div class="content-wrapper">
        <!-- 在获取 banner 数据之后再渲染 -->
        <!-- 轮播图 -->
        <section class="banner-wrapper" v-if="banners.length">
          <slider>
            <div v-for="(img, index) in banners" :key="index">
              <a :href="img.url">
                <span :style="{backgroundColor: img.titleColor}" class="img-label">{{img.typeTitle}}</span>
                <img :src="img.imgUrl" @load="isFirstLoadImg">
              </a>
            </div>
          </slider>
        </section>
        <!-- 各类推荐 -->
        <section class="nav-wrapper flex justify-around">
          <div class="nav-item flex flex-column">
            <span class="icon-ctn">
              <i class="iconfont icon-emotion"></i>
            </span>
            <span class="nav-text">私人fm</span>
          </div>
          <div class="nav-item flex flex-column">
            <span class="icon-ctn">
              <i class="iconfont icon-weather"></i>
            </span>
            <span class="nav-text">每日推荐</span>
          </div>
          <div class="nav-item flex flex-column">
            <span class="icon-ctn">
              <i class="iconfont icon-diamond"></i>
            </span>
            <span class="nav-text">歌单</span>
          </div>
          <div class="nav-item flex flex-column">
            <span class="icon-ctn">
              <i class="iconfont icon-rank"></i>
            </span>
            <span class="nav-text">排行榜</span>
          </div>
        </section>
        <divider></divider>
        <!-- 在获取推荐数据后再加载 -->
        <!-- 推荐歌单 -->
        <section class="list-wrapper col-list">
          <span class="list-title">推荐歌单</span>
          <div class="list-ctn flex" v-if="colList.length">
            <router-link 
              v-for="(col, index) in colList" 
              :key="index" 
              :to="{name: 'colList', params: {col}}"
              class="list-item">
              <div class="img-wrapper">
                <img v-lazy="col.picUrl">
              </div>
              <span class="item-text">{{col.name}}</span>
            </router-link>
          </div>
        </section>
        <!-- 最新音乐 -->
        <section class="list-wrapper music-list">
          <span class="list-title">最新音乐</span>
          <div class="list-ctn flex">
            <div 
              v-for="(music, index) in musicList" 
              @click="simpliedInsertSong(music)"
              :key="index" 
              class="list-item">
              <div class="img-wrapper">
                <img v-lazy="music.album.blurPicUrl">
              </div>
              <span class="item-text">{{music.name}}</span>
              <span class="artist-text">{{_artistFormatter(music.artists)}}</span>
            </div>
          </div>
        </section>
        <!-- 加载图标 -->
        <div v-show="!colList.length" class="loading-wrapper">
          <loading></loading>
        </div>
      </div>
    </scroll-pane>
    <!-- 歌单路由 -->
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import scrollPane from "@/components/common/CmScroll";
import slider from "@/components/common/CmSlider";
import loading from "@/components/common/CmLoading";
import divider from '@/components/common/CmDivider';
import { recommend } from "@/api/recommendQuery";
import {mapActions} from 'vuex';
// 针对mini播放器的混入设置
// import mixin from '@/utils/mixin.js'
export default {
  data() {
    return {
      banners: [],
      colList: [],
      musicList: []
    };
  },
  created() {
    this._getBanners();
    this._getRecomColList();
    this._getRecomMusicList();
  },
  mounted() {
    this.$refs.scroll.refresh();
  },
  methods: {   
    // 获取轮播图数据
    _getBanners() {
      recommend.getBanners()
        .then(res => {
          // console.log(res);
          this.banners = res;
        })
    },
    // 获取其它推荐数据
    _getRecomColList() {
      // 验证用户登录状态
      //checkStatus();
      // 未登录
      recommend.getRecomColList()
        .then(res => {
          this.colList = res.slice(0, 9);
          // console.log(this.colList);
        })
    },
    // 获取推荐音乐/最新音乐
    _getRecomMusicList() {
      recommend.getRecomMusicList().then(res => {
        this.musicList = res.slice(0, 6);
        // console.log(this.musicList);
      })
    },
    _artistFormatter(artists) {
      return artists.map(art => art.name).join(' / ');
    },
    _artistObjFormatter(artists) {
      return artists.map(art => ({id: art.id, name: art.name}));
    },
    // 首次获取轮播图片时，重新让better-scroll重新计算
    isFirstLoadImg() {
      if (!this.hasLoaded) {
        this.$refs.scroll.refresh();
        this.hasLoaded = true;
      }
    },
    // 插入一条歌曲至播放列表顶端
    simpliedInsertSong({id, name, artists}) {
      // console.log(id, name, this._artistObjFormatter(artists));
      artists = this._artistObjFormatter(artists);
      this.insertSong({id, name, artists});
    },
    ...mapActions(['insertSong'])
  },
  components: {
    slider,
    loading,
    scrollPane,
    divider
  }
};
</script>

<style lang="scss" scoped>
.pg-intro {
  flex-grow: 1;
  position: relative;
  .intro-content {
    height: 100%;
    width: 100%;
    padding: 0 5px;
    position: absolute;
    box-sizing: border-box;
    overflow: hidden;
    .content-wrapper {
      background-color: $color-bg-d;
      .banner-wrapper {
        // padding-top: 5px;
        border-radius: 8px;
        overflow: hidden;
        a {
          position: relative;
          .img-label {
            display: inline-block;
            font-size: $font-size-s;
            color: #fff;
            padding: 5px;
            position: absolute;
            bottom: 0;
            right: 0px;
          }
        }
      }
      .nav-wrapper {
        padding: 20px 0;
        .nav-item {
          text-align: center;
          align-items: center;
          .icon-ctn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            margin-bottom: 8px;
            border-radius: 50%;
            background-color: $color-theme;
            .iconfont {
              font-size: 1.3rem;
              color: $color-text-t-1;
            }
          }
          .nav-text {
            font-size: $font-size-m;
            color: $color-text-light;
          }          
        }
      }
      .list-wrapper {
        padding-bottom: 15px;
        .list-title {
          display: inline-block;
          padding: 10px 0;
          color: $color-text-light;
          font-weight: bold;
          font-size: 16px;
        }
        .list-ctn {
          flex-wrap: wrap;
          justify-content: space-between;
          .list-item {
            width: 32%;
            padding-bottom: 15px;
            .img-wrapper {
              width: 100%;
              padding-bottom: 5px;
              border-radius: 10px;
              img {
                width: 100%;
              }
            }
            .item-text {
              display: block;
              color: $color-text-light;
              font-size: $font-size-m;
              word-wrap: break-word;
            }
            .artist-text {
              color: $color-text-t-2;
              font-size: $font-size-s;
            }
          }
        }
        &.col-list {
        }
        &.music-list {
        }
      }
      .loading-wrapper {
        width: 60px;
        margin: auto;
      }
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: .3s all ease;
  }
  .slide-enter, .slide-leave-to {
    transform: translateX(100%);
  }
}
</style>
