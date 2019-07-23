import React from 'react';
import PropTypes from 'prop-types';

import MapperFilter, { MapperFilterProps, KeyMapperItem } from './mapper-filter';

interface DescHelperKeyMapper extends KeyMapperItem {
  /** 是否独占一行 */
  block: boolean;
}

export interface DescHelperProps {
  keyMapper: DescHelperKeyMapper[];
  /** records 中的项 */
  record: {
    [key: string]: string;
  };
  /** 是否使用竖列显示 */
  col?: boolean;
  /** className */
  className: string;
}

/**
 * 具体单独数据的渲染模版
 *
 * @export
 * @class DescHelper
 * @extends {MapperFilter}
 */
export default class DescHelper extends MapperFilter<DescHelperProps> {
  render() {
    const {
      keyMapper = [], record = {}, className = '', col
    } = this.props;
    let row = 0;

    return (
      <div className={`desc-container detail-desc ${className} ${col ? 'col' : ''}`}>
        {
          keyMapper.map((mapper, idx) => {
            if (!mapper) return null;
            const { key } = mapper;

            const title = this.titleFilter(mapper, idx);
            const text = this.mapperFilter(mapper, record);

            const isLongText = text ? text.length > 100 : '';
            const { block = isLongText } = mapper;

            if (idx % 2 === 0) row += 1;
            if (block) row += 1;

            const bgColor = row % 2 !== 0 ? ' odd' : '';

            return (
              <div className={`item${block ? ' block' : ''}${bgColor}`} key={key}>
                <div className="t">{title}</div>
                <div className={`c${isLongText ? ' lg' : ''}`}>{text}</div>
              </div>
            );
          })
        }
      </div>
    );
  }
}
