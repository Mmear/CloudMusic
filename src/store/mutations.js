export default {
  changePlayerStatus(state) {
    // 更改normal播放器的状态（展开，收起）
    state.expandPlayer = !state.expandPlayer;
  },
  setFullScreen(state, val) {
    state.expandPlayer = val;
  },
  setPlayingStatus(state, val) {
    state.playing = val;
  },
  setPlaylist(state, val) {
    state.playlist = val;
  },
  setCurrentSong(state, val) {
    state.currentSong = Object.assign({}, state.currentSong, val);
  },
  setCurrentIndex(state, val) {
    state.currentIndex = val;
  },
  // 插入一首歌曲至当前播放列表顶部
  addToPlaylist(state, song) {
    state.playlist = [song, ...state.playlist];
  }
};
