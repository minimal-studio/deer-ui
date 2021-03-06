/* eslint-disable max-len */
import React from 'react';

import { Input, InputProps } from '../input/input';
import { Dropdown, DropdownPosition } from '../dropdown/dropdown';
import { SelectorBasicProps } from '../selector-basic';
import FormControlBasic from '../form-control/form-control-basic';

export interface InputSelectorProps extends SelectorBasicProps {
  /** 传入 input 控件的 props */
  inputProps?: InputProps;
  /** Input 控件的输出值的类型 */
  outputType?: InputProps['outputType'];
  /** Dropdown's position */
  position?: DropdownPosition;
  /** defaultSelectorIdx */
  defaultSelectorIdx?: number;
  /** onChange */
  onChange?: (inputVal, selectorVal) => void;
}

interface InputSelectorState {
  /** 选择器的值 */
  selectRef: any;
  /** 输入控件的值 */
  inputVal: any;
}

/**
 * 选择器 + 输入控件
 *
 * @export
 * @class InputSelector
 * @extends {Component}
 */
export default class InputSelector extends FormControlBasic<InputSelectorProps, InputSelectorState> {
  static defaultProps = {
    inputProps: {},
  }

  _input

  constructor(props) {
    super(props);

    const {
      defaultSelectorIdx, value, defaultValue, values
    } = props;
    this.state = {
      selectRef: defaultSelectorIdx || Object.keys(values)[0],
      inputVal: this.isControl ? value : defaultValue || ''
    };
    this.stateValueMark = 'inputVal';
  }

  changeRef = (selectorVal) => {
    if (!selectorVal) return;
    const { onChange } = this.props;
    // console.log(...args)
    const inputVal = this.getValue();
    this.setState({
      selectRef: selectorVal
    });
    onChange && onChange(inputVal, selectorVal);
  }

  focus() {
    this._input.focus();
  }

  changeInput = (val) => {
    const { selectRef } = this.state;
    if (!this.isControl) {
      this.setState({
        inputVal: val
      });
      this.emitChange(this._input.value, selectRef);
    } else {
      this.emitChange(val, selectRef);
    }
  }

  emitChange = (inputVal, selectRef = this.state.selectRef) => {
    const { onChange } = this.props;
    onChange && onChange(inputVal, selectRef);
  }

  saveInput = (e) => { this._input = e; }

  render() {
    const {
      inputProps, values, onChange, outputType, className, ...other
    } = this.props;
    const { selectRef } = this.state;
    const inputVal = this.getValue();
    return (
      <div className={`__input-selector ${className || ''}`}>
        <Dropdown
          needCancel={false}
          {...other}
          values={values}
          onChange={this.changeRef}
          value={selectRef}
        />
        <Input
          {...inputProps}
          ref={this.saveInput}
          outputType={outputType}
          onChange={this.changeInput}
          value={inputVal}
          onBlur={this.emitChange}
        />
      </div>
    );
  }
}
