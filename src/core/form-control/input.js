import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import {CallFunc, HasValue} from 'basic-helper';
import Icon from '../icon';

export default class Input extends Component {
  constructor(props) {
    super(props);

    const {defaultValue, value} = props;

    this.isControl = props.hasOwnProperty('value');
    this.value = this.isControl ? value : defaultValue;

    this.state = {
      viewClass: this.value ? 'has-val' : 'normal',
      stateVal: this.value
    }
  }
  changeText(val) {

  }
  addForceClass() {
    this.setState({
      viewClass: 'forcing'
    });
  }
  delForceClass() {
    this.setState({
      viewClass: HasValue(this.getValue()) ? 'has-val' : 'normal'
    });
  }
  focus() {
    this.refs.iconInput.focus();
  }
  select() {
    this.refs.iconInput.select();
  }
  getValue() {
    return this.isControl ? this.props.value : this.state.stateVal;
  }
  changeVal(val, elem) {
    if(this.isControl) {
      this.setState({
        stateVal: val
      });
    }
    CallFunc(this.props.onChange)(val, elem);
  }
  render() {
    const {
      icon, placeholder, inputBtnConfig, type,
      className = 'form-control', children, required = false,
      onFocus, onBlur, onChange,
    } = this.props;
    const {viewClass = ''} = this.state;
    const value = this.getValue();

    const hasIcon = !!icon;

    const iconDOM = hasIcon ? (
      <Icon type={icon}/>
    ) : null;

    let highlightDOM = required ? (
      <span className="form-desc">
        <span className="highlight">*</span>
      </span>
    ) : null;

    const titleDOM = (
      <span className="title">
        {iconDOM}
        <span className="text mr10">{placeholder}</span>
        {highlightDOM}
      </span>
    );
    const inputBtnDOM = inputBtnConfig ? (
      <span
        className={"input-btn btn flat " + inputBtnConfig.className}
        onClick={() => {
          inputBtnConfig.action(this.refs.iconInput)
        }}>
        {inputBtnConfig.text}
      </span>
    ) : null;

    return (
      <div className={`input-control ${viewClass}${hasIcon ? ' has-icon' : ''}${inputBtnConfig ? ' has-btn' : ''}`}>
        <div className="input-con" onClick={e => this.refs.iconInput.focus()}>
          <span className="input-group">
            {titleDOM}
            <input
              placeholder=""
              type={type}
              className={className}
              value={value}
              onFocus={e => {
                this.addForceClass();
                CallFunc(onFocus)(e);
              }}
              onBlur={e => {
                this.delForceClass();
                CallFunc(onBlur)(e);
              }}
              onChange={e => {
                const val = e.target.value;
                this.changeVal(val, e.target);
              }}
              ref="iconInput"
            />
          </span>
          {inputBtnDOM}
        </div>
        {children}
      </div>
    )
  }
}
Input.propTypes = {
  icon: PropTypes.string,
  inputProps: PropTypes.object,
  inputBtnConfig: PropTypes.object,
}
