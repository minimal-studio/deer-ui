/* eslint-disable @typescript-eslint/no-use-before-define */

import { getScreenWidth, getScreenHeight } from './screen';

export type PopoverPosition = 'top' | 'right' | 'left' | 'bottom';
export interface PositionReturn {
  position: PopoverPosition;
  top: number;
  left: number;
}
export interface GetFuncParams {
  /** 相对元素的属性 */
  offsetTop: number;
  /** 相对元素的属性 */
  offsetLeft: number;
  /** 相对元素的属性 */
  offsetWidth: number;
  /** 相对元素的属性 */
  offsetHeight: number;
  /** 当前需要定位的元素的属性 */
  elemWidth: number;
  /** 当前需要定位的元素的属性 */
  elemHeight: number;
  /** 内部属性 */
  verticalOffset?: number;
  /** 内部属性 */
  _fromInternal?: boolean;
}

const horizontalOffset = 4;

// let ScreenWidth = getScreenWidth();
// let ScreenHeight = getScreenHeight();
// if (!global) {
//   window.onresize = () => {
//     ScreenWidth = getScreenWidth();
//     ScreenHeight = getScreenHeight();
//   };
// }

/**
 * 计算最终的 top 和 left，并且根据浏览器可视边界判断最终结果
 */
export function getLeft(params: GetFuncParams): PositionReturn {
  const {
    offsetLeft, elemWidth, offsetTop, _fromInternal,
    offsetWidth, offsetHeight, elemHeight,
  } = params;
  const left = offsetLeft - elemWidth - 12;
  if (left - elemWidth <= 0 && !_fromInternal) return getRight({ ...params, _fromInternal: true });
  // if(left + elemWidth > ScreenWidth) left = ScreenWidth - elemWidth;
  return {
    top: offsetTop - horizontalOffset,
    position: 'left',
    left
  };
}

export function getRight(params: GetFuncParams): PositionReturn {
  const {
    offsetLeft, elemWidth, offsetTop, _fromInternal,
    offsetWidth, offsetHeight, elemHeight,
  } = params;
  const left = offsetLeft + offsetWidth + 15;
  if (left + elemWidth >= getScreenWidth() && !_fromInternal) return getLeft({ ...params, _fromInternal: true });
  // if(left - elemWidth <= 0) left = ScreenWidth - elemWidth;
  return {
    top: offsetTop - horizontalOffset,
    position: 'right',
    left
  };
}

export function getTop(params: GetFuncParams): PositionReturn {
  const {
    offsetLeft, elemWidth, offsetTop, _fromInternal, verticalOffset = 0,
    offsetWidth, offsetHeight, elemHeight,
  } = params;
  const top = offsetTop - elemHeight - offsetHeight / 2;
  if (top - elemHeight <= 0 && !_fromInternal) return getBottom({ ...params, _fromInternal: true });
  return {
    top,
    position: 'top',
    left: offsetLeft - verticalOffset
  };
}

export function getBottom(params: GetFuncParams): PositionReturn {
  const {
    offsetLeft, elemWidth, offsetTop, _fromInternal, verticalOffset = 0,
    offsetWidth, offsetHeight, elemHeight,
  } = params;
  const top = offsetTop + offsetHeight + offsetHeight / 2;
  if (top + elemHeight >= getScreenHeight() && !_fromInternal) return getTop({ ...params, _fromInternal: true });
  return {
    top,
    position: 'bottom',
    left: offsetLeft - verticalOffset
  };
}
