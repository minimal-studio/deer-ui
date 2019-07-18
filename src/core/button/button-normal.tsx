/* eslint-disable react/button-has-type */

import React from 'react';

import { Call } from 'basic-helper';
import { tuple } from 'basic-helper/utils/type';
import { $T_UKE } from '../config';
import { Icon } from '../icon';

const ButtonHTMLTypes = tuple("button", "submit", "reset");
export type ButtonHTMLType = (typeof ButtonHTMLTypes)[number];


export interface ButtonProps {
  /** 是否加载中 */
  loading?: boolean;
  /** 是否需要加载中的提示 */
  loadingHint?: boolean;
  /** 加载中是否禁用 */
  loadingDisable?: boolean;
  /** 设置 btn 的 class */
  className?: string;
  /** 设置 btn 的 icon, 可以使用 iconMapper 来引用 */
  icon?: string;
  /** btn 的字 */
  text?: string;
  /** btn 内的布局 */
  textLayout?: string;
  /** children */
  children?: any;
  /** btn 的类型 */
  type?: ButtonHTMLType;
  /** btn 的颜色 [theme, red, gold...] */
  color?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击处理 */
  onClick?: Function;
}

const defaultProps = {
  loading: false,
  loadingHint: true,
  loadingDisable: true,
  disabled: false,
  type: 'button',
  color: 'theme',
  textLayout: 'a-i-c j-c-c',
  className: '',
  icon: '',
};

const Button: React.SFC<ButtonProps> = (props) => {
  const {
    loading, disabled, text = $T_UKE('提交'), icon, s, type, children,
    color, className, loadingHint, loadingDisable, textLayout, onClick,
    ...other
  } = props;

  const clickable = !disabled && (!loading || !loadingDisable);
  const iconDOM = icon ? (
    <Icon n={icon} s={s} classNames={['btn-icon']}/>
  ) : null;
  const loadingTip = loadingHint && loading ? (
    <Icon n="loading" s={s} classNames={['btn-loading ml5']}/>
  ) : null;

  return (
    <button
      {...other}
      disabled={!clickable}
      type={type}
      className={`btn flat ${color} ${className}`}
      onClick={(e) => {
        if (clickable) Call(onClick, e);
      }}>
      <span className={`layout ${textLayout}`}>
        {iconDOM}
        {children || text}
        {loadingTip}
      </span>
    </button>
  );
};

Button.defaultProps = defaultProps;

export default Button;
