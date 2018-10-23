import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import MapperFilter from './mapper-filter';

/**
 * 卡片式表格渲染模版
 *
 * @export
 * @class RecordItemsHelper
 * @extends {MapperFilter}
 */
export default class RecordItemsHelper extends MapperFilter {
  static propTypes = {
    keyMapper: PropTypes.arrayOf(PropTypes.object).isRequired,
    records: PropTypes.arrayOf(PropTypes.object).isRequired
  };
  render() {
    const { keyMapper, records } = this.props;
    if(!Array.isArray(records)) return console.error('records 必须为 []');

    return (
      <div className="record-items">
        {
          records.map((record, idx) => {
            return (
              <div className="item" key={idx}>
                {
                  keyMapper.map((item, _idx) => {
                    if(!item) return;
                    let currText = record[item.key];
                    let result = this.mapperFilter(item, record, idx);
                    let title = item.title || $UKE.getKeyMap(item.key);
                    return (
                      <div key={idx + '_' + _idx}>
                        <span className="title">{title}</span>
                        <span className="content">{result}</span>
                      </div>
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>
    );
  }
}
