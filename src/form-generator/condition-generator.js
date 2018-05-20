import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import FormFilterHelper from './form-filter';

export default class ConditionHelper extends FormFilterHelper {
  render() {
    const {conditionConfig, className = "condition-group", children = ''} = this.props;

    return (
      <div className={className}>
        {
          conditionConfig.map((condition, idx) => {
            let _con = this.wrapConditionTitle(condition);
            let titleDOM = !/input|password/.test(_con.type) && _con.title ? (
              <span className="title">{_con.title}</span>
            ) : '';
            return (
              <span key={idx} className={"item " + _con.type + (_con.className ? ' ' + _con.className : '')}>
                {titleDOM}
                {this.greneratFormDOM(_con)}
              </span>
            )
          })
        }
        {children}
      </div>
    );
  }
}
ConditionHelper.propTypes = {
  conditionConfig: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string
};
