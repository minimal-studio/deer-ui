/* eslint-disable @typescript-eslint/no-use-before-define */

import { getScreenWidth, getScreenHeight } from './screen';

export type PopoverPosition = 'top' | 'right' | 'left' | 'bottom';
export interface PositionReturn {
  position: PopoverPosition;
  top: number;
  left: number;
}
export interface GetFuncParams {
  offsetTop: any;
  offsetLeft: any;
  offsetWidth: any;
  offsetHeight: any;
  elemWidth: any;
  elemHeight: any;
  fromRight?: boolean;
}

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
export function getLeft(params: GetFuncParams): PositionReturn {
  const {
    offsetLeft, elemWidth, offsetTop, fromRight,
    offsetWidth, offsetHeight, elemHeight,
  } = params;
  const left = offsetLeft - elemWidth - 12;
  if (left - elemWidth <= 0 && !fromRight) return getRight(params);
  // if(left + elemWidth > ScreenWidth) left = ScreenWidth - elemWidth;
  return {
    top: offsetTop - horizontalOffset,
    position: 'left',
    left
  };
}

export function getRight(params: GetFuncParams): PositionReturn {
  const {
    offsetLeft, elemWidth, offsetTop, fromRight,
    offsetWidth, offsetHeight, elemHeight,
  } = params;
  const left = offsetLeft + offsetWidth + 15;
  if (left + elemWidth >= ScreenWidth) return getLeft({ ...params, fromRight: true });
  // if(left - elemWidth <= 0) left = ScreenWidth - elemWidth;
  return {
    top: offsetTop - horizontalOffset,
    position: 'right',
    left
  };
}

export function getTop(params: GetFuncParams): PositionReturn {
  const {
    offsetLeft, elemWidth, offsetTop, fromRight,
    offsetWidth, offsetHeight, elemHeight,
  } = params;
  const top = offsetTop - elemHeight - offsetHeight / 2;
  if (top - elemHeight <= 0) return getBottom(params);
  return {
    top,
    position: 'top',
    left: offsetLeft - verticalOffset
  };
}

export function getBottom(params: GetFuncParams): PositionReturn {
  const {
    offsetLeft, elemWidth, offsetTop, fromRight,
    offsetWidth, offsetHeight, elemHeight,
  } = params;
  const top = offsetTop + offsetHeight + offsetHeight / 2;
  if (top + elemHeight >= ScreenHeight) return getTop(params);
  return {
    top,
    position: 'bottom',
    left: offsetLeft - verticalOffset
  };
}
