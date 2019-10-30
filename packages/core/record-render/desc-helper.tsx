import React from 'react';

import MapperFilter, { MapperFilterProps, Column } from './mapper-filter';

export interface DescColumn extends Column {
  /** 是否独占一行 */
  block?: boolean;
}
export type DescHelperKeyMapper = DescColumn;

export interface DescHelperProps {
  /** 需要改名为 columns */
  keyMapper?: DescHelperKeyMapper[];
  /** 表格的 columns */
  columns: DescColumn[];
  /** records 中的项 */
  record: {
    [key: string]: any;
  };
  /** 是否使用竖列显示 */
  col?: boolean;
  /** className */
  className?: string;
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
      record = {}, className = '', col
    } = this.props;
    const columns = this.getColumns();
    let row = 0;

    return (
      <div className={`desc-container detail-desc ${className} ${col ? 'col' : ''}`}>
        {
          columns.map((mapper, idx) => {
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
