
export function getScreenWidth() {
  return document.documentElement.clientWidth;
}
export function getScreenHeight() {
  return document.documentElement.clientHeight;
}
export function getScrollTop(elem) {
  elem = elem || document.documentElement;
  return elem.scrollTop;
}