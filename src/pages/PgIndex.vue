<!-- 音乐主页 -->
<template>
  <div class="pg-index flex flex-column">
    <!-- <menu-tab></menu-tab>  -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import menuTab from '@/components/CpSubTab';
// import subIntro from '@/pages/PgIntro';
// import subRadio from '@/pages/PgRadio';
export default {
  data() {
    return {
      count: 1
    };
  },
  components: {
    menuTab,
    // subIntro,
    // subRadio
  },
  mounted() {
  },
  methods: {
    addCount() {
      setInterval(() => {
        this.count++;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.pg-index {
  flex-grow: 1;
}
</style>
