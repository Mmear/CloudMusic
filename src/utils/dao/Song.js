import Artist from './Artist';
// 歌曲类
class Song {
  // 传入一个歌曲对象
  constructor(id, name, artists, url, coverPic) {
    this.id = id;
    this.name = name;
    this.artists = artists instanceof Artist ? artists : undefined;
    this.url = url;
    this.coverPic = coverPic;
  }
}
