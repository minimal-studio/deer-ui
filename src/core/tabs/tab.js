import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {CallFunc} from 'basic-helper';
import Icon from '../icon';

const Tab = ({label, onTap, icon, onClick, onChange, idx, labelClass = ''}) => {
  const iconDOM = icon ? (
    <Icon type={icon} classNames={['tab-icon']}/>
  ) : null;
  
  return (
    <div className={"tab-label " + labelClass} onClick={e => {
        onTap(idx);
        CallFunc(onClick)();
        CallFunc(onChange)();
      }}>
      {iconDOM}
      <span className="text">{label}</span>
    </div>
  );
}
Tab.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  idx: PropTypes.number,
  isDefault: PropTypes.bool,
  atRight: PropTypes.bool,
  onTap: PropTypes.func,
  onChange: PropTypes.func,
  onClick: PropTypes.func
};

export default Tab;
