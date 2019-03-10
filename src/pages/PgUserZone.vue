<!-- 个人音乐主页 -->
<template>
  <div class="pg-user-zone flex flex-column">
    <scroll-pane class="scroll" ref="scroll">
      <div class="scroll-pane">
        <div class="user-info-wrapper">
          <div class="info-pane">
            <img class="user-avatar" v-if="!identified" src="@/assets/img/logo.png" alt>
            <img class="user-avatar" v-else :src="user.avatarUrl" alt>
            <div class="user-others">
              <router-link
                tag="div"
                :to="{name: 'login'}"
                class="not-logged-in"
                v-if="!identified"
              >点击登录</router-link>
              <div v-else>
                <p class="user-name">{{user.name}}</p>
                <p class="user-level">LV.{{user.level}}</p>
                <P class="user-signature">{{user.signature}}</P>
              </div>
            </div>
            <span class="sign-up">
              <i class="iconfont icon-star"></i> 签到
            </span>
          </div>
        </div>
        <div class="user-related">
          <!-- 最近播放 -->
          <div class="related-item lately-play">
            <span class="icon-wrapper">
              <i class="iconfont icon-play-history"></i>
            </span>
            <p class="item-title">最近播放</p>
            <div class="more">
              <i class="iconfont icon-more"></i>
            </div>
          </div>
          <!-- 我的电台 -->
          <div class="related-item my-radio">
            <span class="icon-wrapper">
              <i class="iconfont icon-loop-list"></i>
            </span>
            <p class="item-title">我的电台</p>
            <div class="more">
              <i class="iconfont icon-more"></i>
            </div>
          </div>
          <!-- 我的收藏 -->
          <div class="related-item my-collection">
            <span class="icon-wrapper">
              <i class="iconfont icon-col-like"></i>
            </span>
            <p class="item-title">我的收藏</p>
            <div class="more">
              <i class="iconfont icon-more"></i>
            </div>
          </div>
        </div>
        <!-- 创建的歌单-->
        <div class="col-created">
          <header class="col-header">
            <span>
              <i class="iconfont icon-more-unfold"></i>
            </span>
            <span>创建的歌单</span>
          </header>
          <router-link
            tag="div"
            :to="{name: 'colList', params: {col}}"
            class="col-item"
            v-for="(col, index) in colCreated"
            :key="index"
          >
            <img class="cover-img" :src="col.picUrl">
            <p class="col-info">
              <span class="col-name">{{col.name}}</span>
              <span class="col-track-count">
                <i class="iconfont icon-selected"></i>
                {{col.trackCount}}首
              </span>
            </p>
          </router-link>
        </div>
        <!-- 收藏的歌单 -->
        <div class="col-collected">
          <header class="col-header">
            <span>
              <i class="iconfont icon-more-unfold"></i>
            </span>
            <span>收藏的歌单</span>
          </header>
          <router-link
            tag="div"
            :to="{name: 'colList', params: {col}}"
            v-for="(col, index) in colCollected"
            :key="index"
            class="col-item my-liked"
          >
            <img class="cover-img" :src="col.picUrl" alt>
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
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import scrollPane from "@/components/common/CmScroll";
import { mapState } from "vuex";
export default {
  data() {
    return {
      colCreated: [],
      colCollected: []
    };
  },
  components: {
    scrollPane
  },
  methods: {},
  watch: {
    user: {
      handler: function(newVal, oldVal) {
        if (newVal.cols) {
          this.colCreated = newVal.cols.filter(
            item => item.creator.userId === this.user.id
          );
          this.colCollected = newVal.cols.filter(
            item => item.creator.userId !== this.user.id
          );
        }
      },
      deep: true
    }
  },
  computed: {
    // colCreated() {
    //   return this.user.cols.filter(item => item.creator.userId === user.id);
    // },
    // colCollected() {
    //   return this.user.cols.filter(item => item.creator.userId === user.id);
    // },
    ...mapState(["identified", "user"])
  }
};
</script>

<style lang="scss" scoped>
.pg-user-zone {
  flex-grow: 1;
  position: relative;
  font-size: 16px;
  color: $color-text-t-1;
  .scroll {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .user-info-wrapper {
      display: flex;
      justify-content: space-between;
      padding: 10px 10px;
      background-color: $color-bg;
      .info-pane {
        display: flex;
        position: relative;
        flex-grow: 1;
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .user-others {
          padding: 0 10px;
          .not-logged-in {
            display: block;
            color: $color-text-t-2;
            margin-top: 50%;
          }
          .user-name {
          }
          .user-level {
            font-style: italic;
            font-size: $font-size-s;
            color: $color-text-t-2;
          }
          .user-signature {
            padding: 5px 0;
          }
        }
        .sign-up {
          position: absolute;
          top: 0;
          right: 0;
          height: 16px;
          line-height: 16px;
          padding: 2px 5px;
          font-size: $font-size-m;
          color: $color-text-t-2;
          border: 1px solid $color-text-t-2;
          border-radius: 10px;
        }
      }
    }
    .user-related {
      .related-item {
        display: flex;
        align-items: center;
        border-bottom: 0.3px solid $color-text-t-3;
        padding: 10px 10px;
        .icon-wrapper {
          display: block;
          font-size: 1.3rem;
          color: $color-theme;
        }
        .item-title {
          padding: 0 10px;
        }
        .more {
          flex-grow: 1;
          text-align: right;
        }
      }
    }
    .col-created,
    .col-collected {
      .col-header {
        color: $color-text-t-2;
        font-size: $font-size-m;
        padding: 8px 5px;
        background-color: $color-bg;
      }
      .col-item {
        border-bottom: 0.3px solid $color-text-t-3;
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
              color: rgb(103, 140, 243);
              border-radius: 50%;
              border: 0.4px solid;
            }
            color: $color-text-t-2;
            font-size: $font-size-m;
          }
        }
      }
    }
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: 0.3s all ease;
  }
}
</style>
 
 