import React from 'react';

import MapperFilter from './mapper-filter';

/**
 * 卡片式表格渲染模版
 *
 * @export
 * @class CardTable
 * @extends {MapperFilter}
 */
export default class CardTable extends MapperFilter {
  render() {
    const { records } = this.props;
    const columns = this.getColumns();
    if (!Array.isArray(records)) {
      console.error('records 必须为 []');
      return null;
    }

    return (
      <div className="record-items">
        {
          records.map((record, idx) => (
            <div className="item" key={idx}>
              {
                columns.map((mapper, _idx) => {
                  if (!mapper) return null;
                  const { key } = mapper;
                  const currText = record[key];
                  const resultText = this.mapperFilter(mapper, record, idx);
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
