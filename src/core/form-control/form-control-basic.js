import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { UkeComponent, UkePureComponent } from '../uke-basic';

export default class FormControlBasic extends UkeComponent {
  constructor(props) {
    super(props);

    const { value, defaultValue } = props;

    // 如果是多选模式，value, defaultValue 必须为array，否则value, defaultValue必须为string

    this.isControl = props.hasOwnProperty('value');

    this.value = value || defaultValue;
    this.stateValueMark = 'selectedValue';
  }
  getValue(stateValueMark = this.stateValueMark) {
    // return this.state.selectedValue;
    return this.isControl ? this.props.value : this.state[stateValueMark];
  }
}