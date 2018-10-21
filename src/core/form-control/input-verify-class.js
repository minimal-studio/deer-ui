import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { Call } from 'basic-helper';

/**
 * 基础的输入框验证 class
 *
 * @export
 * @class InputVerifyClass
 * @extends {Component}
 */
export default class InputVerifyClass extends Component {
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
    };
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

    Call(onChange, _val);
  }
  _onFocus() {
    const {onFocus} = this.props;
    Call(onFocus);
  }
  _onBlur() {
    Call(this.props.onBlur);
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
      });
    }
    return _val;
  }
}
