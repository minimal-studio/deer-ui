import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import FormFilterHelper from './form-filter';

export default class FormGenerator extends FormFilterHelper {
  render() {
    const {formOptions, children = '', isMobile = false, showInputTitle} = this.props;
    const _showInputTitle = typeof showInputTitle == 'undefined' ? !isMobile : showInputTitle;

    return formOptions.length > 0 ? (
      <div className={(isMobile ? 'vertical-form' : 'horizontal-form') + ' form-container'}>
        {
          formOptions.map((condition, idx) => {
            let needTitle = _showInputTitle ? true : !/input|password/.test(condition.type);
            let _con = this.wrapConditionTitle(condition);
            let {className = ''} = condition;

            let highlightDOM = _con.required ? (
              <span className="form-desc">
                <span className="highlight">*</span>
              </span>
            ) : null;

            let formDescDOM = _con.desc ? (
              <span className="form-desc">{_con.desc}</span>
            ) : null;

            return (
              <div key={idx} className={"form-group " + _con.type + (className ? ' ' + className : '')}>
                <span className="control-label">
                  {highlightDOM}
                  {needTitle ? _con.title : null}
                </span>
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
FormGenerator.propTypes = {
  formOptions: PropTypes.array.isRequired,
  isMobile: PropTypes.bool,
  showInputTitle: PropTypes.bool,
  onChange: PropTypes.func,
};
