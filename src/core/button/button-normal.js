/* eslint-disable react/button-has-type */

import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import Icon from '../icon';

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
  loading: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default Button;