/* eslint-disable no-prototype-builtins */
/* eslint-disable consistent-return */

import React from 'react';

import { UUID, Call } from '@mini-code/base-func';
import classnames from 'classnames';
import { DivideType } from '../utils/props';
import FormFilterHelper, { FormFilterProps, FormOptionsItem, FormChangeEvent } from './form-filter';
import { queryIsMobile } from '../utils';

export type FormOptions = (FormOptionsItem | DivideType | string)[];

export interface FormGeneratorProps extends FormFilterProps<FormOptions> {
  // /** 表单配置 */
  // formOptions: (FormOptionsItem | DivideType)[];
  /** 将要废弃，请使用 layout 指定布局 */
  isMobile?: boolean;
  /** 布局模式 */
  layout?: 'vertical' | 'horizontal' | 'flow';
  /** 默认布局，如果检测到移动端，则使用垂直布局 */
  defaultLayout?: 'vertical' | 'horizontal' | 'flow';
  // /** 表单的类型 */
  // type?: string;
  /** 表单的类型 */
  className?: HTMLElement['className'];
  /** input 的 title 是否显示在组件内 */
  inlineInputTitle?: boolean;
  /** 表单类型为 submit 时触发的回调 */
  onSubmit?: (formValue) => void;
  /** 内容改变 */
  onChange?: FormChangeEvent;
}

const hrDivide = ['-', 'hr'];

const isInput = (type) => ['input', 'password'].indexOf(type) !== -1;

export default class FormGenerator extends FormFilterHelper<FormGeneratorProps> {
  static defaultProps = {
    onSubmit: () => {},
    className: 'animate-input-title',
    defaultLayout: 'horizontal'
  }

  ID

  formItemRefs = {};

  isMobile

  constructor(props) {
    super(props);

    this.ID = props.id || UUID();

    this.state = {
      ...this.state,
      ready: false,
      isMobile: undefined
    };
  }

  showDesc = (checkRes) => {
    const { ref, isPass } = checkRes;
    for (const itemRef in this.formItemRefs) {
      if (this.formItemRefs.hasOwnProperty(itemRef)) {
        const currFormItem = this.formItemRefs[itemRef];
        currFormItem.classList.remove('error');
        if (itemRef === ref && !isPass) {
          this.formItemRefs[ref].classList.add('error');
        }
      }
    }
  }

  componentDidMount() {
    const { isMobile } = this.props;
    this.isMobile = typeof isMobile == 'undefined' ? queryIsMobile() : isMobile;
    this.setState({
      isMobile: this.isMobile,
      ready: true,
    });
  }

  render() {
    const {
      formOptions, children, layout, defaultLayout,
      inlineInputTitle, className, onSubmit
    } = this.props;
    const { isMobile, ready } = this.state;
    // eslint-disable-next-line no-nested-ternary
    const formLayout = typeof layout == 'undefined' ? (isMobile ? 'vertical' : defaultLayout) : layout;
    const isVerticalLayout = formLayout === 'vertical';
    const _inlineInputTitle = typeof inlineInputTitle == 'undefined' ? isVerticalLayout : inlineInputTitle;

    return ready && formOptions && formOptions.length > 0 ? (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          Call(onSubmit, this.value);
        }}
        className={`${formLayout}-form form-container ${className}`}
      >
        {
          formOptions.map((option, idx) => {
            if (!option) return;
            if (typeof option === 'string') {
              if (hrDivide.indexOf(option) !== -1) {
                return (
                  <hr />
                );
              }
              return (
                <h3 className="form-group-title" key={idx}>
                  <span className="inner-text">{option}</span>
                </h3>
              );
            }
            const isCurrInput = isInput(option.type);
            const showFormTitle = !isCurrInput ? true : !_inlineInputTitle;
            const _con = this.wrapConditionTitle(option);
            if (isCurrInput && !_inlineInputTitle) {
              _con.showTitle = false;
            }
            const itemClassName = option.className;
            const itemRef = _con.ref || (_con.refs ? _con.refs[0] : 'q');
            const isRequired = _con.required;

            const highlightDOM = isRequired && (
              <span className="form-desc">
                <span className="highlight">*</span>
              </span>
            );

            const formDescDOM = _con.desc && (
              <span className="form-desc">{_con.desc}</span>
            );

            const classes = classnames(
              'form-group',
              _con.type,
              itemClassName,
              isRequired && 'required'
            );

            return (
              <div key={`${itemRef}_${this.ID}`}
                ref={(e) => {
                  if (e) this.formItemRefs[itemRef] = e;
                }}
                className={classes}
              >
                {
                  showFormTitle ? (
                    <span className="control-label">
                      {highlightDOM}
                      {_con.tipsDOM}
                      {_con._title}
                    </span>
                  ) : null
                }
                {this.greneratFormDOM(_con)}
                {formDescDOM}
              </div>
            );
          })
        }
        {children}
      </form>
    ) : <span />;
  }
}
