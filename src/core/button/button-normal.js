import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';

const Button = (props) => {
  let gm = $UKE.getUkeKeyMap;
  const {
    loading = false, disabled = false, text = gm('提交'), icon,
    color = 'theme',
    className = '', onClick
  } = props;

  const clickable = !disabled && !loading;
  const iconDOM = icon ? (
    <Icon type={icon} classNames={['btn-icon']}/>
  ) : null;

  return (
    <button
      disabled={!clickable}
      className={`btn flat ${color} ${className}`}
      onClick={e => {
        if(!disabled) onClick(e);
      }}>
      {iconDOM}
      {text}
    </button>
  )
}
Button.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};
export default Button;