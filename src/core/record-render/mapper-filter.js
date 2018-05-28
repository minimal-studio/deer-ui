import React, {Component, PureComponent} from 'react';

export default class MapperFilter extends Component {
  // shouldComponentUpdate(nextProps) {
  //   return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  // }
  mapperFilter(mapper, record, rowIdx) {
    let currContent = record[mapper.key];
    if(!$GH.HasValue(currContent)) {
      currContent = currContent || '-';
    }

    let contentResult = currContent;

    switch (true) {
      case !!mapper.date:
        var format = '';
      case !!mapper.datetime:
        format = 'YYYY-MM-DD hh:mm:ss';
        contentResult = /0001/.test(currContent) ? '-' : $GH.DateFormat(currContent, format);
        break;
      case !!mapper.money:
      case !!mapper.abvMoney:
        contentResult = $GH.MoneyFormat(contentResult);
        if(!!mapper.abvMoney) contentResult = contentResult.replace('-', '');
        break;
      case !!mapper.namesMapper:
        contentResult = mapper.namesMapper[currContent] || currContent || '';
        break;
    }
    if($GH.IsFunc(mapper.filter)) {
      contentResult = mapper.filter(contentResult, record, mapper, rowIdx);
    }

    return contentResult;
  }
}
