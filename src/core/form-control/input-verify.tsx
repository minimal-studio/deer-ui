import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { NumTransformToCN, ToFixed } from 'basic-helper';

import InputVerifyClass from './input-verify-class';

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
export default class InputVerify extends InputVerifyClass {
  static propTypes = {
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClear: PropTypes.func,
    className: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    /** 控件类型 */
    type: PropTypes.oneOf(['text', 'password']),
    /** 是否开启数字转中文 */
    needCN: PropTypes.bool,
    /** 是否开启百分比模式 */
    precent: PropTypes.bool,
    /** 是否可输入 */
    inputable: PropTypes.bool,
    /** 限制输入数字的范围 */
    numRange: PropTypes.arrayOf(PropTypes.number),
    /** 辅助按钮每一次的增减单位 */
    unit: PropTypes.number,
    /** 限制输入的字符串长度范围 */
    lenRange: PropTypes.arrayOf(PropTypes.number)
  };
  render() {
    const {matchLen, matchRange} = this.state;
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
      <div className={"input-verify" + ((!matchLen || !matchRange) ? ' error' : '')}>
        <input type={type}
          value={displayValue}
          readOnly={!inputable}
          className={"form-control " + className}
          onBlur={e => this._onBlur(e)}
          onChange={e => this._onChange(e.target.value)}
          onFocus={e => this._onFocus(e.target.value)}/>
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
