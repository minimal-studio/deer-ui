
import { getScreenWidth, getScreenHeight, getScrollTop } from '../utils';

let ScreenWidth = getScreenWidth();
let ScreenHeight = getScreenHeight();

const verticalOffset = 14;
const horizontalOffset = 4;

window.onresize = () => {
  ScreenWidth = getScreenWidth();
  ScreenHeight = getScreenHeight();
};

/**
 * 计算最终的 top 和 left，并且根据浏览器可视边界判断最终结果
 */
export function getLeft(offsetTop, offsetLeft, offsetWidth, offsetHeight, elemWidth, elemHeight, fromRight = false) {
  let left = offsetLeft - elemWidth - 12;
  if(left - elemWidth <= 0 && !fromRight) return getRight(...arguments);
  // if(left + elemWidth > ScreenWidth) left = ScreenWidth - elemWidth;
  return {
    top: offsetTop - horizontalOffset,
    position: 'left',
    left
  };
}

export function getRight(offsetTop, offsetLeft, offsetWidth, offsetHeight, elemWidth, elemHeight) {
  let left = offsetLeft + offsetWidth + 15;
  if(left + elemWidth >= ScreenWidth) return getLeft(...arguments, true);
  // if(left - elemWidth <= 0) left = ScreenWidth - elemWidth;
  return {
    top: offsetTop - horizontalOffset,
    position: 'right',
    left
  };
}

export function getTop(offsetTop, offsetLeft, offsetWidth, offsetHeight, elemWidth, elemHeight) {
  let top = offsetTop - elemHeight - offsetHeight / 2;
  if(top - elemHeight <= 0) return getBottom(...arguments);
  return {
    top,
    position: 'top',
    left: offsetLeft - verticalOffset
  };
}

export function getBottom(offsetTop, offsetLeft, offsetWidth, offsetHeight, elemWidth, elemHeight) {
  let top = offsetTop + offsetHeight + offsetHeight / 2;
  if(top + elemHeight >= ScreenHeight) return getTop(...arguments);
  return {
    top,
    position: 'bottom',
    left: offsetLeft - verticalOffset
  };
}