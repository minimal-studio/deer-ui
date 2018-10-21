/* eslint-disable react/button-has-type */

import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { Icon } from '../icon';

const defaultProps = {
  loading: false,
  disabled: false,
  type: 'button',
  color: 'theme',
  className: '',
  icon: '',
};

const Button = (props) => {
  let gm = window.$UKE.getUkeKeyMap;
  const {
    loading, disabled, text = gm('提交'), icon, type,
    color, className, onClick
  } = props;

  const clickable = !disabled && !loading;
  const iconDOM = icon ? (
    <Icon type={icon} classNames={['btn-icon']}/>
  ) : null;

  return (
    <button
      disabled={!clickable}
      type={type}
      className={`btn flat ${color} ${className}`}
      onClick={e => {
        if(!disabled) onClick(e);
      }}>
      {iconDOM}
      {text}
    </button>
  );
};

Button.defaultProps = defaultProps;
Button.propTypes = {
  /** 是否加载中 */
  loading: PropTypes.bool,
  /** 设置 btn 的 class */
  className: PropTypes.string,
  /** 设置 btn 的 icon, 可以使用 iconMapper 来引用 */
  icon: PropTypes.string,
  /** btn 的字 */
  text: PropTypes.string,
  /** btn 的类型 */
  type: PropTypes.string,
  /** btn 的颜色 [theme, red, gold...] */
  color: PropTypes.string,
  /** 是否禁用 */
  disabled: PropTypes.bool,
  /** 点击处理 */
  onClick: PropTypes.func.isRequired
};

export default Button;