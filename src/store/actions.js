import songApi from "@/api/composionQuery";
// 检查是否有重复的歌曲，有则重新播放该歌曲并放至顶端
const DEFAULT_IMG_URL = require('@/assets/img/logo.png');
const checkDuplicate = (id, songList) => {
  return songList.findIndex(item => {
    return item.id === id;
  });
};
export default {
  changePlayerStatus({ commit }) {
    commit("changePlayerStatus");
  },
  insertSong({ state, commit }, song) {
    // console.log("[Action:insertSong] " + JSON.stringify(song));
    commit("setFullScreen", true);
    commit("setPlayingStatus", true);
    let suspIndex = checkDuplicate(song.id, state.playlist);
    let playlist = state.playlist.slice(0);
    if (suspIndex > -1) {
      // 改变当前索引
      const theSong = playlist.splice(suspIndex, 1);
      commit("setCurrentSong", ...theSong); // splice返回的是一个数组
      commit("setCurrentIndex", suspIndex);
      // // TODO 删除歌曲并放至当前索引后播放
      // playlist = state.playlist.slice(0);
      // playlist.splice(suspIndex, 1);
      // currentIndex = state.currentIndex;
      // if (currentIndex > suspIndex) {
      //   currentIndex--;
      // }
      // playlist = [theSong, ...playlist];
    } else {
      // 先展示歌曲基本信息并推入playlist中
      song.imgUrl = DEFAULT_IMG_URL;
      commit("setCurrentSong", song);
      commit("addToPlaylist", song);
      // 设置为当前播放
      commit("setCurrentIndex", 0);
      // 先获取歌曲url并更新currentSong，让播放器开始播放
      songApi.getSongUrl(song.id).then(res => {
        song.url = res;
        commit("setCurrentSong", song);
      });
      playlist = state.playlist.slice(0);
      Promise.all([
        songApi.getLyric(song.id),
        songApi.getSongDetail(song.id)
      ]).then(resArr => {
        Object.assign(song, {
          lyric: resArr[0],
          imgUrl: resArr[1].album.picUrl,
          album: resArr[1].album.id
        });
        // 避免加载时切歌的情况
        if (state.currentIndex === 0) {
          // 未切歌
          playlist[0] = song;
          commit("setCurrentSong", song);
        } else {
          // 切歌后，获取此歌曲位置
          playlist = state.playlist.slice(0);
          const index = checkDuplicate(song.id, playlist);
          playlist[index] = song;
        }
      });
      // 最终提交，playlist中存在对song的闭包，异步操作完成后会自动更新
      commit("setPlaylist", playlist);
    }
  },
  setFullScreen({ commit }, val) {
    commit("setFullScreen", val);
  },
  setPlayingStatus({ commit }, val) {
    commit("setPlayingStatus", val);
  }
};
