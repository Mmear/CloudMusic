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

export const recommend = {
  getBanners,
  getRecomColList,
  getPersonalColList,
  getRecomMusicList,
  getPersonalMusicList
};
