import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../icon/icon';

const typeMapper = {
  'success': 'check',
  'normal': '',
  'wran': 'exclamation',
  'error': 'times',
};

const Step = ({ title, children, isActive, isChecked, type = 'success', idx, style }) => {
  return (
    <span className={`step-item ${type} ${(isActive ? 'active' : '')} ${(isChecked ? 'checked' : '')}`}
      style={style}>
      <span className="tip-item">
        <span className="tip-idx">
          {!isChecked ? idx + 1 : (
            <Icon n={typeMapper[type] || type}/>
          )}
        </span>
        <span className="title">{title}</span>
      </span>
      <div className="desc">{children}</div>
    </span>
  );
};
Step.propTypes = {
  /** 标题 */
  title: PropTypes.string,
  /** 由 Steps 传入 */
  idx: PropTypes.number,
  /** 由 Steps 传入 */
  isActive: PropTypes.bool,
  /** 由 Steps 传入 */
  isChecked: PropTypes.bool,
  /** 由 Steps 传入 */
  style: PropTypes.object,
  /** 不同类型的样式 */
  type: PropTypes.oneOf([
    'success',
    'normal',
    'wran',
    'error',
  ]),
};

export default Step;
