/* eslint-disable eqeqeq */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import React from 'react';
import {
  HasValue, DateFormat, MoneyFormat, IsFunc, IsObj, Call, DebounceClass
} from 'basic-helper';
import { ToolTip } from '../tooltip';
import { Label } from '../label';
import Dropdown, { DropdownMenuProps } from '../selector/dropdown-menu';
import { UkeComponent } from '../utils/uke-component';
import { Color, Children } from '../utils/props';

interface TitleFormSelector extends DropdownMenuProps {
  /** 如果为 type === selector，则渲染 DropdownMenu，其余属性传入 DropdownMenu 组件 */
  type?: 'selector' | string;
  ref?: string;
}

type FuncTitle = (item, idx) => any;

/** 对应数据库的 column 的定义 */
export interface Column {
  /** 对应 record 数据的 [key] */
  key: string;
  /** 处理对应 Row 的 filter */
  filter?: (contentResult: any, record: RecordItem, column: Column, rowIdx: number) => Children;
  /** */
  title?: string | FuncTitle | TitleFormSelector;
  /** 是否渲染为 date 格式 - YYYY-MM-DD */
  date?: boolean;
  /** 是否渲染为 datetime 格式 - YYYY-MM-DD hh:mm:ss */
  datetime?: boolean;
  /** 是否做金额格式化 */
  money?: boolean;
  /** 是否格式为绝对值的金额 */
  abvMoney?: boolean;
  /** 是否统计该 Row */
  count?: boolean;
  /** 是否可选择 */
  selectable?: boolean;
  /** 是否统计该 Row */
  tips?: string | string[];
  /** 渲染让对应 dataSrc 的数据嵌入 Label */
  labels?: {
    [dataKey: string]: Color;
  };
  /** 内置的 字段映射 过滤器 */
  namesMapper?: {
    [dataSrc: string]: string;
  };
  /** 是否固定 */
  fixed?: 'left' | 'right';
}

export type KeyMapperItem = Column;

export interface RecordItem {
  [key: string]: any;
}

export type Records = RecordItem[];
export type KeyMapper = Column[];

/** column 组合的定义 */
export type Columns = Column[];

export interface MapperFilterProps {
  /** 需要重命名为 columns */
  keyMapper?: KeyMapper;
  /** 对于数据的 columns 的定义 */
  columns: Columns;
  /** 服务端返回的数据 */
  records?: Records;
  onChange?: (val, title) => void;
  /** 右边固定表格的列的集合 */
  fixedRightKeys?: string[];
  /** 左边固定表格的列的集合 */
  fixedLeftKeys?: string[];
}

const delayExec = new DebounceClass();

const excludeKey = (target, keys) => {
  const res = Object.assign({}, target);
  keys.forEach((item) => {
    res[item] = '';
  });
  return res;
};

export default class MapperFilter<
  P = MapperFilterProps, S = {}
> extends UkeComponent<P & MapperFilterProps, S> {
  /** 可以覆盖的 excludeKeys */
  excludeKeys = ['columns', 'records', 'keyMapper', 'checkedOverlay', 'whenCheckAction'];

  sortIgnores: string[] = [];

  selectorCache = {};

  scrollX = 0;

  scrollY = 0;

  onChangeRecords

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    /** 渲染前做自定义的数据对比，提升表格渲染的效率 */
    const _thisProps = excludeKey(this.props, this.excludeKeys);
    const _nextProps = excludeKey(nextProps, this.excludeKeys);

    const { records } = this.props;
    const columns = this.getColumns();

    const isStateChange = this.state != nextState;
    const isPropsChange = JSON.stringify(_thisProps) !== JSON.stringify(_nextProps);
    const isKeyMapperChange = columns != nextProps.columns;
    const isRecordsChange = records != nextProps.records;
    // const isCheckedItemsChange = this.state.checkedItems != nextState.checkedItems;
    if (isRecordsChange && this.onChangeRecords) {
      this.onChangeRecords();
    }
    return isStateChange || isPropsChange || isKeyMapperChange || isRecordsChange;
  }

  getColumns() {
    const { columns, keyMapper } = this.props;
    if (keyMapper) {
      delayExec.exec(() => {
        console.log('请将 keyMapper 重命名为 columns');
      }, 300);
    }
    return columns || keyMapper || [];
  }

  isInFixedTable = (key) => {
    const { fixedRightKeys, fixedLeftKeys } = this.props;
    const isInFixTable = (Array.isArray(fixedRightKeys) && Array.isArray(fixedLeftKeys))
      && (fixedLeftKeys.concat(fixedRightKeys).indexOf(key) !== -1);
    return isInFixTable;
  }

  titleFilter(item, idx) {
    const {
      title, key, tips, fixed
    } = item as KeyMapperItem;
    let titleDOM;

    if (typeof title === 'function') {
      titleDOM = title(item, idx);
    } else if (typeof title === 'object') {
      switch (title.type) {
        case 'selector':
          const {
            outside = true,
            defaultTitle = this.$T(key),
            invalidTip = this.$T_UKE('默认'),
            cancelTitle = this.$T_UKE('默认'),
            ref = key,
            onChange,
            ...other
          } = title as TitleFormSelector;
          const isInFixTable = this.isInFixedTable(key) || !!fixed;
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
              scrollX={isInFixTable ? 0 : this.scrollX}
              // scrollY={this.scrollY}
              outside={outside}
              defaultTitle={defaultTitle}
              invalidTip={invalidTip}
              cancelTitle={cancelTitle} />
          );
          if (this.sortIgnores.indexOf(key) === -1) this.sortIgnores.push(key);
          break;
      }
    } else {
      titleDOM = this.$T(title || key);
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
  mapperFilter = (column, record, rowIdx?) => {
    const originContent = record[column.key];
    let currContent = originContent;
    if (!HasValue(currContent)) {
      currContent = currContent || '-';
    }

    const {
      date, datetime, money, abvMoney, namesMapper, labels, filter
    } = column;

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
      contentResult = filter(contentResult, record, column, rowIdx);
    }

    return contentResult;
  }
}

export {
  excludeKey
};
