/* eslint-disable max-classes-per-file */
import React, { Component, PureComponent } from 'react';
import { IsFunc } from '@mini-code/base-func';
import {
  getUIConfig, setUIConfig, $T, $T_IN
} from './config';

/**
 * 加载 React 元素
 */
export const loadPlugin = (Plugin, props) => {
  if (!Plugin) return null;
  const P = IsFunc(Plugin) ? (
    <Plugin {...props} />
  ) : React.cloneElement(Plugin, props);

  return P;
};

/**
 * 用于提供所有组件的通用函数
 * 通过继承 UIComponent 或者 UIPureComponent 获取通用函数
 */

export class UIComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {
  /** 外部国际化键值对 $T() */
  $T = $T;

  /** 内部国际化键值对 $T_IN() */
  $T_IN = $T_IN;

  /** 获取内部配置 */
  getConfig = getUIConfig;

  /** 设置内部配置 */
  setConfig = setUIConfig;

  loadPlugin = loadPlugin;
}
export class UIPureComponent<P = {}, S = {}, SS = any> extends PureComponent<P, S, SS> {
  /** 外部国际化键值对 $T() */
  $T = $T;

  /** 内部国际化键值对 $T_IN() */
  $T_IN = $T_IN;

  /** 获取内部配置 */
  getConfig = getUIConfig;

  /** 设置内部配置 */
  setConfig = setUIConfig;

  loadPlugin = loadPlugin;
}

// export {
//   UIComponent, UIPureComponent
// };
