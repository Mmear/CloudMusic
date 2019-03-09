//* 处理多个视图依赖或需要更改的状态
//* 单状态树下的模块化
const PLAY_MODE = {
  LOOP: Symbol("LOOP"), // 单曲循环
  RANDOM: Symbol("RANDOM"), // 随机播放
  LISTLOOP: Symbol("LISTLOOP") // 列表循环/顺序播放
};
export default {
  expandPlayer: false, // 是否展开播放器
  playing: false, // 是否处于播放状态
  mode: PLAY_MODE.LISTLOOP,
  playlist: [], // 用户播放列表 >0 播放器显示
  currentIndex: -1, // 当前播放索引
  user: {
    //! 用户信息 可能需要分出模块
    userId: "",
    nickName: "",
    avatarUrl: ""
  },
  identified: false, // 已登录
  currentSong: {
    //~ 当前激活歌曲
    id: "",
    name: "",
    artists: [] // 当前激活歌曲作者 {id:[string], name: [string], imgUrl: [string]}
  },
  songCol: {
    id: "",
    name: "",
    imgUrl: "",
    songList: []
  } // 当前歌单
  // searchHistory: [] // 搜索历史
};
export { PLAY_MODE };
