import { instance } from "@/api/setting";
const errHandler = err => Promise.reject(err);
export const getBanners = () => {
  return instance
    .get("/banner")
    .then(res => {
      return Promise.resolve(
        res.data.banners.map(banner => ({
          imgUrl: banner.imageUrl,
          titleColor: banner.titleColor,
          typeTitle: banner.typeTitle,
          url: banner.url,
          targetId: banner.targetId,
          encodeId: banner.encodeId
        }))
      );
    })
    .catch(errHandler);
};
// 验证登录状态
export const getStatus = () => {
  return instance
    .get("/login/status")
    .then(res => {
      return Promise.resolve(res.data);
    })
    .catch(errHandler);
};
// 获取推荐列表
export const getRecomColList = () => {
  return instance
    .get("/personalized")
    .then(res => {
      return Promise.resolve(res.data.result);
    })
    .catch(errHandler);
};
// 获取个性化推荐列表 需登录
export const getPersonalColList = () => {};
// 获取最新歌曲
export const getRecomMusicList = () => {
  return instance
    .get("/personalized/newsong")
    .then(res => {
      return Promise.resolve(res.data.result.map(music => music.song));
    })
    .catch(errHandler);
};
// 获取个性化推荐歌曲 需登录
export const getPersonalMusicList = () => {};
// 获取歌单详细信息
export const getColListDetail = id => {
  return instance
    .get(`/playlist/detail?id=${id}`)
    .then(res => {
      const data = res.data.playlist;
      const tracks = data.tracks.map(({ name, id, ar, al }) => {
        return {
          id,
          name,
          artists: ar,
          album: { id: al.id, name: al.name, picUrl: al.picUrl }
        };
      });
      return Promise.resolve({
        id: data.id,
        name: data.name,
        tracks,
        desc: data.description,
        tags: data.tags,
        creator: {
          avatarUrl: data.creator.avatarUrl,
          name: data.creator.nickname,
          userId: data.creator.userId,
        },
        coverImgUrl: data.coverImgUrl,
        shareCount: data.shareCount,
        commentCount: data.commentCount,
        playCount: data.playCount,
        subscribedCount: data.subscribedCount,
      });
    })
    .catch(errHandler);
};
export const getHotSearch = () => {
  return instance.get('/search/hot').then(res => {
    return Promise.resolve(res.data.result.hots);
  }).catch(errHandler);
}
export const searchByKeyword = keyword => {
  return instance.get(`/search/suggest?keywords=${keyword}`).then(res => {
    return Promise.resolve(res.data.result);
  }).catch(errHandler);
}
export const recommend = {
  getBanners,
  getRecomColList,
  getPersonalColList,
  getRecomMusicList,
  getPersonalMusicList
};
