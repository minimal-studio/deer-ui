import React from 'react';
import { Children } from '../utils/props';

import Step from './step';
import { Grid } from '../grid';

interface StepsProps {
  /** 当前激活的位置 */
  activeIdx: number;
  /** 传入 steps-container 的 class */
  className?: string;
  /** children，可以为任意元素，但是最好为 Step */
  children: Children;
  /** 所有 Step 的对齐方式，参考 layout 说明 */
  justify: 'center' | 'start' | 'end' | 'between' | 'around';
}

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
    const childLen = Array.isArray(children) ? children.length : 0;

    return (
      <Grid
        container
        justify={justify}
        className={`steps-container ${className}`}
      >
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
      </Grid>
    );
  }
}
