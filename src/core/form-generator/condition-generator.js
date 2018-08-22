import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import FormFilterHelper from './form-filter';

export default class ConditionGenerator extends FormFilterHelper {
  static propTypes = {
    conditionConfig: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    className: PropTypes.string
  };
  render() {
    const {conditionConfig, className = "condition-group", children = ''} = this.props;

    return (
      <div className={className}>
        {
          conditionConfig.map((condition, idx) => {
            let _con = this.wrapConditionTitle(condition);
            const {ref, refs = [], refu = []} = _con;
            let itemKey = ref || refs[0] || JSON.stringify(refu);
            
            let titleDOM = !/input|password/.test(_con.type) && _con.title ? (
              <span className="title">{_con.title}</span>
            ) : null;

            return (
              <span key={itemKey} className={"item " + _con.type + (_con.className ? ' ' + _con.className : '')}>
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
