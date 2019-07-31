import React from 'react';

import Icon from '../icon/icon';

export interface StepProps {
  /** 标题 */
  title?: string;
  /** 不同类型的样式 */
  type?: 'success'|'normal'|'wran'|'error';
  /** 由 Steps 传入 */
  idx?: number;
  /** 由 Steps 传入 */
  isActive?: boolean;
  /** 由 Steps 传入 */
  isChecked?: boolean;
  /** 由 Steps 传入 */
  style?: React.CSSProperties;
}

const typeMapper = {
  success: 'check',
  normal: '',
  wran: 'exclamation',
  error: 'times',
};

const Step: React.SFC<StepProps> = ({
  title, children, isActive, isChecked, type = 'success', idx = '', style
}) => (
  <span className={`step-item ${type} ${(isActive ? 'active' : '')} ${(isChecked ? 'checked' : '')}`}
    style={style}>
    <span className="tip-item">
      <span className="tip-idx">
        {
          !isChecked ? +idx + 1 : (
            <Icon n={typeMapper[type] || type}/>
          )
        }
      </span>
      <span className="title">{title}</span>
    </span>
    <div className="desc">{children}</div>
  </span>
);

export default Step;
