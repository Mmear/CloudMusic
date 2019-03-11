<!-- 登录页 -->
<template>
  <div class="pg-login flex flex-column flex-center">
    <div class="background" :class="{active: loading}"></div>
    <div class="fixed-header" @click="$router.back()">
      <span>
        <i class="iconfont icon-back"></i>
      </span>
    </div>
    <img class="logo" src="@/assets/img/logo.png" alt="logo">
    <div class="title">NETEASE CLOUD MUSIC</div>
    <div class="form flex flex-column align-center">
      <div class="input-wrapper">
        <span class="icon-wrapper" v-if="emailInput">
          <i class="iconfont icon-input"></i>邮箱
        </span>
        <span class="icon-wrapper" v-if="!emailInput">
          <i class="iconfont icon-input"></i>手机号
        </span>
        <input class="email" type="text" v-if="emailInput" ref="email">
        <input class="text" type="text" v-else ref="cellPhone">
      </div>
      <div class="input-wrapper">
        <span class="icon-wrapper">
          <i class="iconfont icon-password"></i>密码
        </span>
        <input class="password" type="password" ref="password">
      </div>
    </div>
    <div class="confirm-btn" @click="login">登录</div>
    <div class="hint" :class="{active: error}">
      <span><i class="iconfont icon-close"></i></span> 账号或密码错误
    </div>
    <div class="loading-wrapper">
      <loading v-show="loading"></loading>
    </div>
  </div>
</template>

<script>
import loading from "@/components/common/CmLoading";
import userApi from "@/api/userQuery";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      emailInput: false,
      loading: false,
      error: false,
    };
  },
  methods: {
    login() {
      // TODO 各类验证
      const refs = this.$refs;
      const accountNum = this.emailInput
        ? refs.email.value
        : refs.cellPhone.value;
      const password = refs.password.value;
      // 邮箱登录
      this.loading = true;
      if (this.emailInput) {
        userApi
          .emailLogin(accountNum, password)
          .then(this.loginHandler)
          .catch(errHandler);
      } else {
        userApi
          .cellPhoneLogin(accountNum, password)
          .then(this.loginHandler)
          .catch(this.errHandler);
      }
    },
    errHandler(err) {
      console.log('Got', err);
      this.loading = false;
      this.error = true;
      setTimeout(() => this.error = false, 1500);
    },
    loginHandler(res) {
      const user = {};
      Object.assign(user, res);
      // 获取剩余信息
      Promise.all([
        userApi.getUserDetail(user.id),
        userApi.getUserPlaylist(user.id)
      ]).then(res => {
        Object.assign(user, res[0], res[1]);
        // 设置全局登录状态
        this.loading = false;
        this.setIdentified(true);
        this.setUser(user);
        this.$router.back();
      });
    },
    ...mapMutations(["setUser", "setIdentified"])
  },
  computed: {
    ...mapState(["user", "identified"])
  },
  components: {
    loading
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
.pg-login {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 3;
  .fixed-header {
    position: fixed;
    display: flex;
    align-items: center;
    height: 40px;
    top: 0;
    left: 0;
    right: 0;
    .iconfont {
      font-size: 1.5rem;
      color: $color-text-t-1;
    }
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: repeating-linear-gradient(
      #{$color-theme},
      #{$color-theme} 20%,
      #{$color-theme},
      #{$color-bg-d} 20%,
      #{$color-bg-d} 40%
    );
    filter: brightness(60%) blur(2px);
    &.active {
      z-index: 0;
      filter: brightness(30%) blur(2px);
    }
  }
  .title {
    color: $color-text-t-1;
    font-size: 1.2rem;
    padding: 15px 10px;
    margin: 15px;
    border: 1px solid #fff;
    border-bottom-width: 3px;
  }
  .logo {
    width: 45%;
    border-radius: 50%;
    animation: rotate 35s infinite ease;
  }
  .form {
    width: 100%;
    .input-wrapper {
      width: 80%;
      margin: 10px 0;
      display: flex;
      flex-direction: column;
      .icon-wrapper {
        flex-basis: 20px;
        font-size: $font-size-m;
        color: $color-text-t-1;
        .iconfont {
          padding: 0 5px;
        }
      }
      input {
        flex-grow: 1;
        padding: 0 5px;
        height: 30px;
        line-height: 30px;
        font-size: $font-size-l;
        border-radius: 5px;
        border: 2px solid transparent;
        outline: none;
        transition: all 0.2s ease;
        &:focus {
          // box-shadow: 0px 0px 1px 2px #ddd inset;
          border-color: #ccc;
        }
      }
    }
  }
  .confirm-btn {
    width: 80%;
    margin-top: 5px;
    padding: 10px 0;
    background-color: $color-bg;
    text-align: center;
    color: $color-text-t-1;
    font-size: $font-size-m;
    border-radius: 3px;
  }
  .hint {
    position: absolute;
    bottom: 0;
    margin: 0 auto;
    transform: translateY(100%);
    width: 70%;
    padding: 10px 0;
    font-size: $font-size-l;
    color: $color-text-t-1;
    background-color: transparent;
    border: 2px solid $color-text-t-3;
    text-align: center;
    transition: all .4s ease;
    .iconfont {
      border: 1px solid;
      border-radius: 50%;
      padding: 2px;
      font-size: $font-size-m;
    }
    &.active {
      transform: translateY(-50px);
    }
  }
  &.login-enter-active,
  &.login-leave-active {
    transition: all 0.3s ease;
  }
  &.login-enter,
  &.login-leave-to {
    transform: translateX(-100%);
  }
  .loading-wrapper {
    position: absolute;
    width: 50px;
  }
}
</style>

