/* eslint-disable react/button-has-type */

import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '../icon';

const defaultProps = {
  loading: false,
  loadingHint: true,
  loadingDisable: true,
  disabled: false,
  type: 'button',
  color: 'theme',
  className: '',
  icon: '',
};

const Button = (props) => {
  let gm = window.$UKE.getUkeKeyMap;
  const {
    loading, disabled, text = gm('提交'), icon, s, type, children,
    color, className, loadingHint, loadingDisable, onClick
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
      disabled={!clickable}
      type={type}
      className={`btn flat ${color} ${className}`}
      onClick={e => {
        if(clickable) onClick(e);
      }}>
      <span className="layout a-i-c">
        {iconDOM}
        {children || text}
        {loadingTip}
      </span>
    </button>
  );
};

Button.defaultProps = defaultProps;
Button.propTypes = {
  /** 是否加载中 */
  loading: PropTypes.bool,
  /** 是否需要加载中的提示 */
  loadingHint: PropTypes.bool,
  /** 加载中是否禁用 */
  loadingDisable: PropTypes.bool,
  /** 设置 btn 的 class */
  className: PropTypes.string,
  /** 设置 btn 的 icon, 可以使用 iconMapper 来引用 */
  icon: PropTypes.string,
  /** btn 的字 */
  text: PropTypes.string,
  /** children */
  children: PropTypes.any,
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