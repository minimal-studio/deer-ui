import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import MapperFilter, { MapperFilterProps } from './mapper-filter';

export interface CardTableProps extends MapperFilterProps {

}

/**
 * 卡片式表格渲染模版
 *
 * @export
 * @class CardTable
 * @extends {MapperFilter}
 */
export default class CardTable extends MapperFilter<CardTableProps> {
  render() {
    const { keyMapper, records } = this.props;
    if (!Array.isArray(records)) return console.error('records 必须为 []');

    return (
      <div className="record-items">
        {
          records.map((record, idx) => (
            <div className="item" key={idx}>
              {
                keyMapper.map((mapper, _idx) => {
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
