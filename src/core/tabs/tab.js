import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call } from 'basic-helper';
import { Icon } from '../icon';

const Tab = ({label, icon, onClick, onChange, idx, labelClass = ''}) => {
  const iconDOM = icon ? (
    <Icon type={icon} classNames={['tab-icon']}/>
  ) : null;
  
  return (
    <div className={"tab-label " + labelClass} onClick={e => {
      Call(onClick);
      Call(onChange);
    }}>
      {iconDOM}
      <span className="text">{label}</span>
    </div>
  );
};
Tab.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  labelClass: PropTypes.string,
  idx: PropTypes.number,
  isDefault: PropTypes.bool,
  atRight: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func
};

export default Tab;
