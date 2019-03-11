export const setItem = (key, val) => {
  window.localStorage.setItem(key, JSON.stringify(val));
};
export const getItem = (key) => {
  return JSON.parse(window.localStorage.getItem(key));
}

export default {
  setItem,
  getItem
}