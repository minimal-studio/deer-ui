
import { getScreenWidth, getScreenHeight, getScrollTop } from '../utils';

let sideOffsetTop = -10;
let ScreenWidth = getScreenWidth();
let ScreenHeight = getScreenHeight();

window.onresize = () => {
  ScreenWidth = getScreenWidth();
  ScreenHeight = getScreenHeight();
};

/**
 * 计算最终的 top 和 left，并且根据浏览器可视边界判断最终结果
 */
export function getLeft(offsetTop, offsetLeft, offsetWidth, offsetHeight, width, height, fromRight = false) {
  let left = offsetLeft - width - 12;
  if(left - width <= 0 && !fromRight) return getRight(...arguments);
  // if(left + width > ScreenWidth) left = ScreenWidth - width;
  return {
    top: offsetTop + sideOffsetTop,
    left
  };
}

export function getRight(offsetTop, offsetLeft, offsetWidth, offsetHeight, width, height) {
  let left = offsetLeft + offsetWidth + 15;
  if(left + width >= ScreenWidth) return getLeft(...arguments, true);
  // if(left - width <= 0) left = ScreenWidth - width;
  return {
    top: offsetTop + sideOffsetTop,
    left
  };
}

export function getTop(offsetTop, offsetLeft, offsetWidth, offsetHeight, width, height) {
  let scroll = getScrollTop();
  let top = offsetTop - height - offsetHeight / 2;
  if(top - height - scroll <= 0) return getBottom(...arguments);
  return {
    top,
    left: offsetLeft
  };
}

export function getBottom(offsetTop, offsetLeft, offsetWidth, offsetHeight, width, height) {
  let scroll = getScrollTop();
  let top = offsetTop + offsetHeight + offsetHeight / 2;
  if(top + height - scroll >= ScreenHeight) return getTop(...arguments);
  return {
    top,
    left: offsetLeft
  };
}