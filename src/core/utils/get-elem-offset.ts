import { getScrollTop } from './scroll';

interface GetElementOffsetReturn {
  offsetLeft: number;
  offsetTop: number;
}

/**
 * 获取元素的 OffsetLeft 和 OffsetTop 信息，包括滚动后的偏移量
 */
export function getElementOffset(element): GetElementOffsetReturn {
  if (!element) {
    throw Error('需要传入 Element');
  }
  let actualTop = element.offsetTop;
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;
  while (current !== null) {
    actualLeft += (current.offsetLeft + current.clientLeft - current.scrollLeft);
    actualTop += (current.offsetTop + current.clientTop - current.scrollTop);
    current = current.offsetParent;
  }
  /** 需要把 body 的滚动加上 */
  actualTop -= getScrollTop();
  return {
    offsetLeft: actualLeft,
    offsetTop: actualTop
  };
}

/**
 * 获取元素的 offsetLeft
 */
export function getElementLeft(element) {
  return getElementOffset(element).offsetLeft;
}

/**
 * 获取元素的 offsetTop
 */
export function getElementTop(element) {
  return getElementOffset(element).offsetTop;
}

/**
 * 获取元素的 Offset 信息
 */
export function getElementOffsetInfo(element) {
  const { offsetHeight, offsetWidth } = element;
  return {
    ...getElementOffset(element),
    offsetHeight,
    offsetWidth
  };
}
