import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

function isNot(arg) {
  return typeof arg === 'undefined';
}

export class InputVerifyClass extends Component {
  constructor(props) {
    super(props);
    let defaultValue = props.defaultValue || '';
    this.value = defaultValue;
    this.isMatchLen = isNot(props.lenRange);
    this.isMatchNumbRange = isNot(props.numRange);
    this.isPass = isNot(props.lenRange);
    this.state = {
      value: defaultValue
    }
  }
  componentWillReceiveProps(nextProps) {
    if(!this.props.defaultValue || this.props.defaultValue !== nextProps.defaultValue) {
      this._onChange(nextProps.defaultValue, nextProps);
    }
  }
  _onChange(val, props) {
    const {onChange, lenRange, numRange} = props || this.props;
    let _val = val;

    _val = this.checkLen(_val, lenRange);
    _val = this.checkNum(_val, numRange);

    this.setState({
      value: _val
    });
    this.isPass = this.isMatchLen && this.isMatchNumbRange;
    this.value = _val;
    $GH.CallFunc(onChange)(_val);
  }
  _onFocus() {
    const {onFocus} = this.props;
    $GH.CallFunc(onFocus)();
  }
  _onBlur() {
    $GH.CallFunc(this.props.onBlur)();
  }
  onClear() {
    this._onChange('');
  }
  checkLen(val, lenRange) {
    let _val = val;
    let isPass = this.isMatchLen;
    if(lenRange) {
      isPass = false;
      let [s, e, isSlice] = lenRange;
      if(_val.length > e) {
        if(isSlice) {
          _val = _val.slice(0, e);
        }
      } else if(_val.length >= s && _val.length < e) {
        isPass = true;
      }
    }
    this.isMatchLen = isPass;
    return _val;
  }
  checkNum(val, numRange) {
    let _val = +(val);
    let isPass = this.isMatchNum;
    if(numRange) {
      isPass = false;
      let [s, e] = numRange;
      if(_val >= s) {
        isPass = true;
      }
      if(_val > e) _val = e;
    }
    this.isMatchNumbRange = isPass;
    return _val;
  }
}

export default class InputVerify extends InputVerifyClass {
  render() {
    const {scale = '', type = 'text', needCN = false} = this.props;
    const {value} = this.state;
    const CNNum = needCN ? $GH.NumTransformToCN(value) : '';
    return (
      <div>
        <input type={type}
          value={value}
          className={"form-control input-" + scale}
          onBlur={e => this._onBlur(e)}
          onChange={e => this._onChange(e.target.value)}
          onFocus={e => this._onFocus(e.target.value)}/>
        <span className="form-tip">{CNNum}</span>
      </div>
    )
  }
}

InputVerify.propTypes = {
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClear: PropTypes.func,
  scale: PropTypes.string,
  defaultValue: PropTypes.any,
  value: PropTypes.string,
  type: PropTypes.string,
  needCN: PropTypes.bool,
  numRange: PropTypes.array,
  lenRange: PropTypes.array
};
