import React, { Component, PureComponent } from 'react';
import { getUkelliConfig, setUkelliConfig, $T, $T_UKE } from '../config';

/**
 * 用于提供所有 uke 组件的通用函数
 * 通过继承 UkeComponent 或者 UkePureComponent 获取通用函数
 */

const UkeComponentFac = (Com) => class C extends Com {
  /** 外部国际化键值对 $T() */
  gm = $T;
  $T = $T;
  /** uke 内部国际化键值对 $T_UKE() */
  gmUke = $T_UKE;
  $T_UKE = $T_UKE;
  /** 获取 uke 内部配置 */
  getConfig = getUkelliConfig;
  /** 设置 uke 内部配置 */
  setConfig = setUkelliConfig;
};

const UkeComponent = UkeComponentFac(Component);
const UkePureComponent = UkeComponentFac(PureComponent);

export {
  UkeComponent, UkePureComponent
};