/* eslint-disable react/button-has-type */

import React from 'react';

import { Call } from 'basic-helper';
import { $T_UKE } from '../config';
import { Icon } from '../icon';
import { IconProps } from '../icon/icon';
import { StatusColorTypes, NatureColorTypes } from '../utils/props';

type ButtonSize = 'lg' | 'md' | 'sm';

export interface ButtonProps extends IconProps {
  /** 是否加载中 */
  loading?: boolean;
  /** 是否需要加载中的提示 */
  loadingHint?: boolean;
  /** 加载中是否禁用 */
  loadingDisable?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 按钮样式是否中空 */
  hola?: boolean;
  /** 是否占据一行 */
  block?: boolean;
  /** 设置 btn 的 class */
  className?: string;
  /** 设置 btn 的 icon, 可以使用 iconMapper 来引用 */
  icon?: string;
  /** btn 的字 */
  text?: string;
  /** btn 内的布局 */
  textLayout?: string;
  /** btn 的状态 */
  status?: StatusColorTypes | 'link';
  /** btn 的颜色 */
  color?: NatureColorTypes;
  /** size */
  size?: ButtonSize;
  /** children */
  children?: any;
  /** btn 的类型 */
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  /** 点击处理 */
  onClick?: () => void;
}

const defaultProps = {
  loading: false,
  loadingHint: true,
  loadingDisable: true,
  disabled: false,
  textLayout: 'a-i-c j-c-c',
  className: '',
  icon: '',
};

const Button: React.SFC<ButtonProps> = (props) => {
  const {
    loading, disabled, text = $T_UKE('提交'), icon, s, type = 'button', children,
    status, color = 'theme', size = 'md', block = false, className, hola = false,
    loadingHint, loadingDisable, textLayout, onClick,
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
      className={`btn ${status || color} ${size} ${className}${hola ? ' hola' : ''}${block ? ' block' : ''}`}
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
