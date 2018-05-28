import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';

export default class Tab extends PureComponent {
  render() {
    const {label, onTap, icon, onClick, idx} = this.props;
    const iconDOM = icon ? (
      <Icon type={icon} classNames={['tab-icon']}/>
    ) : null;
    return (
      <div className="tab-label" onClick={e => {
          onTap(idx);
          $GH.CallFunc(onClick)();
        }}>
        {iconDOM}
        <span className="text">{label}</span>
      </div>
    );
  }
}
Tab.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  idx: PropTypes.number,
  isDefault: PropTypes.bool,
  atRight: PropTypes.bool,
  onTap: PropTypes.func,
  onClick: PropTypes.func
};
