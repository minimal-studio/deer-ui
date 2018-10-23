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
  /** tab 的显示名 */
  label: PropTypes.string.isRequired,
  /** tab 的 icon */
  icon: PropTypes.string,
  /** tab 的className */
  labelClass: PropTypes.string,
  /** 第几个 idx，Tabs 会传入 */
  idx: PropTypes.number,
  /** 改变激活的 tab 位置时的回调 */
  onChange: PropTypes.func,
  /** 改变激活的 tab 位置时的回调 */
  onClick: PropTypes.func
};

export default Tab;
