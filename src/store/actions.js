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
    // 歌曲已经存在，直接播放歌曲
    if (suspIndex > -1) {
      // 改变当前索引
      const theSong = playlist.splice(suspIndex, 1);
      commit("setCurrentSong", ...theSong); // splice返回的是一个数组
      commit("setCurrentIndex", suspIndex);
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
      // 获取歌曲封面图以及歌词
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
          const index = checkDuplicate(playlist, song.id);
          playlist[index] = song;
        }
      });
      // 最终提交，存在对playlist的闭包，异步操作完成后会自动更新
      commit("setPlaylist", playlist);
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
    console.log(songs, activeIndex);
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
    const check = checkDuplicate(state.playlist, id);
    const currentIndex = state.currentIndex;
    if (check === -1) {
      return;
    }
    if (index === currentIndex) {
      // 如果移除的是当前播放中的歌曲，先暂停，选取播放列表第二首播放
      commit("setPlayingStatus", false);
    }
    let playlist = state.playlist.slice(0);
    let newIndex = currentIndex;
    playlist.splice(index, 1);
    commit("setPlaylist", playlist);
    // 如果当前newIndex > index，则后退一位，否则不变
    newIndex = newIndex > index ? newIndex - 1 : newIndex;
    // 如果删除的是第一个歌曲 || 删除后index = 0
    if (newIndex === 0) {
      if (index === 1) {
        return;
      }
      // 如果正在播放
      if (currentIndex === 0) {
        // 如果播放列表有剩余
        if (playlist.length > 0) {
          commit("setCurrentSongByIndex", newIndex);
        } else {
          commit("setCurrentIndex", -1);
        }
      } else {
        // 没在播放
        // do something
      }
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
