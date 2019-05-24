import { getScrollTop } from './utils';

export default function setDOMById(targetID, className = '') {
  if(!targetID) console.log('params id is required');
  let targetDOM = document.getElementById(targetID);
  if(!targetDOM) {
    targetDOM = document.createElement('div');
    targetDOM.id = targetID;
    targetDOM.className = className;
    document.body.appendChild(targetDOM);
  }
  return targetDOM;
}

export function getElementLeft(element) {
  return getElementOffset(element).offsetLeft;
}

export function getElementTop(element) {
  return getElementOffset(element).offsetTop;
}

export function getElementOffset(element) {
  if(!element) return;
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

export function getElementOffsetInfo(element) {
  const { offsetHeight, offsetWidth } = element;
  return {
    ...getElementOffset(element),
    offsetHeight, offsetWidth
  };
}