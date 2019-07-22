/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import React from 'react';
import {
  HasValue, DateFormat, MoneyFormat, IsFunc, IsObj, Call
} from 'basic-helper';
import { UkeComponent } from '../uke-utils';
import { ToolTip } from '../tooltip';
import { Label } from '../label';
import Dropdown from '../selector/dropdown-menu';
// import Selector from './select-filter';

export interface KeyMapperItem {
  /** 数据的 Row */
  key: string;
  /** 处理对应 Row 的 filter */
  filter: (contentResult, record, mapper, rowIdx) => any;
  /** */
  title?: string | ((item, idx) => any) | {
    /** 如果为 type === selector，则渲染 DropdownMenu，其余属性传入 DropdownMenu 组件 */
    type?: 'selector' | string;
  };
}

export interface MapperFilterProps {
  keyMapper: KeyMapperItem[];
  records: [];
}

const excludeKey = (target, keys) => {
  const res = Object.assign({}, target);
  keys.forEach((item) => {
    res[item] = '';
  });
  return res;
};

export default class MapperFilter<P extends MapperFilterProps> extends UkeComponent<P> {
  /** 可以覆盖的 excludeKeys */
  excludeKeys = ['records', 'keyMapper', 'whenCheckAction'];

  sortIgnores = [];

  selectorCache = {};

  scrollX = 0;

  scrollY = 0;

  onChangeRecords

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    /** 渲染前做自定义的数据对比，提升表格渲染的效率 */
    const _thisProps = excludeKey(this.props, this.excludeKeys);
    const _nextProps = excludeKey(nextProps, this.excludeKeys);

    const isStateChange = this.state != nextState;
    const isPropsChange = JSON.stringify(_thisProps) !== JSON.stringify(_nextProps);
    const isKeyMapperChange = this.props.keyMapper != nextProps.keyMapper;
    const isRecordsChange = this.props.records != nextProps.records;
    // const isCheckedItemsChange = this.state.checkedItems != nextState.checkedItems;
    if (isRecordsChange && this.onChangeRecords) {
      this.onChangeRecords();
    }
    return isStateChange || isPropsChange || isKeyMapperChange || isRecordsChange;
  }

  titleFilter(item, idx) {
    const { title, key, tips } = item;
    let titleDOM;
    switch (true) {
      case IsFunc(title):
        titleDOM = title(item, idx);
        break;
      case IsObj(title) && title.type === 'selector':
        const {
          outside = true,
          defaultTitle = this.$T(key),
          invalidTip = this.$T_UKE('默认'),
          cancelTitle = this.$T_UKE('默认'),
          ref = key,
          onChange,
          ...other
        } = title;
        titleDOM = (
          <Dropdown {...other}
            withInput={false}
            onChange={(val) => {
              const emitVal = {
                [ref]: val
              };
              Call(onChange, emitVal);
              Call(this.props.onChange, emitVal, title);
            }}
            scrollX={this.scrollX}
            scrollY={this.scrollY}
            outside={outside}
            defaultTitle={defaultTitle}
            invalidTip={invalidTip}
            cancelTitle={cancelTitle} />
        );
        if (this.sortIgnores.indexOf(key) === -1) this.sortIgnores.push(key);
        break;
      default:
        titleDOM = this.$T(title || key);
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
  mapperFilter = (mapper, record, rowIdx) => {
    const originContent = record[mapper.key];
    let currContent = originContent;
    if (!HasValue(currContent)) {
      currContent = currContent || '-';
    }

    const {
      date, datetime, money, abvMoney, namesMapper, labels, filter
    } = mapper;

    let contentResult = currContent;

    /** 互相冲突的字段，即不可能同时为 datetime 也是 money 的 */
    switch (true) {
      case !!date:
      case !!datetime:
        var format = `YYYY-MM-DD${date ? '' : ' hh:mm:ss'}`;
        contentResult = /0001/.test(currContent) ? '-' : DateFormat(currContent, format);
        break;
      case !!money:
      case !!abvMoney:
        contentResult = MoneyFormat(contentResult);
        if (abvMoney) contentResult = contentResult.replace('-', '');
        break;
    }
    /** 并不冲突的，需要流式处理，swtich case 只能互相冲突的情况 */
    if (namesMapper) {
      currContent = namesMapper[currContent] || currContent || '';
      contentResult = currContent;
    }
    if (labels) {
      const labelColor = labels[originContent];
      contentResult = labelColor ? (
        <Label color={labelColor} text={currContent} />
      ) : currContent;
    }
    if (IsFunc(filter)) {
      contentResult = filter(contentResult, record, mapper, rowIdx);
    }

    return contentResult;
  }
}

export {
  excludeKey
};
