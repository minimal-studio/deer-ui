import React from 'react';
import {
  Call, IsFunc, MoneyFormat, HasValue, DebounceClass
} from 'basic-helper';
import classnames from 'classnames';

import MapperFilter, { MapperFilterProps, Column, Records } from './mapper-filter';
import { Icon } from '../icon';
import { Children } from '../utils/props';

export interface TableColumn extends Column {
  /** 点击表头排序的回调 */
  onSort?: (record, isDescOutside) => void;
  /** 是否固定 */
  fixed?: 'left' | 'right';
}
export type TableColumns = TableColumn[];

/** 兼容旧的 TableKeyMapperItem */
export type TableKeyMapperItem = TableColumn;
/** 兼容旧的 TableKeyMapper */
export type TableKeyMapper = TableKeyMapperItem[];

export type TableRecords = Records;

export type CheckedOverlay = (params: {
  /** 已选择的项 */
  checkedItems: {};
  /** 取消选择 */
  clearCheckeds: () => void;
}) => any;


export interface TableProps extends MapperFilterProps {
  /** 需要重命名为 columns */
  keyMapper?: TableKeyMapper;
  /** 定义 table 的 columns */
  columns: TableColumns;
  /** 数据源 */
  records: TableRecords;
  /** 是否需要统计 */
  needCount?: boolean;
  /** 是否需要内部排序 */
  needInnerSort?: boolean;
  /** 是否多选 */
  needCheck?: boolean;
  /** 表格的数据源，用于每一行（row）的数据填充 */
  clickToHighlight?: boolean;
  /** 用于获取 row key */
  rowKey?: (record, recordIdx) => string;
  /** 需要右对齐的 record 的类型 */
  alignRightTypes?: string[];
  /** 是否固定头部 */
  fixHead?: boolean;
  /** 右边固定表格的列的集合 */
  fixedRightKeys?: string[];
  /** 左边固定表格的列的集合 */
  fixedLeftKeys?: string[];
  /** checkbox 的宽度 */
  checkWidth?: number;
  /** 监听器的 timer */
  watcherTimer?: number;
  /** 表格的高度，用于固定表头 */
  height?: number | string;
  /** 无视的排序字段 */
  sortIgnores?: string[];
  /** 当选中时往表格顶部嵌入的内容，即将废弃，改用 checkedOverlay */
  whenCheckAction?: CheckedOverlay | Children;
  /** 当选中时往表格顶部嵌入的内容 */
  checkedOverlay?: CheckedOverlay | Children;
  /** 选中项时的回调 */
  onCheck?: (nextChecked, idx?) => void;
}

interface State {
  headerWidthMapper: number[];
  tableWidth: string | number;
  sortField: string;
  sortOutsideField: string;
  isDescInner: boolean;
  isDescOutside?: boolean;
  isAutoWidth?: boolean;
  hoveringRow?: number;
  highlightRow: {};
  checkedItems: {};
}

const isStringNumRegex = /\d+,?/;
const { exec } = new DebounceClass();

const tdSpecClassMapper = {
  checkbox: 'check-td'
};
const scrollLeftClass = 'scroll-to-left';
const scrollRightClass = 'scroll-at-right';
const breakWordClass = 'break-word';
const autoWidthClass = 'auto-width';

const tdMaxWidth = 400;

const moneyFormat = text => (HasValue(text) ? text.toLocaleString('en-US') : '-');
const defaultSortIgnores: string[] = ['action', 'checkbox'];

/**
 * 提供一个快速的表格数据渲染容器，不需要关注具体如何渲染，只需要传入对应的数据和过滤器
 *
 * @export
 * @class Table
 * @extends {MapperFilter}
 */
export default class Table extends MapperFilter<TableProps, State> {
  static defaultProps = {
    sortIgnores: [],
    fixedLeftKeys: [],
    fixedRightKeys: [],
    alignRightTypes: ['money'],
    needCheck: false,
    clickToHighlight: false,
    height: 'auto',
    needInnerSort: false,
    watcherTimer: 1000,
    fixHead: true,
    checkWidth: 30,
    needCount: false,
  };

  excludeFilterField = ['action', 'checkbox'];

  firstTDDOMs = {};

  firstRowNodes = {};

  sameSortTime = 0;

  fixedLeftGroup: TableKeyMapperItem[] = [];

  fixedRightGroup: TableKeyMapperItem[] = [];

  columnHeightInfo = {};

  mainTableBody

  checkedItems

  hadSaved

  tableContainer

  tableContainerWidth

  desplayWatcher

  leftFixedTable

  rightFixedTable

  mainTable

  lastScrollTop

  lastScrollLeft

  constructor(props) {
    super(props);

    this.state = {
      headerWidthMapper: [],
      tableWidth: 'auto',
      sortField: '',
      sortOutsideField: '',
      isDescInner: false,
      isDescOutside: undefined,
      hoveringRow: undefined,
      isAutoWidth: undefined,
      highlightRow: {},
      checkedItems: {},
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeCalcSize);
    if (this.props.whenCheckAction) {
      console.warn('whenCheckAction 即将废弃，请使用 checkedOverlay');
    }
    // this.calcSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCalcSize);
    this.clearWatch();
  }

  // componentDidUpdate() {
  //   // this.calcSize();
  // }

  /**
   * 清除所有已选择的内容
   *
   * @memberof TableBody
   * @public
   */
  clearCheckeds = () => {
    this.toggleAllItems(false);
  }

  handleClickToHighlight = (e: React.MouseEvent, rowIdx) => {
    // if (e.currentTarget !== e.target) return;
    this.setState(({ highlightRow }) => {
      const nextState = { ...highlightRow };
      nextState[rowIdx] = !nextState[rowIdx];
      return {
        highlightRow: nextState
      };
    });
  }

  toggleSelectItem = (item, idx) => {
    const { checkedItems } = this.state;
    const nextCheckedItems = { ...checkedItems };
    if (nextCheckedItems[idx]) {
      delete nextCheckedItems[idx];
    } else {
      nextCheckedItems[idx] = item;
    }
    this.selectItems(nextCheckedItems, idx);
  }

  toggleAllItems(allCheck) {
    const { checkedItems } = this.state;
    let nextCheckedItems = { ...checkedItems };
    if (!allCheck) {
      nextCheckedItems = {};
    } else {
      this.props.records.forEach((item, idx) => { nextCheckedItems[idx] = item; });
    }
    this.selectItems(nextCheckedItems);
  }

  selectItems(nextState, idx?) {
    const { onCheck } = this.props;
    this.checkedItems = nextState;
    this.setState({
      checkedItems: nextState
    });
    Call(onCheck, nextState, idx);
  }

  getCheckbox = (str, item, mapper, idx) => {
    const { checkedItems } = this.state;
    const checked = !!checkedItems[idx];
    return (
      <input type="checkbox"
        checked={checked} onChange={e => this.toggleSelectItem(item, idx)}/>
    );
  }

  getKeyMapper = () => {
    const { needCheck } = this.props;
    const columns = this.getColumns();

    let result = columns;

    if (needCheck) {
      const fixedLeft = columns[0].fixed === 'left';
      const checkExtend = Object.assign({}, fixedLeft ? { fixed: 'left' } : {}, {
        key: 'checkbox',
        // w: checkWidth,
        filter: this.getCheckbox
      });
      result = [checkExtend, ...columns];
    }

    this.saveFixedGroup(result);

    return result;
  }

  saveFixedGroup = (columns) => {
    if (this.hadSaved) return;
    this.hadSaved = true;
    const { fixedRightKeys = [], fixedLeftKeys = [] } = this.props;
    columns.forEach((item, idx) => {
      const { key, fixed } = item;
      const nextItem = { ...item, idx };
      switch (true) {
        case fixedLeftKeys.indexOf(key) !== -1:
        case fixed === 'left':
          this.fixedLeftGroup.push(nextItem);
          break;
        case fixedRightKeys.indexOf(key) !== -1:
        case fixed === 'right':
          this.fixedRightGroup.push(nextItem);
          break;
      }
    });
  }

  setTableContainerClass = (isAutoWidth) => {
    if (this.tableContainer) this.tableContainer.classList.toggle(autoWidthClass, isAutoWidth);
  }

  calcSize(firstRowNodes) {
    if (!this.tableContainer || !firstRowNodes) return;
    // if(Object.keys(this.firstTDDOMs).length === 0) return;
    const cellsLen = firstRowNodes.length;
    const { headerWidthMapper } = this.state;

    const nextHeaderWidthMapper: number[] = [];
    let nextContainerWidth = 0;

    for (let i = 0; i < cellsLen; i++) {
      const currCell = firstRowNodes[i];
      const currCellWidth = currCell.offsetWidth || headerWidthMapper[i];
      if (currCellWidth) {
        nextHeaderWidthMapper[i] = currCellWidth;
        nextContainerWidth += nextHeaderWidthMapper[i];
      }
    }
    if (
      nextHeaderWidthMapper.join(',') !== headerWidthMapper.join(',')
    ) {
      const tableContainerWidth = this.tableContainer.offsetWidth;
      const isTableMoreContainer = nextContainerWidth > tableContainerWidth;
      const isAutoWidth = !isTableMoreContainer;
      this.setTableContainerClass(isAutoWidth);
      this.setState({
        headerWidthMapper: nextHeaderWidthMapper,
        // tableWidth: nextContainerWidth
        tableWidth: isTableMoreContainer ? nextContainerWidth : 'auto',
        isAutoWidth: !isTableMoreContainer
      });
    }
  }

  resetTableDOMInfo = () => {
    this.tableContainerWidth = this.tableContainer.offsetWidth;
  }

  resizeCalcSize = () => {
    if (!this.tableContainer) return;
    const { tableWidth } = this.state;
    if (tableWidth !== 'auto' && tableWidth < this.tableContainer.offsetWidth) {
      this.setTableContainerClass(true);
      this.setState({
        tableWidth: 'auto',
        isAutoWidth: true
      }, () => this.calcSize(this.firstRowNodes));
    } else {
      this.calcSize(this.firstRowNodes);
    }
    setTimeout(() => {
      this.resetTableDOMInfo();
    }, 100);
  }

  onChangeRecords = () => {
    setTimeout(() => {
      this.reSaveFirstRow();
      this.resizeCalcSize();
    }, 10);
  }

  ignoreFilter(str) {
    return defaultSortIgnores.concat(this.props.sortIgnores || []).indexOf(str) !== -1;
  }

  recordsOrderFilter() {
    const { sortField, isDescInner } = this.state;
    const { records } = this.props;
    if (!sortField) return records;
    const result = [...records];
    result.sort((itemPrev, itemNext) => {
      const sortTargetPrev = itemPrev[sortField];
      const sortTargetNext = itemNext[sortField];

      let res;

      if (typeof sortTargetPrev == 'string') {
        res = sortTargetPrev.localeCompare(sortTargetNext);
      } else if (typeof sortTargetPrev == 'number') {
        res = sortTargetPrev - +sortTargetNext;
      }

      return isDescInner ? res : res * -1;
    });
    return result;
  }

  orderRecord(_orderKey) {
    let orderKey = _orderKey;
    if (this.ignoreFilter(orderKey)) return;
    this.setState(({ isDescInner, sortField }) => {
      let _isDesc = isDescInner;
      if (sortField === orderKey) {
        this.sameSortTime += 1;
        if (this.sameSortTime === 2) {
          _isDesc = false;
          orderKey = '';
          this.sameSortTime = 0;
        } else {
          _isDesc = !_isDesc;
        }
      } else {
        this.sameSortTime = 0;
        _isDesc = false;
      }
      return {
        sortField: orderKey,
        isDescInner: _isDesc
      };
    });
  }

  isHidden = el => el && el.offsetParent === null

  initTableContainer = (e) => {
    this.tableContainer = e;
    if (e) {
      this.tableContainerWidth = e.offsetWidth;
      setTimeout(() => {
        e.classList.add('ready');
        if (e && this.state.tableWidth === 'auto') {
          e.classList.add(scrollRightClass);
        }
      }, 100);
    }
    this.calcSize(this.firstRowNodes);
  }

  clearWatch = () => {
    this.desplayWatcher && clearTimeout(this.desplayWatcher);
  }

  saveContainer = (e) => {
    /** 检测表格元素是否被隐藏了，如果被隐藏了，则设置监听器监听显示变化 */
    this.clearWatch();
    const isHide = this.isHidden(e);
    const { records, watcherTimer } = this.props;
    const hasRecord = records.length > 0;
    if (!hasRecord || isHide) {
      this.desplayWatcher = setTimeout(() => {
        this.saveContainer(e);
      }, watcherTimer);
    } else {
      this.initTableContainer(e);
      this.desplayWatcher = null;
    }
  }

  getRowKey = (record, idx) => {
    const { rowKey } = this.props;
    let key;
    if (rowKey) {
      if (IsFunc(rowKey)) {
        key = rowKey(record, idx);
      } else if (typeof rowKey == 'string') {
        key = record[rowKey] || idx;
      }
    } else {
      key = idx;
      exec(() => console.warn('需要设置 rowKey，为每一行设置唯一 key'), 1000);
    }
    return key;
  }

  saveCell = (idx, isMain, rowKey) => (tdDOM) => {
    if (tdDOM && tdDOM.offsetWidth >= tdMaxWidth) tdDOM.classList.add(breakWordClass);
    if (tdDOM && isMain && idx === 0) {
      this.columnHeightInfo[rowKey] = tdDOM.offsetHeight;
    }
    if (tdDOM && !isMain) {
      // eslint-disable-next-line no-param-reassign
      tdDOM.style.height = `${this.columnHeightInfo[rowKey]}px`;
    }
  }

  // eslint-disable-next-line consistent-return
  checkRightAlign = (mapperItem) => {
    const { alignRightTypes = [] } = this.props;
    for (const rightAlignItem of alignRightTypes) {
      // eslint-disable-next-line no-prototype-builtins
      if (mapperItem.hasOwnProperty(rightAlignItem)) {
        return true;
      // eslint-disable-next-line no-continue
      } continue;
    }
  }

  renderCell(options) {
    const {
      record, parentIdx, needCount, rowKey, columns,
      needAction = true, filter, statistics, main
    } = options;
    if (!record) return null;
    // const columns = this.getKeyMapper();
    const keyMapperLen = columns.length;

    const result: any[] = [];

    for (let _idx = 0; _idx < keyMapperLen; _idx++) {
      const mapperItem = columns[_idx];
      // eslint-disable-next-line no-continue
      if (!mapperItem) continue;

      const { key, className, count = true } = mapperItem;
      const isRightAlign = this.checkRightAlign(mapperItem);
      const currText = record[key];

      const needFilter = needAction || this.excludeFilterField.indexOf(key) === -1;
      /** 优先使用 options 传入的 filter 作为过滤器，其次为 this.mapperFilter */
      let filterRes = '-';
      if (IsFunc(filter)) {
        filterRes = filter(currText);
      } else if (needFilter) {
        filterRes = this.mapperFilter(mapperItem, record, parentIdx);
      }

      if (needCount) {
        /**
         * 进入统计流程
         * 1. 判断原始值 currText 是否为数字
         * 2. 判断当前记录是否需要纳入统计 count
         */
        const isNum = !isNaN(+currText) || isStringNumRegex.test(currText);
        if (count && isNum) {
          // 这里是处理累加的逻辑，如果为字符串的字段，则先把逗号去除
          const isNumbTxt = +((`${filterRes}`).replace(',', ''));
          if (!isNaN(isNumbTxt) && typeof isNumbTxt === 'number') {
            statistics[key] = (statistics[key] || 0) + isNumbTxt;
          }
        }
      }

      const tdKey = `${rowKey}_${key}`;
      // let style = {};
      const _className = `${tdSpecClassMapper[key] || ''} ${className || ''} ${isRightAlign ? 'right' : ''}`;
      const tdDOM = (
        <td
          ref={e => this.saveCell(_idx, main, rowKey)(e)}
          // style={mapperItem.w ? {width: mapperItem.w, whiteSpace: 'pre-wrap'} : style}
          className={_className}
          key={tdKey}>
          {filterRes}
        </td>
      );

      result.push(tdDOM);
    }

    return result;
  }

  handleHoverRow = (idx) => {
    this.setState({
      hoveringRow: idx
    });
  }

  renderRow = (options) => {
    const { clickToHighlight } = this.props;
    const { records, ...other } = options;
    const { hoveringRow, highlightRow } = this.state;

    return records.map((record, idx) => {
      if (!record) return;
      const { _highlight = '' } = record;
      const key = this.getRowKey(record, idx);
      const isHighlight = !!highlightRow[idx];
      const isHoving = hoveringRow === idx;
      // eslint-disable-next-line consistent-return
      return (
        <tr
          key={key}
          onMouseEnter={() => this.handleHoverRow(idx)}
          onClick={clickToHighlight ? (e) => this.handleClickToHighlight(e, idx) : undefined}
          className={`${_highlight}${isHoving ? ' hovering' : ''}${isHighlight ? ' highlight' : ''}`}>
          {
            this.renderCell({
              rowKey: key, record, parentIdx: idx, ...other
            })
          }
        </tr>
      );
    });
  }

  calcTableWidth = (columns) => {
    const { headerWidthMapper } = this.state;
    if (headerWidthMapper.length === 0) return null;
    let res = 0;

    columns.forEach((mapper, _idx) => {
      const { idx } = mapper;
      const __idx = idx || _idx;
      // if(fixed == 'right') {
      //   console.log([[...headerWidthMapper].reverse()], idx)
      //   res += [[...headerWidthMapper].reverse()][idx];
      // } else {
      res += headerWidthMapper[__idx];
      // }
    });

    return res;
  }

  renderTableHeader = (options) => {
    const { needInnerSort } = this.props;
    const {
      headerWidthMapper, sortField, sortOutsideField, isDescInner, isDescOutside
    } = this.state;
    const { columns, isAllCheck } = options;
    const style = {
      width: this.calcTableWidth(columns) || undefined
    };
    const isDesc = typeof isDescOutside == 'undefined' ? isDescInner : isDescOutside;
    return (
      <div
        key="tableHead"
        className="__table-scroll"
        style={style}>
        <table className="table nomargin table-header">
          <thead>
            <tr>
              {
                columns.map((item, _idx) => {
                  if (!item) return;
                  // const { key, w } = item;
                  // const cellWidth = w || headerWidthMapper[idx];
                  const { key, idx, onSort } = item;
                  const __idx = idx || _idx;
                  const cellWidth = headerWidthMapper[__idx];
                  const needSort = needInnerSort || onSort;
                  const isRightAlign = this.checkRightAlign(item);

                  let title;
                  if (key === 'checkbox') {
                    title = (
                      <input type="checkbox" checked={isAllCheck}
                        onChange={e => this.toggleAllItems(e.target.checked)}/>
                    );
                  } else {
                    title = this.titleFilter(item, __idx);
                  }

                  const isOrdering = onSort ? sortOutsideField === key : sortField === key;
                  const canOrder = needSort && !this.ignoreFilter(key);
                  const sortTip = canOrder && (
                    <span className={`sort-caret-group ${isDesc ? 'desc' : 'asc'}`}>
                      <span className="caret up" style={{
                        transform: `rotate(180deg)`
                      }}/>
                      <span className="caret down" />
                    </span>
                  );

                  const clickHandlerForTh = needSort ? {
                    onClick: () => {
                      if (IsFunc(onSort)) {
                        const _isDesc = onSort(item, isDescOutside);
                        this.setState({
                          isDescOutside: !!_isDesc,
                          sortOutsideField: key
                        });
                      } else {
                        this.orderRecord(key);
                      }
                    }
                  } : {};

                  const _className = classnames(
                    isOrdering && (isDesc ? '_desc' : '_asc'),
                    canOrder && '_order _btn',
                    isRightAlign && 'right'
                  );

                  // eslint-disable-next-line consistent-return
                  return (
                    <th
                      className={_className}
                      key={key}
                      {...clickHandlerForTh}
                      style={{
                        width: cellWidth
                      }}>
                      {title}
                      {sortTip}
                    </th>
                  );
                })
              }
            </tr>
          </thead>
        </table>
      </div>
    );
  }

  reSaveFirstRow = () => {
    this.firstRowNodes = this.mainTableBody ? this.mainTableBody.querySelectorAll('tbody tr:first-child td') : null;
  }

  saveTableBody = (t) => {
    this.mainTableBody = t;
    this.firstRowNodes = t ? t.querySelectorAll('tbody tr:first-child td') : null;
    t && this.calcSize(this.firstRowNodes);
  }

  hasFixedGroup = () => this.leftFixedTable || this.rightFixedTable

  renderTableBody = (options) => {
    const { height, needCount } = this.props;
    const { tableWidth, isAutoWidth } = this.state;
    const {
      hasRecord, columns, ref, main
    } = options;
    // const hasFixedTable = this.hasFixedGroup();

    /** 统计字段，每一次统计都是一个新对象 */
    const statistics = {
      _highlight: 'theme',
      id: 'statistics'
    };
    const style = Object.assign({}, {
      height,
      width: isAutoWidth ? tableWidth : this.calcTableWidth(columns)
    });

    return hasRecord ? (
      <div
        key="tableBody"
        onScroll={this.handleTableScroll}
        ref={ref}
        className="__table-scroll"
        style={style}>
        <table className="table nomargin table-body"
          ref={main ? this.saveTableBody : null}>
          <tbody>
            {
              this.renderRow({
                ...options,
                needCount,
                /** 在渲染 body 的时候会做数据统计，以 statistics 对象做记录 */
                statistics
              })
            }
          </tbody>
          {
            needCount && (
              <tfoot>
                {
                  this.renderRow({
                    ...options,
                    records: [statistics],
                    needAction: false,
                    filter: moneyFormat
                  })
                }
              </tfoot>
            )
          }
        </table>
      </div>
    ) : main && (
      <span className="no-record-tip">
        <Icon n="noData"/>
        <span className="text">{this.$T_UKE('暂无记录')}</span>
      </span>
    );
  }

  renderTable = (options, key) => {
    const { className, style } = options;
    const tableHeader = this.renderTableHeader(options);
    const tableBody = this.renderTableBody(options);
    return (
      <div key={key}
        style={style}
        className={`__table-scroll-container ${className || ''}`}>
        {tableHeader}
        {tableBody}
      </div>
    );
  }

  saveDOM = ref => (e) => {
    this[ref] = e;
  }

  saveLeftFixed = (e) => {
    this.leftFixedTable = e;
  }

  saveRightFixed = (e) => {
    this.rightFixedTable = e;
  }

  saveMainTable = (e) => {
    this.mainTable = e;
  }

  renderFixedGroup = (options) => {
    const hasLeft = this.fixedLeftGroup.length > 0;
    const hasRight = this.fixedRightGroup.length > 0;
    const leftFixedTable = hasLeft && this.renderTable({
      ...options,
      className: 'table-fixed left',
      columns: this.fixedLeftGroup,
      ref: this.saveLeftFixed,
    }, 'table-fixed-left');
    const rightFixedTable = hasRight && this.renderTable({
      ...options,
      className: 'table-fixed right',
      ref: this.saveRightFixed,
      columns: this.fixedRightGroup,
    }, 'table-fixed-right');

    return !hasLeft && !hasRight ? null : [
      leftFixedTable, rightFixedTable
    ];
  }

  renderMainTable = options => this.renderTable({
    ...options,
    main: true,
    ref: this.saveMainTable,
  }, 'mainTable')

  handleTableScroll = (e) => {
    const { target } = e;
    if (e.currentTarget !== target) return;
    const currScrollOffset = target.scrollTop;
    if (currScrollOffset === this.lastScrollTop) return;

    const { rightFixedTable, leftFixedTable, mainTable } = this;
    if (target !== leftFixedTable && leftFixedTable) {
      leftFixedTable.scrollTop = currScrollOffset;
    }
    if (target !== rightFixedTable && rightFixedTable) {
      rightFixedTable.scrollTop = currScrollOffset;
    }
    if (target !== mainTable && mainTable) {
      mainTable.scrollTop = currScrollOffset;
    }
    this.lastScrollTop = currScrollOffset;
    this.scrollY = currScrollOffset;
  }

  handleScrollHor = (e) => {
    // this.calcScroll(e, 'scrollLeft');
    const { target } = e;
    if (e.currentTarget !== target) return;
    const { scrollLeft } = target;
    if (scrollLeft === this.lastScrollTop) return;

    const { tableWidth } = this.state;
    const scrollLeftEndPoint = typeof tableWidth == 'number' ? tableWidth - this.tableContainerWidth : 0;
    if (scrollLeft > 0) {
      target.classList.add(scrollLeftClass);
    } else {
      target.classList.remove(scrollLeftClass);
    }
    if (scrollLeft === scrollLeftEndPoint) {
      target.classList.add(scrollRightClass);
    } else {
      target.classList.remove(scrollRightClass);
    }
    this.lastScrollLeft = scrollLeft;
    this.scrollX = scrollLeft;
  }

  render() {
    const {
      whenCheckAction, needCheck, checkedOverlay
    } = this.props;
    const {
      checkedItems
    } = this.state;
    const records = this.recordsOrderFilter();
    const hasRecord = records.length > 0;
    const columns = this.getKeyMapper();

    const checkedItemLen = Object.keys(checkedItems).length;
    const hasChecked = checkedItemLen > 0;
    const isAllCheck = hasRecord && (checkedItemLen === records.length);
    const _checkedOverlay = checkedOverlay || whenCheckAction;

    const renderTableConfig = {
      hasRecord,
      columns,
      records,
      isAllCheck
    };

    const mainTable = this.renderMainTable(renderTableConfig);
    const fixedGroup = this.renderFixedGroup(renderTableConfig);

    const extendDOM = needCheck && _checkedOverlay && (
      <div className={`checked-actions${hasChecked ? ' show' : ''}`}>
        <span className="mr10">
          <span className="mr10">
            {this.$T_UKE('已选')} <span className="t_theme">{checkedItemLen}</span> {this.$T_UKE('项')}
          </span>
          <span className="link" onClick={this.clearCheckeds}>{this.$T_UKE('清除')}</span>
        </span>
        {typeof _checkedOverlay === 'function' ? _checkedOverlay({
          checkedItems, clearCheckeds: this.clearCheckeds
        }) : _checkedOverlay}
      </div>
    );

    return (
      <div className="__table" onMouseLeave={e => this.handleHoverRow(null)}>
        {extendDOM}
        <div
          className="table-render"
          onScroll={this.handleScrollHor}
          ref={this.saveContainer}>
          {mainTable}
          {fixedGroup}
        </div>
      </div>
    );
  }
}
