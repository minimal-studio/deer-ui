import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from './input';
import Selector from '../selector/dropdown-menu';

export default class InputSelector extends Component {
  static propTypes = {
    values: PropTypes.any,
  };
  constructor(props) {
    super(props);

    const {refuDefaultIdx, values} = props;
    this.state = {
      selectRef: refuDefaultIdx || Object.keys(values)[0],
      inputVal: ''
    }
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
    const {inputProps, values, onChange} = this.props;
    const {selectRef, inputVal} = this.state;
    return (
      <div className="input-selector">
        <Selector values={values} onChange={this.changeRef} value={selectRef}/>
        <Input {...inputProps} onChange={this.changeInput} 
          value={inputVal}
          onBlur={e => {
            let val = e.target.value;
            onChange(val, selectRef);
          }}
        />
      </div>
    )
  }
}