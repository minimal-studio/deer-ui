import React, { Component } from 'react';
import { HasValue, DateFormat, MoneyFormat, IsFunc } from 'basic-helper';

export default class MapperFilter extends Component {
  // shouldComponentUpdate(nextProps) {
  //   return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  // }
  mapperFilter(mapper, record, rowIdx) {
    let currContent = record[mapper.key];
    if(!HasValue(currContent)) {
      currContent = currContent || '-';
    }

    let contentResult = currContent;

    switch (true) {
    case !!mapper.date:
      var format = '';
    case !!mapper.datetime:
      format = 'YYYY-MM-DD hh:mm:ss';
      contentResult = /0001/.test(currContent) ? '-' : DateFormat(currContent, format);
      break;
    case !!mapper.money:
    case !!mapper.abvMoney:
      contentResult = MoneyFormat(contentResult);
      if(mapper.abvMoney) contentResult = contentResult.replace('-', '');
      break;
    case !!mapper.namesMapper:
      contentResult = mapper.namesMapper[currContent] || currContent || '';
      break;
    }
    if(IsFunc(mapper.filter)) {
      contentResult = mapper.filter(contentResult, record, mapper, rowIdx);
    }

    return contentResult;
  }
}
