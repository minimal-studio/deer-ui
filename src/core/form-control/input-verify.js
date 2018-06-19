import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import {CallFunc, NumTransformToCN, ToFixed} from 'basic-helper';

export class InputVerifyClass extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClear: PropTypes.func,
    className: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    type: PropTypes.string,
    needCN: PropTypes.bool,
    precent: PropTypes.bool,
    inputable: PropTypes.bool,
    numRange: PropTypes.array,
    unit: PropTypes.number,
    lenRange: PropTypes.array
  };
  constructor(props) {
    super(props);

    let {defaultValue, value} = props;

    this.isControl = this.checkProps('value');
    this.isMatchLen = this.checkProps('lenRange');
    this.isMatchNumbRangeMode = this.checkProps('numRange');
    this.isPass = this.checkProps('lenRange');

    this.value = !this.isControl ? defaultValue : value;
    this.state = {
      value: defaultValue,
      matchLen: true,
      matchRange: true,
    }
  }
  checkProps(field) {
    return !!this.props.hasOwnProperty(field);
  }
  getValue() {
    return this.isControl ? this.props.value : this.state.value;
  }
  _onChange(val, props) {
    const {onChange, lenRange, numRange, precent} = props || this.props;
    let _val = val;

    _val = this.checkLen(_val, lenRange);
    _val = this.checkNum(_val, numRange);

    this.setState({
      value: _val
    });
    this.isPass = this.isMatchLen && this.isMatchNumbRangeMode;
    this.value = _val;

    CallFunc(onChange)(_val);
  }
  _onFocus() {
    const {onFocus} = this.props;
    CallFunc(onFocus)();
  }
  _onBlur() {
    CallFunc(this.props.onBlur)();
  }
  onClear() {
    this._onChange('');
  }
  checkLen(val, lenRange) {
    let _val = val;
    if(lenRange) {
      let [s, e, isSlice] = lenRange;
      if(_val.length > e) {
        if(isSlice) {
          _val = _val.slice(0, e);
        }
      }
    }
    return _val;
  }
  checkNum(val, numRange) {
    let _val = +(val);
    let {matchRange} = this.state;
    if(this.isMatchNumbRangeMode) {
      let isMatch = false;
      let [s, e] = numRange;
      if(_val > e) _val = e;
      if(_val < s) {
        isMatch = false;
      } else {
        isMatch = true;
      }
      matchRange !== isMatch && this.setState({
        matchRange: isMatch
      })
    }
    return _val;
  }
}

function precentFilter(val, isPrecent) {
  return isPrecent ? ToFixed(val / 10, 1) : val;
}

export default class InputVerify extends InputVerifyClass {
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
    )
  }
}
