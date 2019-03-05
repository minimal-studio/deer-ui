/* eslint-disable react/no-array-index-key */

import React, { Component, PureComponent } from 'react';
import { HasValue } from 'basic-helper';
import PropTypes from 'prop-types';

/**
 * 开关
 *
 * @export
 * @class Switch
 * @extends {PureComponent}
 */
export default class Switch extends PureComponent {
  static propTypes = {
    /** 是否禁用 */
    disabled: PropTypes.bool,
    /** 开关的提示，第一个是激活状态，第二个是消极状态 */
    tips: PropTypes.arrayOf(PropTypes.string),
    /** 组件的输出，第一个是激活状态，第二个是消极状态 */
    outputs: PropTypes.arrayOf(PropTypes.any),
    /** 当前激活的 index */
    checked: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.bool,
    ]),
    defaultChecked: PropTypes.bool,
    /** 值改变的回调 */
    onChange: PropTypes.func.isRequired
  };
  static defaultProps = {
    tips: ['', ''],
    // checked: true,
    disabled: false,
    outputs: [true, false],
    defaultChecked: false,
  }
  constructor(props) {
    super(props);
    this.isControl = HasValue(props.checked);
    this.state = {
      checked: this.isControl ? props.checked : props.defaultChecked
    };
  }
  getValue = () => {
    return this.isControl ? this.props.checked : this.state.checked;
  }
  onChange = (nextValue) => {
    if(!this.isControl) {
      this.setState({
        checked: nextValue
      });
    }
    this.props.onChange(nextValue);
  }
  render() {
    const {
      disabled, tips, outputs
    } = this.props;
    const checked = this.getValue();
    const text = tips[checked ? 0 : 1];

    const switchBtnGroup = (
      <span className={"uke-switch" + (checked ? ' checked' : '') + (disabled ? ' disabled' : '')}
        onClick={e => {
          const nextChecked = !checked;
          let emitVal = outputs[nextChecked ? 0 : 1];
          if(!disabled) {
            this.onChange(emitVal);
          }
        }}>
        <span
          disabled={disabled}
          className="switch-btn">
          {text}
        </span>
        <span className="indicator" />
      </span>
    );
    return switchBtnGroup;
  }
}
