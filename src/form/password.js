import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import Input from './input.js';

export default class Password extends PureComponent {
  constructor(props) {
    super(props);
    this.value = '';
    this.minLen = 6;
    this.maxLen = 16;
  }
  _onChange(val) {

  }
  render() {
    return (
      <Input onChange={val => this._onChange(val)} lenRange={[this.minLen, this.maxLen]}/>
    )
  }
}
Password.propTypes = {
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};
