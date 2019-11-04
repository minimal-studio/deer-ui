import React from 'react';

import ColumnFilter from '../table/column-filter';

/**
 * 卡片式表格渲染模版
 *
 * @export
 * @class TableCard
 * @extends {ColumnFilter}
 */
export default class TableCard extends ColumnFilter {
  render() {
    const dataRows = this.getDataRows();
    const columns = this.getColumns();
    if (!Array.isArray(dataRows)) {
      console.error('dataRows 必须为 []');
      return null;
    }

    return (
      <div className="table-card">
        {
          dataRows.map((record, idx) => (
            <div className="item" key={idx}>
              {
                columns.map((mapper, _idx) => {
                  if (!mapper) return null;
                  const { key } = mapper;
                  const currText = record[key];
                  const resultText = this.columnFilter(mapper, record, idx);
                  const title = this.titleFilter(mapper, _idx);
                  const tdKey = `${key}_${currText}`;
                  return (
                    <div key={tdKey}>
                      <span className="title">{title}</span>
                      <span className="content">{resultText}</span>
                    </div>
                  );
                })
              }
            </div>
          ))
        }
      </div>
    );
  }
}
