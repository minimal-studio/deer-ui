import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Call, HasValue } from 'basic-helper';
import { Icon } from '../icon';

let defaultShowInputTitle = true;

/**
 * 通用输入的封装控件
 *
 * @export
 * @class Input
 * @extends {Component}
 */
export default class Input extends Component {
  static propTypes = {
    /** 是否必填项 */
    required: PropTypes.bool,
    /** 是否显示 title */
    showTitle: PropTypes.bool,
    /** 输入框的 icon */
    icon: PropTypes.string,
    /** 输入框类型 */
    type: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    /** 输入框右侧的按钮配置 */
    inputBtnConfig: PropTypes.shape({
      /** 传入 input 的 target */
      action: PropTypes.func,
      text: PropTypes.string,
      className: PropTypes.string,
    }),
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };
  static defaultProps = {
    required: false,
    className: 'form-control',
    type: 'input',
  }
  /**
   * 设置 input 控件的默认行为
   * @public
   */
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
      <Icon n={icon}/>
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
