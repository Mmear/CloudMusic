import songApi from "@/api/composionQuery";
// 检查是否有重复的歌曲，有则重新播放该歌曲并放至顶端
const DEFAULT_IMG_URL = require("@/assets/img/logo.png");
const checkDuplicate = (songList, id) => {
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
    let suspIndex = checkDuplicate(state.playlist, song.id);
    let playlist = state.playlist.slice(0);
    // song.album.picUrl = DEFAULT_IMG_URL;
    // 歌曲已经存在，直接播放歌曲
    if (suspIndex > -1) {
      // 改变当前索引
      const theSong = playlist.splice(suspIndex, 1);
      commit("setCurrentSong", ...theSong); // splice返回的是一个数组
      commit("setCurrentIndex", suspIndex);
    } else {
      commit("addToPlaylist", song);
      commit("setCurrentSong", song);
      commit("setCurrentIndex", 0);
    }
  },
  /**
   * @description 插入多条歌曲至播放列表中
   * @param {Array} songs   要添加的歌曲列表
   * @param {number} activeIndex 当前选中的歌曲在songs中的位置
   */
  insertSongs({ state, commit }, { songs, activeIndex }) {
    if (!Array.isArray(songs)) {
      return;
    }
    let playlist = state.playlist.slice(0);
    let activeId = songs[activeIndex].id;
    const check_curry = checkDuplicate.bind(null, playlist);
    // 获取不重复的歌曲
    songs = songs.filter(item => {
      return check_curry(item.id) === -1;
    });
    // 将传入的歌曲列表添加至播放列表头部
    playlist = [...songs, ...playlist];
    // 如果选中的歌曲之前在播放列表中
    if (playlist[activeIndex] && playlist[activeIndex].id !== activeId) {
      // 重新计算一遍现在的index
      activeIndex = check_curry(null, playlist);
    }
    commit("setPlaylist", playlist);
    commit("setCurrentSong", playlist[activeIndex]);
    commit("setCurrentIndex", activeIndex);
  },
  setFullScreen({ commit }, val) {
    commit("setFullScreen", val);
  },
  // 设置播放状态
  setPlayingStatus({ commit }, val) {
    commit("setPlayingStatus", val);
  },
  // 从播放列表中移除指定序号的歌曲
  removeSong({ state, commit }, { id, index }) {
    if (checkDuplicate(state.playlist, id) === -1) {
      return;
    }
    const currentIndex = state.currentIndex;
    let playlist = state.playlist.slice(0);
    playlist.splice(index, 1);
    commit("setPlaylist", playlist);
    // 如果currentIndex > index，则后退一位，否则不变
    let newIndex = currentIndex > index ? currentIndex - 1 : currentIndex;
    if (newIndex === currentIndex) {
      // 播放列表为空
      if (playlist.length <= 0) {
        commit("setCurrentIndex", -1) 
        return;
      }
      // 删除了最后一首，且正在播放
      if (newIndex >= playlist.length) {
        newIndex = 0;
      }
      // newIndex = currentIndex 的状态不会被watch到
      commit("setCurrentSong", playlist[newIndex]);
    }
    commit("setCurrentIndex", newIndex);
  },
  // 移除所有歌曲
  removeAllSongs({ commit }) {
    const playlist = [];
    commit("setCurrentIndex", -1);
    commit("setPlaylist", playlist);
  }
};
