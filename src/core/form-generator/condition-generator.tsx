/* eslint-disable consistent-return */
import React from 'react';

import { UUID, Call } from 'basic-helper';
import FormFilterHelper, { FormFilterProps, FormOptionsItem } from './form-filter';

export type ConditionOptions = FormOptionsItem[];

export interface ConditionGeneratorProps extends FormFilterProps {
  /** 查询条件的配置 */
  conditionConfig: ConditionOptions;
  /** className */
  className?: string;
  /** onSubmit */
  onSubmit?: (values) => void;
}

/**
 * 查询条件生成器
 *
 * @export
 * @class ConditionGenerator
 * @extends {FormFilterHelper}
 */
export default class ConditionGenerator extends FormFilterHelper<ConditionGeneratorProps> {
  static defaultProps = {
    className: "condition-group"
  }

  titleDisplayFilter = (config) => {
    const { type, title, _title } = config;
    return ('input,password'.split(',').indexOf(type) === -1) && (title || _title);
  }

  render() {
    const {
      conditionConfig, className, children, onSubmit
    } = this.props;
    const Wrapper = onSubmit ? 'form' : 'div';

    return (
      <Wrapper
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          Call(onSubmit, this.value);
        }}>
        {
          conditionConfig.map((condition, idx) => {
            if (!condition || typeof condition === 'string') return;
            const _con = this.wrapConditionTitle(condition);
            const { ref, refs = [], refu = [] } = _con;
            const itemKey = ref || refs[0] || JSON.stringify(refu);
            const showTitle = this.titleDisplayFilter(_con);

            const titleDOM = showTitle && (
              <span className="title">
                {_con.tipsDOM}
                {_con._title}
              </span>
            );

            return (
              <span key={itemKey} className={`item ${_con.type}${_con.className ? ` ${_con.className}` : ''}`}>
                {titleDOM}
                {this.greneratFormDOM(_con)}
              </span>
            );
          })
        }
        {children}
      </Wrapper>
    );
  }
}
