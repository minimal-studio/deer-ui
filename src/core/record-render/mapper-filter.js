import React, { Component } from 'react';
import { HasValue, DateFormat, MoneyFormat, IsFunc } from 'basic-helper';
import { UkeComponent, UkePureComponent } from '../uke-basic';
import { ToolTip } from '../tooltip';

const excludeKey = (target, keys) => {
  let res = Object.assign({}, target);
  keys.forEach(item => {
    res[item] = '';
  });
  return res;
};

export default class MapperFilter extends UkeComponent {
  /** 可以覆盖的 excludeKeys */
  excludeKeys = ['records', 'keyMapper'];
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    /** 渲染前做自定义的数据对比，提升表格渲染的效率 */
    let _thisProps = excludeKey(this.props, this.excludeKeys);
    let _nextProps = excludeKey(nextProps, this.excludeKeys);

    const isStateChange = JSON.stringify(this.state) !== JSON.stringify(nextState);
    const isPropsChange = JSON.stringify(_thisProps) !== JSON.stringify(_nextProps);
    const isKeyMapperChange = this.props.keyMapper != nextProps.keyMapper;
    const isRecordsChange = this.props.records != nextProps.records;
    return isStateChange || isPropsChange || isKeyMapperChange || isRecordsChange;
  }
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

export {
  excludeKey
};