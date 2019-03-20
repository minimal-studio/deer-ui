import React, { Component } from 'react';
import { HasValue, DateFormat, MoneyFormat, IsFunc, IsObj, Call } from 'basic-helper';
import { UkeComponent, UkePureComponent } from '../uke-utils';
import { ToolTip } from '../tooltip';
import { Label } from '../label';
import Dropdown from '../selector/dropdown-menu';
// import Selector from './select-filter';

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
  selectorCache = {};
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
        invalidTip = this.gm('默认'),
        defaultTitle = this.gm(key),
        cancelTitle = this.gm('默认'),
        ref = key,
        onChange,
        ...other
      } = title;
      // const propsForSelector = {
      //   outside,
      //   invalidTip,
      //   defaultTitle,
      //   cancelTitle,
      //   ref,
      //   onChange,
      //   ...other
      // };
      titleDOM = (
        // <Selector config={propsForSelector} onChange={val => {
        //   const emitVal = {
        //     [ref]: val
        //   };
        //   Call(onChange, emitVal);
        //   Call(this.props.onChange, emitVal, title);
        // }} />
        <Dropdown {...other}
          withInput={false}
          onChange={val => {
            const emitVal = {
              [ref]: val
            };
            Call(onChange, emitVal);
            Call(this.props.onChange, emitVal, title);
          }}
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
  /**
   * mapperFilter 字段过滤器处理顺序
   * 
   * 1. date || datetime || money || abvMoney
   * 2. labels && namesMapper
   * 3. filter
   */
  mapperFilter(mapper, record, rowIdx) {
    let originContent = record[mapper.key];
    let currContent = originContent;
    if(!HasValue(currContent)) {
      currContent = currContent || '-';
    }

    let contentResult = currContent;

    /** 互相冲突的字段，即不可能同时为 datetime 也是 money 的 */
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
    // case !!mapper.namesMapper:
    //   currContent = mapper.namesMapper[currContent] || currContent || '';
    //   break;
    }
    /** 并不冲突的，需要流式处理，swtich case 只能互相冲突的情况 */
    if(mapper.namesMapper) {
      currContent = mapper.namesMapper[currContent] || currContent || '';
      contentResult = currContent;
    }
    if(mapper.labels) {
      const labelColor = mapper.labels[originContent];
      contentResult = labelColor ? (
        <Label color={labelColor} text={currContent} />
      ) : currContent;
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