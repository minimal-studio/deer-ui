import React, { Component, PureComponent } from 'react';

import { ToFixed } from 'basic-helper';
import NumTransformToCN from 'basic-helper/num-to-cn';
import InputVerifyClass, { InputVerifyClassProps } from './input-verify-class';

export interface InputVerifyProps extends InputVerifyClassProps {
  /** 是否开启数字转中文 */
  needCN?: boolean;
  /** 是否开启百分比模式 */
  precent?: boolean;
  /** 是否可输入 */
  inputable?: boolean;
  /** 辅助按钮每一次的增减单位 */
  unit?: number;
}

function precentFilter(val, isPrecent) {
  return isPrecent ? ToFixed(val / 10, 1) : val;
}

/**
 * 继承于 InputVerifyClass 的模版
 *
 * @export
 * @class InputVerify
 * @extends {InputVerifyClass}
 */
export default class InputVerify extends InputVerifyClass<InputVerifyProps> {
  render() {
    const { matchLen, matchRange } = this.state;
    const {
      className = '', type = 'text', needCN = false,
      unit = 1, inputable = true, precent = false
    } = this.props;

    const value = this.getValue();
    const displayValue = precentFilter(value, precent);

    const CNNumDOM = needCN ? (
      <span className="form-tip">{NumTransformToCN(value)}</span>
    ) : null;

    return (
      <div className={`input-verify${(!matchLen || !matchRange) ? ' error' : ''}`}>
        <input type={type}
          value={displayValue}
          readOnly={!inputable}
          className={`form-control ${className}`}
          onBlur={e => this._onBlur(e)}
          onChange={e => this._onChange(e.target.value)}
          onFocus={e => this._onFocus(e.target.value, e)}/>
        <div className="option-btns">
          <div className="minu _btn" onClick={e => this._onChange((+value - unit))}>
            <span>-</span>
          </div>
          <div className="plus _btn" onClick={e => this._onChange((+value + unit))}>
            <span>+</span>
          </div>
        </div>
        {CNNumDOM}
      </div>
    );
  }
}
