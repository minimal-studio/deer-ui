import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Call, HasValue } from 'basic-helper';
import Icon from '../icon';

let defaultShowInputTitle = true;

export default class Input extends Component {
  static propTypes = {
    required: PropTypes.bool,
    showTitle: PropTypes.bool,
    icon: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    inputProps: PropTypes.object,
    inputBtnConfig: PropTypes.object,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };
  static defaultProps = {
    required: false,
    className: 'form-control',
    type: 'input',
  }
  static setConfig = ({showTitle}) => {
    defaultShowInputTitle = showTitle;
  };
  constructor(props) {
    super(props);

    const {defaultValue, value} = props;

    this.isControl = props.hasOwnProperty('value');
    this.value = this.isControl ? value : defaultValue;

    this.state = {
      viewClass: HasValue(this.value) ? 'has-val' : 'normal',
      stateVal: this.value
    };
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
    this.iconInput.focus();
  }
  select() {
    this.iconInput.select();
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
    Call(this.props.onChange, val, elem);
  }
  render() {
    const {
      icon, placeholder, inputBtnConfig, type, showTitle = defaultShowInputTitle,
      className, children, required,
      onFocus, onBlur,
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

    const titleDOM = !!placeholder && showTitle ? (
      <span className="title">
        {iconDOM}
        <span className="text mr10">{placeholder}</span>
        {highlightDOM}
      </span>
    ) : null;

    const inputBtnDOM = inputBtnConfig ? (
      <span
        className={"input-btn btn flat " + inputBtnConfig.className}
        onClick={() => {
          inputBtnConfig.action(this.iconInput);
        }}>
        {inputBtnConfig.text}
      </span>
    ) : null;

    return (
      <div className={`input-control ${viewClass}${hasIcon ? ' has-icon' : ''}${inputBtnConfig ? ' has-btn' : ''}`}>
        <div className="input-con" onClick={e => this.iconInput.focus()}>
          <span className="input-group">
            {titleDOM}
            <input
              placeholder=""
              type={type}
              className={className}
              value={value}
              onFocus={e => {
                this.addForceClass();
                Call(onFocus, e);
              }}
              onBlur={e => {
                this.delForceClass();
                Call(onBlur, e);
              }}
              onChange={e => {
                const val = e.target.value;
                this.changeVal(val, e.target);
              }}
              ref={e => this.iconInput = e}/>
          </span>
          {inputBtnDOM}
        </div>
        {children}
      </div>
    );
  }
}
