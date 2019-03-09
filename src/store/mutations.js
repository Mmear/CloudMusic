const _init =  (state) => {
  const noop = {
    id: "",
    name: "",
    artists: []
  };
  state.currentSong = noop;
  state.expandPlayer = false;
  state.playing = false;
}
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
  setMode(state, val) {
    state.mode = val;
  },
  setPlaylist(state, val) {
    state.playlist = val;
  },
  setCurrentSongByIndex(state, val) {
    if (val !== state.currentIndex) return;
    state.currentSong = state.playlist[val];
  },
  setCurrentSong(state, val) {
    state.currentSong = val;
  },
  setCurrentIndex(state, val) {
    const noop = {
      id: "",
      name: "",
      artists: [],
    };
    if (val === -1) {
      _init(state);
    }
    state.currentIndex = val;
  },
  // 插入一首歌曲至当前播放列表顶部
  addToPlaylist(state, song) {
    state.playlist = [song, ...state.playlist];
  }
};
