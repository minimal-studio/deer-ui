import React, { Component } from 'react';
import { HasValue, DateFormat, MoneyFormat, IsFunc } from 'basic-helper';
import { UkeComponent, UkePureComponent } from '../uke-basic';
import { ToolTip } from '../tooltip';

export default class MapperFilter extends UkeComponent {
  // shouldComponentUpdate(nextProps) {
  //   return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  // }
  titleFilter(item, idx) {
    const { title, key, tips } = item;
    const titleDOM = IsFunc(title) ? title(item, idx) : title || this.gm(key);
    const tipsDOM = tips ? (
      <ToolTip n="question" s="r" title={tips}/>
    ) : null;
    return (
      <div>
        {tipsDOM}
        {titleDOM}
      </div>
    );
  }
  mapperFilter(mapper, record, rowIdx) {
    let currContent = record[mapper.key];
    if(!HasValue(currContent)) {
      currContent = currContent || '-';
    }

    let contentResult = currContent;

    switch (true) {
    case !!mapper.date:
    case !!mapper.datetime:
      var format = 'YYYY-MM-DD' + (mapper.date ? '' : ' hh:mm:ss');
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
