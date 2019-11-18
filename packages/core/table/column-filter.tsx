/* eslint-disable eqeqeq */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import React from 'react';
import {
  HasValue, DateFormat, MoneyFormat, IsFunc, IsObj, Call, DebounceClass
} from '@mini-code/base-func';
import { UIComponent } from '../utils/ui-component';
import { Color, Children } from '../utils/props';
import { ApiRename } from '../utils/rename';
import { ToolTip } from '../tooltip';
import { Label } from '../label';
import { Dropdown, DropdownProps } from '../dropdown/dropdown';
import { $T } from '../utils';

interface TitleFormSelector extends DropdownProps {
  /** 如果为 type === selector，则渲染 Dropdown，其余属性传入 Dropdown 组件 */
  type?: 'selector';
  ref?: string;
}

type FuncTitle = (column: Column, rowIdx: number) => any;

/** 对应数据库的 column 的定义 */
export interface Column {
  /** 对应 row 数据的 [key] */
  key: string;
  /** 处理对应 Row 的 filter */
  filter?: (contentResult: any, row: RecordItem, column: Column, rowIdx: number) => Children;
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
  /** 是否使用翻译 */
  T?: boolean;
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

/**
 * Table row
 */
export interface DataRow {
  [key: string]: any;
}
/**
 * Table data rows
 */
export type DataRows = RecordItem[];

export type RecordItem = DataRow;
export type Records = DataRows;
export type KeyMapper = Column[];

/** column 组合的定义 */
export type Columns = Column[];

export interface ColumnFilterProps {
  /** 需要重命名为 columns */
  keyMapper?: KeyMapper;
  /** 对于数据的 columns 的定义 */
  columns: Columns;
  /** 服务端返回的数据 */
  dataRows?: DataRows;
  /** 服务端返回的数据 */
  records?: DataRows;
  onChange?: (val, title) => void;
  /** 右边固定表格的列的集合 */
  fixedRightKeys?: string[];
  /** 左边固定表格的列的集合 */
  fixedLeftKeys?: string[];
}

export type MapperFilterProps = ColumnFilterProps;

const delayExec = new DebounceClass();

const excludeKey = (target, keys) => {
  const res = Object.assign({}, target);
  keys.forEach((item) => {
    res[item] = '';
  });
  return res;
};

const nonDateReg = /0001/;

export default class ColumnFilter<
  P = ColumnFilterProps, S = {}
> extends UIComponent<P & ColumnFilterProps, S> {
  /**
   * 用于忽略检查是否需要更新的 props
   */
  noCheckPropkeys = [
    // 'columns', 'keyMapper',
    // 'dataRows', 'records',
    'checkedOverlay',
    'whenCheckAction'
  ];

  sortIgnores: string[] = [];

  selectorCache = {};

  scrollX = 0;

  scrollY = 0;

  onChangeRecords

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    /** 渲染前做自定义的数据对比，提升表格渲染的效率 */
    const _thisProps = excludeKey(this.props, this.noCheckPropkeys);
    const _nextProps = excludeKey(nextProps, this.noCheckPropkeys);

    const dataRows = this.getDataRows();
    const columns = this.getColumns();
    const nextColumns = this.getColumns(nextProps);
    const nextDataRows = this.getDataRows(nextProps);

    const isStateChange = this.state != nextState;
    const isPropsChange = JSON.stringify(_thisProps) !== JSON.stringify(_nextProps);
    const isKeyMapperChange = columns != nextColumns;
    const isDataRowsChange = dataRows != nextDataRows;
    // const isCheckedItemsChange = this.state.checkedItems != nextState.checkedItems;
    if (isDataRowsChange && this.onChangeRecords) {
      this.onChangeRecords();
    }
    return isStateChange || isPropsChange || isKeyMapperChange || isDataRowsChange;
  }

  /**
   * 兼容旧的 records 字段
   */
  getDataRows = (props = this.props) => {
    const { records, dataRows } = props;
    if (records) {
      delayExec.exec(() => {
        ApiRename('records', 'dataRows');
      }, 300);
    }
    return dataRows || records || [];
  }

  getColumns(props = this.props) {
    const { columns, keyMapper } = props;
    if (keyMapper) {
      delayExec.exec(() => {
        ApiRename('keyMapper', 'columns');
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

  titleFilter(column: Column, idx) {
    const {
      title, key, tips, fixed
    } = column;
    let titleDOM;

    if (typeof title === 'function') {
      titleDOM = title(column, idx);
    } else if (typeof title === 'object') {
      switch (title.type) {
        case 'selector':
          const {
            outside = true,
            defaultTitle = this.$T(key),
            invalidTip = this.$T_IN('默认'),
            cancelTitle = this.$T_IN('默认'),
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
    const tipsDOM = tips && (
      <ToolTip n="question" s="r" title={tips}/>
    );
    return (
      <div>
        {tipsDOM}
        {titleDOM}
      </div>
    );
  }

  /**
   * columnFilter 字段过滤器处理顺序
   *
   * 1. date || datetime || money || abvMoney
   * 2. labels && namesMapper
   * 3. filter
   */
  columnFilter = (column, row, rowIdx?) => {
    const originContent = row[column.key];
    let currContent = originContent;
    if (!HasValue(currContent)) {
      currContent = currContent || '-';
    }

    const {
      date, datetime, money, abvMoney, namesMapper, labels, filter, T
    } = column;

    let contentResult = currContent;

    /** 互相冲突的字段，即不可能同时为 datetime 也是 money 的 */
    switch (true) {
      case !!date:
      case !!datetime:
        var format = `YYYY-MM-DD${date ? '' : ' hh:mm:ss'}`;
        contentResult = nonDateReg.test(currContent) ? '-' : DateFormat(currContent, format);
        break;
      case !!money:
      case !!abvMoney:
        contentResult = MoneyFormat(contentResult);
        if (abvMoney) contentResult = contentResult.replace('-', '');
        break;
      case T:
        currContent = $T(currContent);
        contentResult = currContent;
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
      contentResult = filter(contentResult, row, column, rowIdx);
    }

    return contentResult;
  }
}

export {
  excludeKey
};
