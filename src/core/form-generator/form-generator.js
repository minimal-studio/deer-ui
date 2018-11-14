import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import FormFilterHelper from './form-filter';

export default class FormGenerator extends FormFilterHelper {
  static propTypes = {
    /** 表单配置 */
    formOptions: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        tips: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.array,
        ]),
      })
    ).isRequired,
    /** 是否移动端，开启移动端渲染 */
    isMobile: PropTypes.bool,
    /** 是否显示 input 组建的 title */
    showInputTitle: PropTypes.bool,
    /** 内容改变 */
    onChange: PropTypes.func,
  };
  formItemRefs = {};
  showDesc = (checkRes) => {
    const {ref, isPass} = checkRes;
    for (const itemRef in this.formItemRefs) {
      const currFormItem = this.formItemRefs[itemRef];
      currFormItem.classList.remove('error');
      if(itemRef == ref && !isPass) {
        this.formItemRefs[ref].classList.add('error');
      }
    }
  }
  render() {
    const {
      formOptions, children = '', isMobile = false, id = '',
      showInputTitle, className = "animate-input-title"
    } = this.props;
    console.log('asd')
    const _showInputTitle = typeof showInputTitle == 'undefined' ? !isMobile : showInputTitle;

    return formOptions.length > 0 ? (
      <div className={(isMobile ? 'vertical-form' : 'horizontal-form') + ' form-container ' + className}>
        {
          formOptions.map((condition, idx) => {
            if(!condition) return;
            let needTitle = _showInputTitle ? true : !/input|password/.test(condition.type);
            let _con = this.wrapConditionTitle(condition);
            let {className = ''} = condition;
            let itemRef = _con.ref || (_con.refs ? _con.refs[0] : 'q');
            const isRequired = _con.required;

            let highlightDOM = isRequired ? (
              <span className="form-desc">
                <span className="highlight">*</span>
              </span>
            ) : null;

            let formDescDOM = _con.desc ? (
              <span className="form-desc">{_con.desc}</span>
            ) : null;

            return (
              <div key={itemRef + '_' + id} 
                ref={e => {
                  if(e) this.formItemRefs[itemRef] = e;
                }}
                className={`form-group ${_con.type} ${className} ${isRequired ? ' required' : ''}`}>
                {
                  needTitle ? (
                    <span className="control-label">
                      {highlightDOM}
                      {_con.tipsDOM}
                      {_con.title}
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
      </div>
    ) : <span />;
  }
}
