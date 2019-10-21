import React, { Component } from 'react';

import { Call } from 'basic-helper';

export interface InputVerifyClassProps {
  onChange?: (value) => void;
  onFocus?: (val, focusEvent) => void;
  onBlur?: (blurEvent) => void;
  onClear?: () => void;
  className?: string;
  defaultValue?: any;
  value?: any;
  /** 限制输入数字的范围 */
  numRange?: [number, number];
  /** 限制输入的字符串长度范围 */
  lenRange?: [number, number, boolean];
}

interface State {
  value: any;
  matchLen: boolean;
  matchRange: boolean;
}

/**
 * 基础的输入框验证 class
 *
 * @export
 * @class InputVerifyClass
 * @extends {Component}
 */
export default class InputVerifyClass<P extends InputVerifyClassProps> extends Component<P, State> {
  isControl;

  isMatchLen;

  isPass;

  value;

  isMatchNumbRangeMode;

  constructor(props) {
    super(props);

    const { defaultValue = '', value } = props;

    this.isControl = this.checkProps('value');
    this.isMatchLen = this.checkProps('lenRange');
    this.isMatchNumbRangeMode = this.checkProps('numRange');
    this.isPass = this.checkProps('lenRange');

    this.value = !this.isControl ? defaultValue : value;
    this.state = {
      value: defaultValue,
      matchLen: true,
      matchRange: true,
    };
  }

  checkProps(field) {
    return this.props.hasOwnProperty(field);
  }

  getValue() {
    return this.isControl ? this.props.value : this.state.value;
  }

  _onChange(val, props = this.props) {
    const {
      onChange, lenRange, numRange
    } = props;
    let _val = val;

    _val = this.checkLen(_val, lenRange);
    _val = this.checkNum(_val, numRange);

    this.setState({
      value: _val
    });
    this.isPass = this.isMatchLen && this.isMatchNumbRangeMode;
    this.value = _val;

    Call(onChange, _val);
  }

  _onFocus(val, event) {
    const { onFocus } = this.props;
    Call(onFocus, val, event);
  }

  _onBlur(e) {
    Call(this.props.onBlur, e);
  }

  onClear() {
    this._onChange('');
  }

  checkLen = (val, lenRange) => {
    let _val = val.toString();
    if (lenRange) {
      const [s, e, isSlice = true] = lenRange;
      if (_val.length > e) {
        if (isSlice) {
          _val = _val.slice(0, e);
        }
      }
    }
    return _val;
  }

  checkNum(val, numRange) {
    let _val = +(val);
    const { matchRange } = this.state;
    if (this.isMatchNumbRangeMode) {
      let isMatch = false;
      const [s, e] = numRange;
      if (_val > e) _val = e;
      if (_val < s) {
        isMatch = false;
      } else {
        isMatch = true;
      }
      matchRange !== isMatch && this.setState({
        matchRange: isMatch
      });
    }
    return _val;
  }
}
