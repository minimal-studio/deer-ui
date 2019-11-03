/* eslint-disable max-classes-per-file */
import React, { Component, PureComponent } from 'react';
import {
  getUIConfig, setUIConfig, $T, $T_IN
} from './config';

/**
 * 用于提供所有组件的通用函数
 * 通过继承 UIComponent 或者 UIPureComponent 获取通用函数
 */

export class UIComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {
  /** gm 将要弃用 */
  gm = $T;

  /** 外部国际化键值对 $T() */
  $T = $T;

  /** gmUke 将要弃用 */
  gmUke = $T_IN;

  /** 内部国际化键值对 $T_IN() */
  $T_IN = $T_IN;

  /** 获取内部配置 */
  getConfig = getUIConfig;

  /** 设置内部配置 */
  setConfig = setUIConfig;
}
export class UIPureComponent<P = {}, S = {}, SS = any> extends PureComponent<P, S, SS> {
  /** gm 将要弃用 */
  gm = $T;

  /** 外部国际化键值对 $T() */
  $T = $T;

  /** gmUke 将要弃用 */
  gmUke = $T_IN;

  /** 内部国际化键值对 $T_IN() */
  $T_IN = $T_IN;

  /** 获取内部配置 */
  getConfig = getUIConfig;

  /** 设置内部配置 */
  setConfig = setUIConfig;
}

// export {
//   UIComponent, UIPureComponent
// };
