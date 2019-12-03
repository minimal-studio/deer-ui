import React from 'react';

import ColumnFilter, { Column } from '../table/column-filter';
import { queryIsMobile } from '../utils';

export interface DescColumn extends Column {
  /** 是否独占一行 */
  block?: boolean;
}
export type DescHelperKeyMapper = DescColumn;

export interface TableRowProps {
  /** 需要改名为 columns */
  keyMapper?: DescColumn[];
  /** 表格的 columns */
  columns: DescColumn[];
  /** records 中的项 */
  record: {
    [key: string]: any;
  };
  /** 是否使用竖列显示 */
  col?: boolean;
  /** className */
  className?: HTMLElement['className'];
}
export type DescHelperProps = TableRowProps;

/**
 * 具体单独数据的渲染模版
 *
 * @export
 * @class TableRow
 * @extends {ColumnFilter}
 */
export default class TableRow extends ColumnFilter<TableRowProps> {
  render() {
    const {
      record = {}, className = '', col
    } = this.props;
    const columns = this.getColumns();
    let row = 0;

    return (
      <div className={`table-row ${className} ${col ? 'col' : ''}`}>
        {
          columns.map((column, idx) => {
            if (!column) return null;
            const { key } = column;

            const title = this.titleFilter(column, idx);
            const text = this.columnFilter(column, record);

            const isLongText = text ? text.length > 100 : '';
            const { block = isLongText } = column;

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
