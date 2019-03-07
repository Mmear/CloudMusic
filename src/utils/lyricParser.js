// 歌词转换器
const STATE_PAUSE = 0;
const STATE_PLAYING = 1;
const tagRegMap = {
  title: "ti",
  artist: "ar",
  album: "al",
  offset: "offset",
  by: "by"
};
const timeRegx = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))]/;
const noop = () => {};

export default class Lyric {
  constructor(lrc, handler = noop) {
    this.lrc = lrc;
    this.handler = handler; // 回调函数
    this.tags = {}; // 歌词中的歌曲信息
    this.lines = []; // 处理后的歌词
    this.state = STATE_PAUSE; // 当前播放器状态
    this.currentLine = 0; // 当前行数
    this._init(); // 初始化歌词转换器
  }
  _init() {
    this._initTag();
    this._initLines();
  }
  // 正则匹配tag
  _initTag() {
    for (let tag in tagRegMap) {
      const matches = this.lrc.match(`\\[${tagRegMap[tag]}:([^\\]]*)]`, "i");
      this.tags[tag] = (matches && matches[1]) || "";
    }
  }
  _initLines() {
    // 通过换行符划分歌词
    const allLines = this.lrc.split("\n");
    allLines.forEach(line => {
      const result = timeRegx.exec(line);
      if (result) {
        const txt = line.replace(timeRegx, "").trim(); // 将时间部分替换为空字符
        if (txt) {
          this.lines.push({
            // 转换为毫秒
            time:
              result[1] * 60 * 1000 +
              result[2] * 1000 +
              (result[3] * 1 || 0), // 将字符串转为数字
            txt
          });
        }
      }
    });
    this.lines.sort((a, b) => a.time - b.time);
  }
  _findCurNum(time) {
    // 找到第一个小于等于传入时间的行
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      if (time <= line.time) {
        return i;
      }
    }
    return this.lines.length - 1;
  }
  _callHandler(i) {
    if (i < 0) return;
    this.handler({ txt: this.lines[i].txt, lineNum: i });
  }
  _playRest() {
    const line = this.lines[this.currentLine];
    const delay = line.time - (+new Date() - this.startStamp); // 计算可能的延迟
    this.timer = setTimeout(() => {
      this._callHandler(this.currentLine++);
      if (
        this.currentLine < this.lines.length &&
        this.state === STATE_PLAYING
      ) {
        this._playRest();
      }
    }, delay);
  }
  play(startTime = 0, skipLast) {
    if (!this.lines.length) {
      return;
    }
    this.state = STATE_PLAYING;
    this.currentLine = this._findCurNum(startTime);
    this.startStamp = +new Date() - startTime;
    if (!skipLast) {
      this._callHandler(this.currentLine - 1);
    }
    if (this.currentLine < this.lines.length) {
      clearTimeout(this.timer);
      this._playRest();
    }
  }
  togglePlay() {
    const now = +new Date();
    if (this.state === STATE_PLAYING) {
      this.stop();
      clearTimeout(this.timeRegx);
      this.pauseStamp = now;
    } else {
      this.state = STATE_PLAYING;
      this.play((this.pauseStamp || now) - (this.startStamp || now), true);
      this.pauseStamp = 0;
    }
  }
  stop() {
    this.state = STATE_PAUSE;
    clearTimeout(this.timer);
  }
  seek(offset) {
    this.play(offset);
  }
  getLines() {
    return this.lines;
  }
}
