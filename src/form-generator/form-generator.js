import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import FormFilterHelper from './form-filter';

export default class FormHelper extends FormFilterHelper {
  render() {
    const {formOptions, children = ''} = this.props;

    return formOptions.length > 0 ? (
      <div className="horizontal-form">
        {
          formOptions.map((condition, idx) => {
            let _con = this.wrapConditionTitle(condition);
            let {className = ''} = condition;
            let highlightDOM = _con.required ? (
              <span className="form-tip">
                <span className="highlight">*</span>
              </span>
            ) : null;
            let formTipDOM = _con.desc ? (
              <span className="form-tip">{_con.desc}</span>
            ) : null;
            return (
              <div key={idx} className={"form-group " + _con.type + (className ? ' ' + className : '')}>
                <label className="control-label">{highlightDOM} {_con.title}</label>
                {this.greneratFormDOM(_con)}
                {formTipDOM}
              </div>
            )
          })
        }
        {children}
      </div>
    ) : <span></span>
  }
}
FormHelper.propTypes = {
  formOptions: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};
