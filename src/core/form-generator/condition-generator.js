import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import FormFilterHelper from './form-filter';

/**
 * 查询条件生成器
 *
 * @export
 * @class ConditionGenerator
 * @extends {FormFilterHelper}
 */
export default class ConditionGenerator extends FormFilterHelper {
  static propTypes = {
    /** 查询条件的配置 */
    conditionConfig: PropTypes.arrayOf(
      PropTypes.shape({
        /** 该项的引用 ID */
        ref: PropTypes.string,
        /** 范围类的 ref 组合 */
        refs: PropTypes.array,
        /** 输入选择器的 ref 值，一个控件需要有变换 ref 的时候使用 */
        refu: PropTypes.object,
        /** 是否必填 */
        required: PropTypes.bool,
        /** 控件的类型 */
        type: PropTypes.oneOf([
          'customForm',
          'captcha',
          'select-n',
          'select',
          'input-selector',
          'input-range',
          'input',
          'password',
          'textarea',
          'ranger',
          'text',
          'radio',
          'hidden',
          'button',
          'datetime',
          'datetimeRange',
        ]),
      })
    ).isRequired,
    /** 查询条件变化时的回调 */
    onChange: PropTypes.func,
    /** className */
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
              <span className="title">
                {_con.tipsDOM}
                {_con.title}
              </span>
            ) : null;

            return (
              <span key={itemKey} className={"item " + _con.type + (_con.className ? ' ' + _con.className : '')}>
                {titleDOM}
                {this.greneratFormDOM(_con)}
              </span>
            );
          })
        }
        {children}
      </div>
    );
  }
}
