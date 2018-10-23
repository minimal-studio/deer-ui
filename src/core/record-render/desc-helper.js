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
    keyMapper: PropTypes.arrayOf(PropTypes.object).isRequired,
    records: PropTypes.arrayOf(PropTypes.object).isRequired
  };
  render() {
    const {keyMapper = [], record = {}} = this.props;
    let row = 0;

    return (
      <div className="desc-container detail-desc">
        {
          keyMapper.map((mapper, idx) => {
            if(!mapper) return;
            let text = record[mapper.key] || '';
            let title = mapper.title || window.$UKE.getKeyMap(mapper.key);
            text = this.mapperFilter(mapper, record);
            let isLongText = text ? text.length > 100 : '';
            let {block = false} = mapper;
            if(idx % 2 == 0 || block) row += 1;
            let bgColor = row % 2 != 0 ? ' odd' : '';

            return (
              <div className={"item" + (block ? ' block' : '') + bgColor} key={idx}>
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