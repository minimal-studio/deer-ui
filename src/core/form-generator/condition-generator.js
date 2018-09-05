import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import FormFilterHelper from './form-filter';

export default class ConditionGenerator extends FormFilterHelper {
  static propTypes = {
    conditionConfig: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    className: PropTypes.string
  };
  titleDisplayFilter(config) {
    const {type, title} = config;
    return ('input,password'.split(',').indexOf(type) == -1) && title;
  }
  render() {
    const {conditionConfig, className = "condition-group", children = ''} = this.props;

    return (
      <div className={className}>
        {
          conditionConfig.map((condition, idx) => {
            if(!condition) return;
            let _con = this.wrapConditionTitle(condition);
            const {ref, refs = [], refu = []} = _con;
            let itemKey = ref || refs[0] || JSON.stringify(refu);
            let showTitle = this.titleDisplayFilter(_con);
            
            let titleDOM = showTitle ? (
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
