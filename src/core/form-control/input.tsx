/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import classnames from 'classnames';
import { Call, HasValue, IsFunc } from 'basic-helper';
import { Icon } from '../icon';
import { Button } from '../button';

import { IconProps } from '../icon/icon';
import { Sizes } from '../utils/props';

type FilterType = string | number;

export interface InputProps {
  /** 是否必填项 */
  required?: boolean;
  /** 是否显示 title */
  showTitle?: boolean;
  /** title 是否在获取焦点后上浮 */
  flowTitle?: boolean;
  /** 是否获取焦点后选中文字 */
  forceToSelect?: boolean;
  /** size */
  size?: Sizes;
  /** 输入框类型 */
  type?: 'input' | 'pw' | 'password' | 'text' | 'number';
  /** 期望输出的值的类型 */
  outputType?: 'string' | 'number';
  /** placeholder */
  placeholder?: any;
  /** 固定的 title */
  title?: any;
  /** className */
  className?: string;
  /** onChange 前执行的过滤器 */
  filter?: (value: FilterType) => FilterType;
  /** defaultValue */
  defaultValue?: number | string;
  /** value */
  value?: number | string;
  /** 输入框右侧的按钮配置 */
  inputBtnConfig?: {
    /** 传入 input 的 target */
    action: (inputRef) => void;
    text: string;
    color?: string;
    icon?: string;
    className?: string;
  };
  /** 传入 input element 的属性 */
  propsForInput?: {};
  /** onChange */
  onChange?: (value, targetElement: HTMLElement) => void;
  /** onFocus */
  onFocus?: (focusEvent) => void;
  /** onBlur */
  onBlur?: (value, blurEvent) => void;
  /** 输入框的 icon */
  icon?: IconProps['n'];
  /** 输入框的 icon */
  n?: IconProps['n'];
  /** IconProps['s'] */
  s?: IconProps['s'];
}

interface State {
  viewClass: string;
  stateVal: any;
  focusing: boolean;
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
    size: 'md',
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

    this.isControl = props.hasOwnProperty('value');
    this.value = this.isControl ? value : defaultValue;

    this.state = {
      viewClass: HasValue(this.value) ? 'has-val' : 'normal',
      stateVal: this.value,
      focusing: false
    };
  }

  onFocus() {
    this.setState({
      viewClass: 'focusing',
      focusing: true
    });
  }

  onBlur() {
    this.setState({
      viewClass: HasValue(this.getValue()) ? 'has-val' : 'normal',
      focusing: false
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
    const { outputType } = this.props;
    let _val = HasValue(val) ? val : this.getValue();
    switch (outputType) {
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

  filterVal = (val) => {
    const { filter } = this.props;
    return filter && IsFunc(filter) ? filter(val) : val;
  }

  render() {
    const {
      n, s, icon, placeholder, title, inputBtnConfig, type = '',
      showTitle = defaultShowInputTitle, size, flowTitle,
      className, children, required,
      onFocus, onBlur,
      propsForInput
    } = this.props;
    const { viewClass = '', focusing } = this.state;
    const value = this.getValue();

    const _icon = icon || n;
    const hasIcon = !!_icon;

    const highlightDOM = required && (
      <span className="form-desc">
        <span className="highlight">*</span>
      </span>
    );

    const titleDOM = (hasIcon || title) && showTitle && (
      <span className="title">
        {
          hasIcon && (
            <Icon n={_icon} s={s} />
          )
        }
        <span className="text">{title}</span>
        {highlightDOM}
      </span>
    );

    const inputBtnDOM = inputBtnConfig && (
      <Button
        className={`input-btn btn ${inputBtnConfig.color || 'theme'} ${inputBtnConfig.className || ''}`}
        icon={inputBtnConfig.icon}
        onClick={() => {
          inputBtnConfig.action(this.iconInput);
        }}>
        {inputBtnConfig.text}
      </Button>
    );

    const classNames = classnames(
      'input-control', size, viewClass,
      hasIcon && 'has-icon',
      inputBtnConfig && 'has-btn',
      flowTitle && 'flow-title'
    );

    return (
      <div
        className={classNames}>
        <div
          className="input-con">
          <span className="input-group"
            onClick={e => this.iconInput.focus()}>
            {titleDOM}
            <input
              type={controlTypeMapper[type] || type}
              {...propsForInput}
              placeholder={flowTitle ? (focusing ? placeholder : '') : placeholder}
              className={className}
              value={value}
              onFocus={(e) => {
                this.onFocus();
                Call(onFocus, e);
              }}
              onBlur={(e) => {
                this.onBlur();
                let val = this.numberValFilter();
                val = this.filterVal(val);
                if (HasValue(val)) Call(onBlur, val, e);
              }}
              onChange={(e) => {
                let val = e.target.value;
                // val = IsFunc(filter) ? filter(val) : val;
                val = this.filterVal(val);
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
