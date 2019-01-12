import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Call, HasValue, IsFunc } from 'basic-helper';
import { Icon } from '../icon';

const controlTypeMapper = {
  input: 'text',
  pw: 'password',
};

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
    /** 是否获取焦点后选中文字 */
    forceToSelect: PropTypes.bool,
    /** 输入框的 icon */
    icon: PropTypes.string,
    /** icon 的名字 */
    n: PropTypes.string,
    /** 输入框类型 */
    type: PropTypes.oneOf([
      /** 等于 text */
      'input',
      /** 等于 password */
      'pw',
      'password',
      'text',
      /** 有浏览器兼容问题，请使用 inputTpe="number" 代替 */
      'number',
    ]),
    /** 期望输出的值的类型 */
    inputType: PropTypes.string,
    /** 作为自定义的 placeholder */
    placeholder: PropTypes.any,
    /** 作为自定义的 placeholder */
    title: PropTypes.any,
    className: PropTypes.string,
    /** onChange 前执行的过滤器 */
    filter: PropTypes.func,
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
      color: PropTypes.string,
      className: PropTypes.string,
    }),
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };
  static defaultProps = {
    required: false,
    forceToSelect: false,
    className: 'form-control',
    type: 'input',
    inputType: 'string',
  }
  /**
   * 设置 input 控件的默认行为
   * @public
   */
  static setConfig = ({ showTitle }) => {
    defaultShowInputTitle = showTitle;
  };
  constructor(props) {
    super(props);

    const { defaultValue = '', value } = props;

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
  /**
   * 用于过滤是 number 类型的值
   */
  numberValFilter(val) {
    const { inputType } = this.props;
    val = HasValue(val) ? val : this.getValue();
    switch (inputType) {
    case 'number':
      val = HasValue(val) ? +val : undefined;
      break;
    }
    return val;
  }
  changeVal(val, elem) {
    this.value = this.numberValFilter(val);
    if(!this.isControl) {
      this.setState({
        stateVal: val
      });
    }
    Call(this.props.onChange, val, elem);
  }
  render() {
    const {
      n, icon, placeholder, title, inputBtnConfig, type, showTitle = defaultShowInputTitle,
      className, children, required, filter,
      onFocus, onBlur,
    } = this.props;
    const { viewClass = '' } = this.state;
    const value = this.getValue();

    const _icon = icon || n;
    const hasIcon = !!_icon;

    const iconDOM = hasIcon ? (
      <Icon n={_icon}/>
    ) : null;

    let highlightDOM = required ? (
      <span className="form-desc">
        <span className="highlight">*</span>
      </span>
    ) : null;

    const titleDOM = (hasIcon || !!placeholder || !!title) && showTitle ? (
      <span className="title">
        {iconDOM}
        <span className="text mr10">{placeholder || title}</span>
        {highlightDOM}
      </span>
    ) : null;

    const inputBtnDOM = inputBtnConfig ? (
      <span
        className={`input-btn btn flat ${inputBtnConfig.color || 'theme'} ${inputBtnConfig.className || ''}`}
        onClick={() => {
          inputBtnConfig.action(this.iconInput);
        }}>
        {inputBtnConfig.text}
      </span>
    ) : null;

    return (
      <div
        className={`input-control ${viewClass}${hasIcon ? ' has-icon' : ''}${inputBtnConfig ? ' has-btn' : ''}`}>
        <div
          className="input-con"
          onClick={e => this.iconInput.focus()}>
          <span className="input-group">
            {titleDOM}
            <input
              placeholder=""
              type={controlTypeMapper[type] || type}
              className={className}
              value={value}
              onFocus={e => {
                this.addForceClass();
                Call(onFocus, e);
              }}
              onBlur={e => {
                this.delForceClass();
                let val = this.numberValFilter();
                val = IsFunc(filter) ? filter(val) : val;
                if(typeof val != 'undefined') Call(onBlur, val, e);
              }}
              onChange={e => {
                let val = e.target.value;
                val = IsFunc(filter) ? filter(val) : val;
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
