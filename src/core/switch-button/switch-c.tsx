/* eslint-disable react/no-array-index-key */

import React, { Component, PureComponent } from 'react';
import { HasValue } from 'basic-helper';

export interface SwitchProps {
  /** 值改变的回调 */
  onChange?: (val) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 开关的提示，第一个是激活状态，第二个是消极状态 */
  tips?: string[];
  /** 组件的输出，第一个是激活状态，第二个是消极状态 */
  outputs?: any[];
  /** 当前激活的 index */
  checked?: number | boolean;
  /** defaultChecked */
  defaultChecked?: boolean;
}

interface State {
  checked: boolean;
}

/**
 * 开关
 *
 * @export
 * @class Switch
 * @extends {PureComponent}
 */
export default class Switch extends PureComponent<SwitchProps, State> {
  static defaultProps = {
    tips: ['', ''],
    // checked: true,
    disabled: false,
    outputs: [true, false],
    defaultChecked: false,
  }

  isControl

  constructor(props) {
    super(props);
    this.isControl = HasValue(props.checked);
    this.state = {
      checked: this.isControl ? props.checked : props.defaultChecked
    };
  }

  getValue = () => (this.isControl ? this.props.checked : this.state.checked)

  onChange = (nextValue) => {
    const { onChange } = this.props;
    if (!this.isControl) {
      this.setState({
        checked: nextValue
      });
    }
    onChange && onChange(nextValue);
  }

  render() {
    const {
      disabled, tips = [], outputs = []
    } = this.props;
    const checked = this.getValue();
    const text = tips[checked ? 0 : 1];

    const switchBtnGroup = (
      <span className={`__switch${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}`}
        onClick={(e) => {
          const nextChecked = !checked;
          const emitVal = outputs[nextChecked ? 0 : 1];
          if (!disabled) {
            this.onChange(emitVal);
          }
        }}>
        <span
          className={`switch-btn${disabled ? ' disabled' : ''}`}>
          {text}
        </span>
        <span className="indicator" />
      </span>
    );
    return switchBtnGroup;
  }
}
