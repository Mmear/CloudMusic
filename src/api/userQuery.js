// 用户相关api
import {instance} from "./setting";
const errHandler = err => Promise.reject(err);
export const emailLogin = (email, pass) => {
  return instance.get(`/login?email=${email}&password=${pass}`).then(res => {
    if (res.data.code === 502) {
      return Promise.reject('密码错误');
    } else if (res.data.code === 200) {
      const data = res.data;
      return Promise.resolve(data.account.id);
    }
  }).catch(errHandler);
}
export const cellPhoneLogin = (cellphone, pass) => {
  return instance.get(`/login/cellphone?phone=${cellphone}&password=${pass}`).then(res => {
    if (res.data.code === 502) {
      return Promise.reject('密码错误');
    } else if (res.data.code === 200) {
      const data = res.data.profile;
      return Promise.resolve({
        id: data.userId,
        avatarUrl: data.avatarUrl,
        name: data.nickname,
        signature: data.signature,
        backgroundUrl: data.backgroundUrl,
      });
    }
  }).catch(errHandler);
}
export const logOut = () => {
  return instance.get(`/logout`).then(res => {
    return Promise.resolve(res.data.code);
  })
}
// 获取用户信息（登录） , 歌单，收藏，mv, dj 数量  /user/subcount
export const getSubcount = () => {
  return instance.get(`/user/subcount`).then(res => {
    return Promise.resolve(res.data);
  })
}
// 获取用户详情 /user/detail?uid=32953014
export const getUserDetail = (id) => {
  return instance.get(`/user/detail?uid=${id}`).then(res => {
    return Promise.resolve({
      level: res.data.level,
      listenSongs: res.data.listenSongs,
    });
  }).catch(errHandler);
}
// 获取用户歌单 调用此接口, 传入用户 id, 可以获取用户歌单 /user/playlist?uid = 32953014
export const getUserPlaylist = (id) => {
  return instance.get(`/user/playlist?uid=${id}`).then(res => {
    const data = res.data.playlist.map(col => {
      return {
        name: col.name,
        id: col.id,
        tags: col.tags,
        picUrl: col.coverImgUrl,
        creator: {
          userId: col.creator.userId,
          name: col.creator.nickname,
          avatarUrl: col.creator.avatarUrl
        },
        trackCount: col.trackCount
      }
    })
    return Promise.resolve({cols: data});
  }).catch(errHandler);
}

export const getPersonalFM = () => {

}
export default {
  emailLogin,
  cellPhoneLogin,
  logOut,
  getSubcount,
  getUserDetail,
  getUserPlaylist
}