import React from 'react';

import { ToFixed } from 'basic-helper';
import NumTransformToCN from 'basic-helper/num-to-cn';
import InputVerifyClass, { InputVerifyClassProps } from './input-verify-class';

export interface InputVerifyProps extends InputVerifyClassProps {
  /** 控件类型 */
  type?: 'input' | 'password';
  /** 是否开启数字转中文 */
  needCN?: boolean;
  /** 是否显示百分比 */
  precent?: boolean;
  /** 是否可输入 */
  inputable?: boolean;
  /** 是否启动操作按钮 */
  selectable?: boolean;
  /** 辅助按钮每一次的增减单位 */
  unit?: number;
  /** style */
  style?: React.CSSProperties;
}

function precentFilter(val, isPrecent) {
  return isPrecent ? ToFixed(val / 10, 1) : val;
}


const FormTip = ({ children }) => {
  return (
    <span className="form-tip">{children}</span>
  );
};

/**
 * 继承于 InputVerifyClass 的模版
 *
 * @export
 * @class InputNumber
 * @extends {InputVerifyClass}
 */
export default class InputNumber extends InputVerifyClass<InputVerifyProps> {
  render() {
    const { matchLen, matchRange } = this.state;
    const {
      className = '', type = 'input', needCN = false, selectable = true,
      unit = 1, inputable = true, precent = false, style
    } = this.props;

    const value = this.getValue();
    const PrecentDOM = precent && (
      <FormTip>{precentFilter(value, precent)}%</FormTip>
    );

    const CNNumDOM = needCN && (
      <FormTip>{NumTransformToCN(value)}</FormTip>
    );

    return (
      <div
        className={`input-verify${(!matchLen || !matchRange) ? ' error' : ''}`}>
        <input type={type}
          value={value}
          style={style}
          readOnly={!inputable}
          className={`form-control ${className}`}
          onBlur={e => this._onBlur(e)}
          onChange={e => this._onChange(e.target.value)}
          onFocus={e => this._onFocus(e.target.value, e)}/>
        {
          selectable && (
            <div className="option-btns">
              <div className="minu _btn" onClick={e => this._onChange((+value - unit))}>
                <span>-</span>
              </div>
              <div className="plus _btn" onClick={e => this._onChange((+value + unit))}>
                <span>+</span>
              </div>
            </div>
          )
        }
        {CNNumDOM}
        {PrecentDOM}
      </div>
    );
  }
}
