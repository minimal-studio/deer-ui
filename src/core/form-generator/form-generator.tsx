/* eslint-disable no-prototype-builtins */
/* eslint-disable consistent-return */

import React from 'react';

import { UUID, Call } from 'basic-helper';
import FormFilterHelper, { FormFilterProps, FormOptionsItem } from './form-filter';
import { DivideType } from '../uke-utils/props';

export interface FormGeneratorProps extends FormFilterProps<(FormOptionsItem & DivideType)[]> {
  // /** 表单配置 */
  // formOptions: (FormOptionsItem | DivideType)[];
  /** 是否移动端，开启移动端渲染 */
  isMobile?: boolean;
  // /** 表单的类型 */
  // type?: string;
  /** 表单的类型 */
  className?: string;
  /** 是否显示 input 组建的 title */
  showInputTitle?: boolean;
  /** 表单类型为 submit 时触发的回调 */
  onSubmit?: Function;
  /** 内容改变 */
  onChange?: Function;
}

const hrDivide = ['-', 'hr'];

export default class FormGenerator extends FormFilterHelper<FormGeneratorProps> {
  static defaultProps = {
    onSubmit: () => {},
    className: 'animate-input-title',
    isMobile: false
  }

  ID

  formItemRefs = {};

  constructor(props) {
    super(props);

    this.ID = props.id || UUID();
  }

  showDesc = (checkRes) => {
    const { ref, isPass } = checkRes;
    for (const itemRef in this.formItemRefs) {
      if (this.formItemRefs.hasOwnProperty(itemRef)) {
        const currFormItem = this.formItemRefs[itemRef];
        currFormItem.classList.remove('error');
        if (itemRef == ref && !isPass) {
          this.formItemRefs[ref].classList.add('error');
        }
      }
    }
  }

  needTitleFilter = type => ['input', 'password'].indexOf(type) === -1

  render() {
    const {
      formOptions, children, isMobile,
      showInputTitle, className, onSubmit
    } = this.props;
    const _showInputTitle = typeof showInputTitle == 'undefined' ? !isMobile : showInputTitle;

    return formOptions && formOptions.length > 0 ? (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          Call(onSubmit, this.value);
        }}
        className={`${isMobile ? 'vertical-form' : 'horizontal-form'} form-container ${className}`}>
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
            const needTitle = _showInputTitle ? true : this.needTitleFilter(option.type);
            const _con = this.wrapConditionTitle(option);
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

            return (
              <div key={`${itemRef}_${this.ID}`}
                ref={(e) => {
                  if (e) this.formItemRefs[itemRef] = e;
                }}
                className={`form-group ${_con.type} ${itemClassName} ${isRequired ? ' required' : ''}`}>
                {
                  needTitle ? (
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
