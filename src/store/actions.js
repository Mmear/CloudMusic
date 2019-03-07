import songApi from "@/api/composionQuery";
// 检查是否有重复的歌曲，有则重新播放该歌曲并放至顶端
const DEFAULT_IMG_URL = require("@/assets/img/logo.png");
const checkDuplicate = (id, songList) => {
  return songList.findIndex(item => {
    return item.id === id;
  });
};
export default {
  // 更改播放状态
  changePlayerStatus({ commit }) {
    commit("changePlayerStatus");
  },
  // 插入一条歌曲至播放列表顶部
  insertSong({ state, commit }, song) {
    // console.log("[Action:insertSong] " + JSON.stringify(song));
    commit("setFullScreen", true);
    // commit("setPlayingStatus", true);
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
          allLyric: resArr[0],
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
      // 最终提交，存在对playlist的闭包，异步操作完成后会自动更新
      commit("setPlaylist", playlist);
    }
  },
  setFullScreen({ commit }, val) {
    commit("setFullScreen", val);
  },
  // 设置播放状态
  setPlayingStatus({ commit }, val) {
    commit("setPlayingStatus", val);
  },
  // 从播放列表中移除指定序号的歌曲
  removeSong({ state, commit }, {id, index}) {
    const check = checkDuplicate(id, state.playlist);
    if (check === -1) {
      return;
    } else if (index === state.currentIndex) {
      commit('setPlayingStatus', false);
    }
    let playlist = state.playlist.slice(0);
    let newIndex = state.currentIndex;
    playlist.splice(index, 1);
    newIndex = newIndex >= index ? newIndex - 1 : newIndex;
    commit('setPlaylist', playlist);
    commit('setCurrentIndex', newIndex);
  },
  // 移除所有歌曲
  removeAllSongs({ commit }) {
    const playlist = [];
    commit("setCurrentIndex", -1);
    commit("setPlaylist", playlist);
  }
};
