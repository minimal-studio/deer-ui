import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import MapperFilter from '../table.body/mapper.filter.js';

export default class DescHelper extends MapperFilter {
  render() {
    const {keyMapper = [], record = {}} = this.props;
    let row = 0;

    return (
      <div className="desc-container detail-desc">
        {
          keyMapper.map((mapper, idx) => {
            if(!mapper) return;
            let text = record[mapper.key] || '';
            let title = mapper.title || $UK.getKeyMap(mapper.key);
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
            )
          })
        }
      </div>
    )
  }
}
DescHelper.propTypes = {
  keyMapper: PropTypes.array.isRequired,
  record: PropTypes.object.isRequired,
};
