import React, { Component } from 'react';
import { HasValue, DateFormat, MoneyFormat, IsFunc, IsObj, Call } from 'basic-helper';
import { UkeComponent, UkePureComponent } from '../uke-utils';
import { ToolTip } from '../tooltip';
import { Label } from '../label';
import Dropdown from '../selector/dropdown-menu';

const excludeKey = (target, keys) => {
  let res = Object.assign({}, target);
  keys.forEach(item => {
    res[item] = '';
  });
  return res;
};

export default class MapperFilter extends UkeComponent {
  /** 可以覆盖的 excludeKeys */
  excludeKeys = ['records', 'keyMapper', 'whenCheckAction'];
  sortIgnores = [];
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    /** 渲染前做自定义的数据对比，提升表格渲染的效率 */
    let _thisProps = excludeKey(this.props, this.excludeKeys);
    let _nextProps = excludeKey(nextProps, this.excludeKeys);

    const isStateChange = this.state != nextState;
    const isPropsChange = JSON.stringify(_thisProps) !== JSON.stringify(_nextProps);
    const isKeyMapperChange = this.props.keyMapper != nextProps.keyMapper;
    const isRecordsChange = this.props.records != nextProps.records;
    // const isCheckedItemsChange = this.state.checkedItems != nextState.checkedItems;
    return isStateChange || isPropsChange || isKeyMapperChange || isRecordsChange;
  }
  titleFilter(item, idx) {
    const { title, key, tips } = item;
    let titleDOM;
    switch (true) {
    case IsFunc(title):
      titleDOM = title(item, idx);
      break;
    case IsObj(title) && title.type == 'selector':
      let {
        outside = true,
        invalidTip = this.gm('全部'),
        defaultTitle = this.gm(key),
        cancelTitle = this.gm('全部'),
        ref = key,
        onChange,
        ...other
      } = title;
      titleDOM = (
        <Dropdown {...other}
          onChange={val => Call(onChange, {
            [ref]: val
          })}
          outside={outside}
          defaultTitle={defaultTitle}
          invalidTip={invalidTip}
          cancelTitle={cancelTitle} />
      );
      if(this.sortIgnores.indexOf(key) === -1) this.sortIgnores.push(key);
      break;
    default:
      titleDOM = title || this.gm(key);
      break;
    }
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
    case !!mapper.labels:
      const labelColor = mapper.labels[currContent];
      contentResult = labelColor ? (
        <Label color={labelColor} text={currContent} />
      ) : currContent;
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