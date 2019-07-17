import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import MapperFilter from './mapper-filter';

/**
 * 具体单独数据的渲染模版
 *
 * @export
 * @class DescHelper
 * @extends {MapperFilter}
 */
export default class DescHelper extends MapperFilter {
  static propTypes = {
    /** keyMapper */
    keyMapper: PropTypes.arrayOf(PropTypes.shape({
      /** 用于标记 key */
      key: PropTypes.string.isRequired,
      /** 用于占用一行, 如果超过 100 个字符，则自动转化成占一行的模式 */
      block: PropTypes.bool,
    })).isRequired,
    /** 是否使用竖列显示 */
    col: PropTypes.bool,
    /** 单项记录 */
    record: PropTypes.shape({}).isRequired,
  };
  render() {
    const { keyMapper = [], record = {}, className = '', col } = this.props;
    let row = 0;

    return (
      <div className={`desc-container detail-desc ${className} ${col ? 'col' : ''}`}>
        {
          keyMapper.map((mapper, idx) => {
            if(!mapper) return;
            const { key } = mapper;

            const title = this.titleFilter(mapper, idx);
            const text = this.mapperFilter(mapper, record);
            
            const isLongText = text ? text.length > 100 : '';
            const { block = isLongText } = mapper;

            if(idx % 2 == 0) row += 1;
            if(block) row += 1;
            
            const bgColor = row % 2 != 0 ? ' odd' : '';

            return (
              <div className={"item" + (block ? ' block' : '') + bgColor} key={key}>
                <div className="t">{title}</div>
                <div className={"c" + (isLongText ? ' lg' : '')}>{text}</div>
              </div>
            );
          })
        }
      </div>
    );
  }
}