import React, { Component, PureComponent } from 'react';
import {
  getUkelliConfig, setUkelliConfig, $T, $T_UKE
} from '../config';

/**
 * 用于提供所有 uke 组件的通用函数
 * 通过继承 UkeComponent 或者 UkePureComponent 获取通用函数
 */

export class UkeComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {
  /** gm 将要弃用 */
  gm = $T;

  /** 外部国际化键值对 $T() */
  $T = $T;

  /** gmUke 将要弃用 */
  gmUke = $T_UKE;

  /** uke 内部国际化键值对 $T_UKE() */
  $T_UKE = $T_UKE;

  /** 获取 uke 内部配置 */
  getConfig = getUkelliConfig;

  /** 设置 uke 内部配置 */
  setConfig = setUkelliConfig;
}
export class UkePureComponent<P = {}, S = {}, SS = any> extends PureComponent<P, S, SS> {
  /** gm 将要弃用 */
  gm = $T;

  /** 外部国际化键值对 $T() */
  $T = $T;

  /** gmUke 将要弃用 */
  gmUke = $T_UKE;

  /** uke 内部国际化键值对 $T_UKE() */
  $T_UKE = $T_UKE;

  /** 获取 uke 内部配置 */
  getConfig = getUkelliConfig;

  /** 设置 uke 内部配置 */
  setConfig = setUkelliConfig;
}

// export {
//   UkeComponent, UkePureComponent
// };
