import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import FormFilterHelper from './form-filter';

export default class FormGenerator extends FormFilterHelper {
  static propTypes = {
    formOptions: PropTypes.array.isRequired,
    isMobile: PropTypes.bool,
    showInputTitle: PropTypes.bool,
    onChange: PropTypes.func,
  };
  formItemRefs = {};
  showDesc(checkRes) {
    const {ref, isPass} = checkRes;
    Object.keys(this.formItemRefs).forEach(itemRef => {
      let currFormItem = this.formItemRefs[itemRef];
      currFormItem.classList.remove('error');
      if(itemRef == ref && !isPass) {
        this.formItemRefs[ref].classList.add('error');
      }
    })
  }
  render() {
    const {
      formOptions, children = '', isMobile = false, id = '',
      showInputTitle, className = "animate-input-title"
    } = this.props;
    const _showInputTitle = typeof showInputTitle == 'undefined' ? !isMobile : showInputTitle;

    return formOptions.length > 0 ? (
      <div className={(isMobile ? 'vertical-form' : 'horizontal-form') + ' form-container ' + className}>
        {
          formOptions.map((condition, idx) => {
            let needTitle = _showInputTitle ? true : !/input|password/.test(condition.type);
            let _con = this.wrapConditionTitle(condition);
            let {className = ''} = condition;
            let itemRef = _con.ref || (_con.refs ? _con.refs[0] : 'q');

            let highlightDOM = _con.required ? (
              <span className="form-desc">
                <span className="highlight">*</span>
              </span>
            ) : null;

            let formDescDOM = _con.desc ? (
              <span className="form-desc">{_con.desc}</span>
            ) : null;

            return (
              <div key={itemRef + '_' + id} 
                ref={formItem => {
                  if(formItem) this.formItemRefs[itemRef] = formItem;
                }}
                className={"form-group " + _con.type + (className ? ' ' + className : '')}>
                {
                  needTitle ? (
                    <span className="control-label">
                      {highlightDOM}
                      {_con.title}
                    </span>
                  ) : null
                }
                {this.greneratFormDOM(_con)}
                {formDescDOM}
              </div>
            )
          })
        }
        {children}
      </div>
    ) : <span></span>
  }
}
