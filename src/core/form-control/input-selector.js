import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from './input';
import Selector from '../selector/dropdown-menu';
import { selectorValuesType } from '../selector/selector';
import FormControlBasic from './form-control-basic'; 

/**
 * 选择器 + 输入控件
 *
 * @export
 * @class InputSelector
 * @extends {Component}
 */
export default class InputSelector extends FormControlBasic {
  static propTypes = {
    /** 给 input 的 value */
    value: PropTypes.any,
    /** 通用 selector 的 values 配置参数 */
    values: selectorValuesType,
    /** 值改变时触发的回调 */
    onChange: PropTypes.func, 
    /** 传入 input 控件的 props */
    inputProps: PropTypes.object,
  };
  static defaultProps = {
    inputProps: {},
  }
  constructor(props) {
    super(props);

    const { defaultSelectorIdx, value, values } = props;
    this.state = {
      selectRef: defaultSelectorIdx || Object.keys(values)[0],
      inputVal: value
    };
  }
  changeRef = (val) => {
    if(!val) return;
    // console.log(...args)
    const inputVal = this.getValue();
    this.setState({
      selectRef: val
    });
    if(inputVal) this.props.onChange(inputVal, val);
  }
  focus() {
    this._input.focus();
  }
  changeInput = (val) => {
    if(!this.isControl) {
      this.setState({
        inputVal: val
      });
    } else {
      this.emitChange(val, this.state.selectRef);
    }
  }
  emitChange = (inputVal) => {
    const { onChange } = this.props;
    onChange && onChange(inputVal, this.state.selectRef);
  }
  render() {
    const { inputProps, values, onChange, inputType, ...other } = this.props;
    const { selectRef } = this.state;
    const inputVal = this.getValue();
    return (
      <div className="input-selector">
        <Selector
          needAction={false}
          {...other}
          values={values}
          onChange={this.changeRef}
          value={selectRef}/>
        <Input
          {...inputProps}
          ref={e => this._input = e}
          inputType={inputType}
          onChange={this.changeInput} 
          value={inputVal}
          onBlur={this.emitChange}/>
      </div>
    );
  }
}