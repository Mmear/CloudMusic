// 歌曲、歌手相关api
import { instance } from "./setting";
const errHandler = err => Promise.reject(err);
// 获取歌曲可用性
export const checkAvailability = id => {
  return instance
    .get(`/check/music?id=${id}`)
    .then(res => Promise.resolve(res.data.success))
    .catch(errHandler);
};
// 获取歌曲url
export const getSongUrl = id => {
  id = Array.isArray(id) ? id.join(",") : id;
  return instance
    .get(`/song/url?id=${id}`)
    .then(res => {
      return res.data.code === 200
        ? Promise.resolve(res.data.data[0].url)
        : "网络错误"; // res.data.data.url
    })
    .catch(errHandler);
};
// 获取歌词
export const getLyric = id => {
  return instance
    .get(`/lyric?id=${id}`)
    .then(res => {
      const data = res.data;
      if (data.lrc || data.klyric || data.tlyric) {
        return Promise.resolve({
          lyric: data.lrc, // 普通歌词
          klyric: data.klyric ? data.klyric : "",
          tlyric: data.tlyric ? data.tlyric : "" // 外文歌词翻译
        });
      }
    })
    .catch(errHandler);
};
// 获取歌曲详情
export const getSongDetail = id => {
  return instance
    .get(`/song/detail?ids=${id}`)
    .then(res => {
      const data = res.data.songs[0];
      return Promise.resolve({
        name: data.name,
        artists: data.ar,
        album: data.al // 包含歌曲封面
      });
    })
    .catch(errHandler);
};
// 获取专辑详情，其中每一条都是song形式
export const getAlbumDetail = id => {
  return instance
    .get(`/album?id=${id}`)
    .then(res => {
      const album = res.data.songs[0].al;
      const songList = res.data.songs.map(song => {
        return {
          artists: song.ar,
          alias: song.alia,
          name: song.name,
          songId: song.id
        };
      });
      return Promise.resolve({
        album: {
          name: album.name,
          coverUrl: album.picUrl,
          alias: album.alias,
        },  
        songList
      });
    })
    .catch(errHandler);
};

export default {
  checkAvailability,
  getSongUrl,
  getLyric,
  getSongDetail
}