import { getScrollTop } from './utils';

/**
 * 在 document.body 中创建指定 ID 的元素，并返回该元素的引用
 * @param targetID 设置的元素的 ID
 * @param className 设置的元素的 class
 */
export default function setDOMById(targetID: string, className = '') {
  if (!targetID) console.log('params id is required');
  let targetDOM = document.getElementById(targetID);
  if (!targetDOM) {
    targetDOM = document.createElement('div');
    targetDOM.id = targetID;
    targetDOM.className = className;
    document.body.appendChild(targetDOM);
  }
  return targetDOM;
}

/**
 * 获取元素的 OffsetLeft 和 OffsetTop 信息，包括滚动后的偏移量
 */
export function getElementOffset(element) {
  if (!element) return null;
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
