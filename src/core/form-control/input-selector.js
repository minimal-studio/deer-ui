import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from './input';
import Selector from '../selector/dropdown-menu';
import { selectorValuesType } from '../selector/selector';

/**
 * 选择器 + 输入控件
 *
 * @export
 * @class InputSelector
 * @extends {Component}
 */
export default class InputSelector extends Component {
  static propTypes = {
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

    const {refuDefaultIdx, values} = props;
    this.state = {
      selectRef: refuDefaultIdx || Object.keys(values)[0],
      inputVal: ''
    };
  }
  changeRef = (val) => {
    if(!val) return;
    // console.log(...args)
    const {inputVal} = this.state;
    this.setState({
      selectRef: val
    });
    if(inputVal) this.props.onChange(inputVal, val);
  }
  changeInput = (val) => {
    this.setState({
      inputVal: val
    });
  }
  render() {
    const { inputProps, values, onChange, ...other } = this.props;
    const { selectRef, inputVal } = this.state;
    return (
      <div className="input-selector">
        <Selector
          {...other}
          values={values}
          onChange={this.changeRef}
          value={selectRef}/>
        <Input {...inputProps} onChange={this.changeInput} 
          value={inputVal}
          onBlur={e => {
            let val = e.target.value;
            onChange(val, selectRef);
          }}/>
      </div>
    );
  }
}