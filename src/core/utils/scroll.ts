/**
 * 获取目标元素的 scrollTop
 * 如果 body 为 overflow: hidden, 则忽略 scrollTop
 */
export function getScrollTop(elem?) {
  if (!elem && getComputedStyle(document.body).overflow === 'hidden') {
    return 0;
  }
  const _elem = elem || document.documentElement;
  return _elem.scrollTop;
}

/**
 * 获取目标元素的 scrollLeft
 * 如果 body 为 overflow: hidden, 则忽略 scrollLeft
 */
export function getScrollLeft(elem?) {
  if (!elem && getComputedStyle(document.body).overflow === 'hidden') {
    return 0;
  }
  const _elem = elem || document.documentElement;
  return _elem.scrollLeft;
}
