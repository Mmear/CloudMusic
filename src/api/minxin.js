import { mapActions, mapMutations, mapState } from "vuex";
import songApi  from './composionQuery';
// 获取歌曲信息的Minxin
export default {
  methods: {
    ...mapActions(['']),
    ...mapMutations(['']),
    // 向播放列表添加歌曲
    _getSongRelated(id) {
      const songUrl = songApi.getSongUrl(id);
      const detial = songApi.getSongUrl(id);
      const lyric = songApi.getLyric(id);
    }
  },
  computed: {

  }
}