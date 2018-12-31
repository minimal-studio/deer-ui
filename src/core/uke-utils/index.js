import React, { Component, PureComponent } from 'react';
import { getUkelliConfig, setUkelliConfig } from '../config';

// class Basic {
//   gm = window.$UKE.getKeyMap;
//   gmUke = window.$UKE.getUkeKeyMap;
//   getConfig = getUkelliConfig;
//   setConfig = setUkelliConfig;
// }

/**
 * 用于提供所有 uke 组件的通用函数
 * 通过继承 UkeComponent 或者 UkePureComponent 获取通用函数
 */

const UkeComponentFac = (Com) => class C extends Com {
  /** 外部国际化键值对 getKeyMap() */
  gm = window.$UKE.getKeyMap;
  /** uke 内部国际化键值对 getUkeKeyMap() */
  gmUke = window.$UKE.getUkeKeyMap;
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