import React, { Component, PureComponent } from 'react';

import { Call, HasValue, IsFunc } from 'basic-helper';
import { Icon } from '../icon';


export interface InputProps {
  /** 是否必填项 */
  required?: boolean;
  /** 是否显示 title */
  showTitle?: boolean;
  /** 是否获取焦点后选中文字 */
  forceToSelect?: boolean;
  /** 输入框的 icon */
  icon?: string;
  /** icon 的名字 */
  n?: string;
  /** 输入框类型 */
  type?: 'input' | 'pw' | 'password' | 'text' | 'number';
  /** 期望输出的值的类型 */
  outputType?: 'string' | 'number';
  /** 作为自定义的 placeholder */
  placeholder?: any;
  /** 作为自定义的 placeholder */
  title?: any;
  className?: string;
  /** onChange 前执行的过滤器 */
  filter?: Function;
  defaultValue?: number | string;
  value: number | string;
  /** 输入框右侧的按钮配置 */
  inputBtnConfig?: {
    /** 传入 input 的 target */
    action: Function;
    text: string;
    color: string;
    className: string;
  };
  /** 传入 input element 的属性 */
  propsForInput?: {};
  onChange: Function;
  onFocus?: Function;
  onBlur?: Function;
}

interface State {
  viewClass: string;
  stateVal: any;
}

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
export default class Input extends Component<InputProps, State> {
  static defaultProps = {
    required: false,
    forceToSelect: false,
    className: 'form-control',
    type: 'input',
    outputType: 'string',
    propsForInput: {},
  }

  /**
   * 设置 input 控件的默认行为
   * @public
   */
  static setConfig = ({ showTitle }) => {
    defaultShowInputTitle = showTitle;
  };

  isControl

  value

  iconInput

  constructor(props) {
    super(props);

    const { defaultValue = '', value } = props;

    this.isControl = typeof props.value != 'undefined';
    this.value = this.isControl ? value : defaultValue;

    this.state = {
      viewClass: HasValue(this.value) ? 'has-val' : 'normal',
      stateVal: this.value
    };
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
  numberValFilter(val?) {
    const { inputType, outputType } = this.props;
    const _outputType = inputType || outputType;
    if (inputType) console.warn('inputType 已废弃，请使用 outputType');
    let _val = HasValue(val) ? val : this.getValue();
    switch (_outputType) {
      case 'number':
        _val = HasValue(_val) ? +_val : undefined;
        break;
    }
    return _val;
  }

  changeVal(val, elem) {
    this.value = this.numberValFilter(val);
    if (!this.isControl) {
      this.setState({
        stateVal: val
      });
    }
    Call(this.props.onChange, val, elem);
  }

  render() {
    const {
      n, s, icon, placeholder, title, inputBtnConfig, type, showTitle = defaultShowInputTitle,
      className, children, required, filter,
      onFocus, onBlur,
      propsForInput
    } = this.props;
    const { viewClass = '' } = this.state;
    const value = this.getValue();

    const _icon = icon || n;
    const hasIcon = !!_icon;

    const iconDOM = hasIcon ? (
      <Icon n={_icon} s={s} />
    ) : null;

    const highlightDOM = required ? (
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
              type={controlTypeMapper[type] || type}
              {...propsForInput}
              placeholder=""
              className={className}
              value={value}
              onFocus={(e) => {
                this.addForceClass();
                Call(onFocus, e);
              }}
              onBlur={(e) => {
                this.delForceClass();
                let val = this.numberValFilter();
                val = IsFunc(filter) ? filter(val) : val;
                if (typeof val !== 'undefined') Call(onBlur, val, e);
              }}
              onChange={(e) => {
                let val = e.target.value;
                val = IsFunc(filter) ? filter(val) : val;
                this.changeVal(val, e.target);
              }}
              ref={(e) => { this.iconInput = e; }}/>
          </span>
          {inputBtnDOM}
        </div>
        {children}
      </div>
    );
  }
}
