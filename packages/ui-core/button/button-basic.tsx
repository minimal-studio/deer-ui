/* eslint-disable react/button-has-type */

import React from 'react';
import classnames from 'classnames';

import { Call } from 'basic-helper';
import { $T_UKE } from '../config';
import { Icon } from '../icon';
import { IconProps } from '../icon/icon';
import {
  StatusColorTypes, NatureColorTypes, Sizes, Color
} from '../utils/props';

type ButtonSize = Sizes;

export interface ButtonProps {
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
  /** btn 的字 */
  text?: string;
  /** btn 内的布局 */
  textLayout?: string;
  /** btn 的状态 */
  status?: StatusColorTypes | 'link';
  /** btn 的颜色 */
  color?: Color;
  /** size */
  size?: ButtonSize;
  /** style */
  style?: React.CSSProperties;
  /** children */
  children?: any;
  /** btn 的类型 */
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  /** onClick */
  onClick?: (clickEvent) => void;
  /** 设置 btn 的 icon, 可以使用 iconMapper 来引用 */
  icon?: IconProps['n'];
  /** pass to icon */
  s?: IconProps['s'];
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
    loading, disabled, text, icon, s, type = 'button', children,
    status, color = 'theme', size = 'md', block = false, className, hola = false,
    loadingHint, loadingDisable, textLayout, onClick,
    ...other
  } = props;

  const clickable = !disabled && (!loading || !loadingDisable);
  const iconDOM = icon ? (
    <Icon n={icon} s={s} classNames={['btn-icon']}/>
  ) : null;
  const loadingTip = loadingHint && loading ? (
    <Icon n="loading" s={s} classNames={['btn-loading']}/>
  ) : null;
  const child = children || text;
  const classNames = classnames(
    'btn',
    status || color,
    size,
    className,
    hola && 'hola',
    block && 'block',
  );

  return (
    <button
      {...other}
      disabled={!clickable}
      type={type}
      className={classNames}
      onClick={(e) => {
        if (clickable) Call(onClick, e);
      }}>
      <span className={`layout ${textLayout}`}>
        {iconDOM}
        {
          child && <span className="ms10">{child}</span>
        }
        {loadingTip}
      </span>
    </button>
  );
};

Button.defaultProps = defaultProps;

export default Button;
