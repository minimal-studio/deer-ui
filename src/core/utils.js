
export function getScreenWidth() {
  return document.documentElement.clientWidth;
}
export function getScreenHeight() {
  return document.documentElement.clientHeight;
}

/** 如果 body 为 overflow: hidden, 则忽略 scrollTop */
export function getScrollTop(elem) {
  if(!elem && getComputedStyle(document.body).overflow === 'hidden') {
    return 0;
  }
  const _elem = elem || document.documentElement;
  return _elem.scrollTop;
}
