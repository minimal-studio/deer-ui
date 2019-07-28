import React from 'react';
import Step from './step';

interface StepsProps {
  /** 当前激活的位置 */
  activeIdx: number;
  /** 传入 steps-container 的 class */
  className: string;
  /** children，可以为任意元素，但是最好为 Step */
  children: JSX.Element | JSX.Element[];
  /** 所有 Step 的对齐方式，参考 layout 说明 */
  justify: 'center' | 'start' | 'end' | 'between' | 'around';
}

const classMapper = {
  center: 'c',
  start: 's',
  end: 'e',
  between: 'b',
  around: 'around',
};

export default class Steps extends React.PureComponent<StepsProps> {
  static Step = Step;

  static defaultProps = {
    activeIdx: 0,
    justify: 'start',
    className: '',
  }

  render() {
    const {
      children, activeIdx, justify, className
    } = this.props;
    const layoutClass = `j-c-${classMapper[justify] || justify}`;
    const childLen = Array.isArray(children) ? children.length : 0;

    return (
      <div className={`steps-container layout ${layoutClass} ${className}`}>
        {
          React.Children.map(children, (child: JSX.Element, idx) => {
            const isActive = activeIdx === idx;
            const isChecked = activeIdx > idx;
            const StepCom = React.cloneElement(child, {
              idx,
              isActive,
              isChecked,
              style: {
                maxWidth: `${100 / childLen}%`
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
