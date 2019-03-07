// 工具函数
export const domUtils = {
  /**
   * 判断DOM元素是否有该类名
   * @param {HTMLElement} el dom元素
   * @param {string} cName 类名
   */
  hasClass(el, cName = "") {
    // const elClassList = el.className;
    // if (cName && el.classList && el.classList.contains) {
    //   return el.classList.contains(cName);
    // } else {
    //   return (elClassList.indexOf(cName) === -1);
    // }
    return el.classList.contains(cName);
  },
  /**
   * 向指定DOM添加类
   * @param {HTMLElement} el
   * @param {string|Array} cName
   */
  addClass(el, cName = "") {
    typeof cName === "string"
      ? el.classList.add(cName)
      : Array.isArray(cName)
      ? el.classList.add(...cName)
      : "";
  },
  /**
   *
   * @param {HTMLElement} el
   * @param {string} attr 自定义属性值，一般以'data-xxx'存在，传入后半段
   * @param {*} val
   */
  customAttribute(el, attr = "", val) {
    return val ? (el.dataset[attr] = val) : el.dataset[attr];
  },
  // 节流函数
  debounce(fn, delay) {
    let timer = null;
    return function(...args) {
      timer
        ? clearTimeout(timer)
        : (timer = setTimeout(() => {
            fn.apply(this, args);
          }, delay));
    };
  }
};
/**
 * 时间戳转换
 * @param {number} time 传入秒时间
 */
export const timeParser = (time) => {
  time = Math.floor(time);
  const min = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
};
