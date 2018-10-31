import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../icon/icon';

const Step = ({ title, children, isActive, isChecked, type = 'normal', idx, style }) => {
  return (
    <span className={`step-item ${type} ${(isActive ? 'active' : '')} ${(isChecked ? 'checked' : '')}`}
      style={style}>
      <span className="tip-item">
        <span className="tip-idx">
          {!isChecked ? idx + 1 : (
            <Icon n="check"/>
          )}
        </span>
        <span className="title">{title}</span>
      </span>
      <div className="desc">{children}</div>
    </span>
  );
};
Step.propTypes = {
  title: PropTypes.string,
  idx: PropTypes.number,
  isActive: PropTypes.bool,
  isChecked: PropTypes.bool,
  style: PropTypes.object,
  type: PropTypes.oneOf([
    'success',
    'normal',
    'wran',
    'error',
  ]),
};

export default class Steps extends React.Component {
  static Step = Step;
  static propTypes = {
    activeIdx: PropTypes.number,
    className: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.arrayOf(PropTypes.any),
    justify: PropTypes.oneOf([
      'center',
      'start',
      'end',
      'between',
      'around',
    ])
  }
  static defaultProps = {
    activeIdx: 0,
    justify: 'start',
    className: '',
  }
  state = {};
  classMapper = {
    'center': 'c',
    'start': 's',
    'end': 'e',
    'between': 'b',
    'around': 'around',
  }
  render() {
    const { children, activeIdx, justify, className } = this.props;
    const layoutClass = `j-c-${this.classMapper[justify] || justify}`;
    const childLen = children.length;

    return (
      <div className={`steps-container layout ${layoutClass} ${className}`}>
        {
          React.Children.map(children, (child, idx) => {
            const isActive = activeIdx === idx;
            const isChecked = activeIdx > idx;
            const StepCom = React.cloneElement(child, {
              idx,
              isActive,
              isChecked,
              style: {
                maxWidth: 100 / childLen + '%'
              }
            });
            const needLine = idx < childLen - 1;

            return (
              <React.Fragment>
                {StepCom}
                {needLine ? <span className="line" /> : null}
              </React.Fragment>
            );
          })
        }
      </div>
    );
  }
}

export {
  Step
};