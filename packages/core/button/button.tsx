/* eslint-disable react/button-has-type */

import React from 'react';
import classnames from 'classnames';

import { Call } from '@mini-code/base-func';
import {
  ButtonProps
} from '../utils/props';
import { Icon, IconProps } from '../icon';

interface ButtonProps2 extends ButtonProps {
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

const Button: React.SFC<ButtonProps2> = (props) => {
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
      }}
    >
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
