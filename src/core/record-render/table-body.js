import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, IsFunc, MoneyFormat, HasValue } from 'basic-helper';
import classnames from 'classnames';

import MapperFilter from './mapper-filter';
import { Icon } from '../icon';

const isStringNumRegex = /\d+,?/;

const tdSpecClassMapper = {
  checkbox: 'check-td'
};
const scrollLeftClass = 'scroll-to-left';
const scrollRightClass = 'scroll-at-right';

const tdMaxWidth = 400;

const moneyFormat = text => {
  return HasValue(text) ? text.toLocaleString('en-US') : '-';
};

// const excludeKey = (target, keys) => {
//   let res = Object.assign({}, target);
//   keys.forEach(item => {
//     res[item] = '';
//   });
//   return res;
// };

// const excludeKeys = ['records', 'keyMapper'];

/**
 * 提供一个快速的表格数据渲染容器，不需要关注具体如何渲染，只需要传入对应的数据和过滤器
 *
 * @export
 * @class Table
 * @extends {MapperFilter}
 */
export default class Table extends MapperFilter {
  static propTypes = {
    /** 对应表格中的每一列（column）的 record 的 key 的映射的集合。表格渲染的核心配置，RecordRender 的机制是根据 keyMapper 配置遍历 records 中的每一个具体字段，找到对应的过滤器，实现通用的表格处理 */
    keyMapper: PropTypes.arrayOf(PropTypes.shape({
      /** column 对应的 key */
      key: PropTypes.string.isRequired,
      /** 处理数据源对应的字段的过滤器函数，可以返回任意类型 */
      filter: PropTypes.func,
      /** 内置 filter，是否日期+时分秒 */
      datetime: PropTypes.any,
      /** 内置 filter，是否日期 */
      date: PropTypes.any,
      /** 内置 filter，是否格式化成金钱 */
      money: PropTypes.any,
      /** 单个格子的宽度 */
      // w: PropTypes.any,
      /** 内置 filter，是否以绝对值格式化成金钱 */
      abvMoney: PropTypes.any,
      /** 内置 filter，是否以绝对值格式化成金钱 */
      count: PropTypes.any,
      /** 内置 filter，字段映射 mapper */
      namesMapper: PropTypes.shape({
        key: PropTypes.string
      }),
    })).isRequired,
    /** 表格的数据源，用于每一行（row）的数据填充 */
    records: PropTypes.arrayOf(PropTypes.object).isRequired,
    /** 用于获取 row key */
    rowKey: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
    /** 是否需要统计 */
    needCount: PropTypes.bool,
    /** 是否固定头部 */
    fixHead: PropTypes.bool,
    /** 一些表头的选择器 onChange 的回调, 回调参数 [emitVal, selectorConfig] */
    onChange: PropTypes.func,
    /** 是否需要排序 */
    needSort: PropTypes.bool,
    /** 是否多选 */
    needCheck: PropTypes.bool,
    /** checkbox 的宽度 */
    checkWidth: PropTypes.number,
    /** 表格的高度，用于固定表头 */
    height: PropTypes.oneOfType([
      PropTypes.number, PropTypes.string
    ]),
    /** 无视的排序字段 */
    sortIgnores: PropTypes.arrayOf(PropTypes.string),
    /** 当选中时往表格顶部嵌入的内容 */
    whenCheckAction: PropTypes.oneOfType([
      PropTypes.func, PropTypes.any
    ]),
  };
  static defaultProps = {
    sortIgnores: [],
    needCheck: false,
    height: 'auto',
    needSort: true,
    fixHead: true,
    checkWidth: 30,
    needCount: false,
  };
  excludeFilterField = ['action', 'checkbox'];
  sortIgnores = ['action', 'checkbox'];
  firstTDDOMs = {};
  firstRowNodes = {};
  sameSortTime = 0;
  fixedLeftGroup = [];
  fixedRightGroup = [];
  columnHeightInfo = {};
  constructor(props) {
    super(props);

    this.state = {
      headerWidthMapper: [],
      tableWidth: 'auto',
      sortField: '',
      isDesc: false,
      hoveringRow: null,
      checkedItems: {},
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeCalcSize);
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

  toggleSelectItem = (item, idx) => {
    const { checkedItems } = this.state;
    const nextCheckedItems = {...checkedItems};
    if(nextCheckedItems[idx]) {
      delete nextCheckedItems[idx];
    } else {
      nextCheckedItems[idx] = item;
    }
    this.selectItems(nextCheckedItems, idx);
  }

  toggleAllItems(allCheck) {
    const { checkedItems } = this.state;
    let nextCheckedItems = {...checkedItems};
    if(!allCheck) {
      nextCheckedItems = {};
    } else {
      this.props.records.forEach((item, idx) => nextCheckedItems[idx] = item);
    }
    this.selectItems(nextCheckedItems);
  }

  selectItems(nextState, idx) {
    const { onCheck } = this.props;
    this.checkedItems = nextState;
    this.setState({
      checkedItems: nextState
    });
    Call(onCheck, nextState, idx);
  }

  getCheckbox = (str, item, mapper, idx) => {
    const { checkedItems } = this.state;
    let checked = !!checkedItems[idx];
    return (
      <input type="checkbox"
        checked={checked} onChange={e => this.toggleSelectItem(item, idx)}/>
    );
  }
  
  getKeyMapper = () => {
    const { keyMapper = [], needCheck, checkWidth } = this.props;

    let result = keyMapper;

    if(needCheck) {
      const fixedLeft = keyMapper[0].fixed == 'left';
      const checkExtend = Object.assign({}, fixedLeft ? {fixed: 'left'} : {}, {
        key: 'checkbox',
        // w: checkWidth,
        filter: this.getCheckbox
      });
      result = [checkExtend, ...keyMapper];
    }

    this.saveFixedGroup(result);

    return result;
  }

  saveFixedGroup = (keyMapper) => {
    if(this.hadSaved) return;
    this.hadSaved = true;
    keyMapper.forEach((item, idx) => {
      const { fixed } = item;
      const nextItem = {...item, idx};
      switch (fixed) {
      case 'left':
        this.fixedLeftGroup.push(nextItem);
        break;
      case 'right':
        this.fixedRightGroup.push(nextItem);
        break;
      }
    });
  }

  calcSize(firstRowNodes) {
    if(!this.tableContainer || !firstRowNodes) return;
    // if(Object.keys(this.firstTDDOMs).length === 0) return;
    const cellsLen = firstRowNodes.length;
    const { headerWidthMapper } = this.state;
    
    let nextHeaderWidthMapper = [];
    let nextContainerWidth = 0;

    for (let i = 0; i < cellsLen; i++) {
      const currCell = firstRowNodes[i];
      const currCellWidth = currCell.offsetWidth || headerWidthMapper[i];
      if(!currCellWidth) continue;
      nextHeaderWidthMapper[i] = currCellWidth;
      nextContainerWidth += nextHeaderWidthMapper[i];
    }
    // const keyMapper = this.getKeyMapper();
    // keyMapper.forEach((_, tdIdx) => {
    //   let currTDDOM = this.firstTDDOMs[tdIdx];
    //   let currWidth = currTDDOM.offsetWidth || headerWidthMapper[tdIdx];
    //   nextHeaderWidthMapper[tdIdx] = currWidth;
    //   nextContainerWidth += nextHeaderWidthMapper[tdIdx];
    // });
    if(
      nextHeaderWidthMapper.join(',') !== headerWidthMapper.join(',')
    ) {
      const tableContainerWidth = this.tableContainer.offsetWidth;
      const isTableMoreContainer = nextContainerWidth > tableContainerWidth;
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
    if(!this.tableContainer) return;
    const { tableWidth } = this.state;
    if(tableWidth != 'auto' && tableWidth < this.tableContainer.offsetWidth) {
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

  ignoreFilter(str) {
    return [...this.sortIgnores, ...this.props.sortIgnores].indexOf(str) !== -1;
  }

  recordsOrderFilter() {
    const { sortField, isDesc } = this.state;
    const { records } = this.props;
    if(!sortField) return records;
    let result = [...records];
    result.sort((itemPrev, itemNext) => {
      let sortTargetPrev = itemPrev[sortField];
      let sortTargetNext = itemNext[sortField];

      let res;

      switch (true) {
      case typeof sortTargetPrev == 'string':
        res = sortTargetPrev.localeCompare(sortTargetNext);
        break;
      case typeof sortTargetPrev == 'number':
        res = sortTargetPrev - sortTargetNext;
        break;
      }

      return isDesc ? res : res * -1;
    });
    return result;
  }

  orderRecord(orderKey) {
    if(this.ignoreFilter(orderKey)) return;
    this.setState(({isDesc, sortField}) => {
      let _isDesc = isDesc;
      if(sortField == orderKey) {
        this.sameSortTime += 1;
        if(this.sameSortTime === 2) {
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
        isDesc: _isDesc
      };
    });
  }

  isHidden(el) {
    return (el.offsetParent === null);
  }

  initTableContainer = (e) => {
    this.tableContainer = e;
    if(e) this.tableContainerWidth = e.offsetWidth;
    setTimeout(() => {
      if(e && this.state.tableWidth == 'auto') {
        e.classList.add(scrollRightClass);
      }
    }, 100);
    this.calcSize(this.firstRowNodes);
  }

  clearWatch = () => {
    this.watchDisplayInterval && clearTimeout(this.watchDisplayInterval);
  }

  saveContainer = e => {
    /** 检测表格元素是否被隐藏了，如果被隐藏了，则设置监听器监听显示变化 */
    this.clearWatch();
    const isHide = this.isHidden(e);
    if(isHide) {
      this.watchDisplayInterval = setTimeout(() => {
        this.saveContainer(e);
      }, 1000);
    } else {
      this.initTableContainer(e);
      this.watchDisplayInterval = null;
    }
  }

  getRowKey = (record, idx) => {
    const { rowKey } = this.props;
    let key;
    if(rowKey) {
      key = IsFunc(rowKey) ? rowKey(record) : record[rowKey] || idx;
    } else {
      key = idx;
      console.warn('需要设置 rowKey，为每一行设置唯一 key');
    }
    return key;
  }

  saveCell = (idx, isMain, rowKey) => tdDOM => {
    if(tdDOM && isMain && tdDOM.offsetWidth >= tdMaxWidth) tdDOM.classList.add('break-word');
    if(tdDOM && isMain && idx === 0) {
      this.columnHeightInfo[rowKey] = tdDOM.offsetHeight;
    }
    if(tdDOM && !isMain) {
      tdDOM.style.height = this.columnHeightInfo[rowKey] + 'px';
    }
  }

  renderCell(options) {
    const {
      record, parentIdx, needCount, rowKey, keyMapper,
      needAction = true, filter, statistics, main
    } = options;
    if(!record) return;
    // const keyMapper = this.getKeyMapper();
    const keyMapperLen = keyMapper.length;

    let result = [];

    for (let _idx = 0; _idx < keyMapperLen; _idx++) {
      const mapperItem = keyMapper[_idx];
      if(!mapperItem) continue;

      const { key, className, count = true } = mapperItem;
      const currText = record[key];

      const needFilter = needAction || this.excludeFilterField.indexOf(key) === -1;
      /** 优先使用 options 传入的 filter 作为过滤器，其次为 this.mapperFilter */
      let filterRes = '-';
      if(IsFunc(filter)) {
        filterRes = filter(currText);
      } else if(needFilter) {
        filterRes = this.mapperFilter(mapperItem, record, parentIdx);
      }
      // filterRes = needFilter ? IsFunc(filter) ? filter(currText) : this.mapperFilter(mapperItem, record, parentIdx) : '-';

      if(needCount) {
        /** 
         * 进入统计流程
         * 1. 判断原始值 currText 是否为数字
         * 2. 判断当前记录是否需要纳入统计 count
         */
        const isNum = !isNaN(+currText) || isStringNumRegex.test(currText);
        if(count && isNum) {
          // 这里是处理累加的逻辑，如果为字符串的字段，则先把逗号去除
          const isNumbTxt = +((currText + '').replace(',', ''));
          if(!isNaN(isNumbTxt) && typeof isNumbTxt === 'number') {
            statistics[key] = (statistics[key] || 0) + isNumbTxt;
          }
        }
      }

      const tdKey = `${rowKey}_${key}`;
      // let style = {};
      const _className = `${tdSpecClassMapper[key] || ''} ${className ||  ''}`;
      const tdDOM = (
        <td
          ref={this.saveCell(_idx, main, rowKey)}
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
    const { records, ...other } = options;
    const { hoveringRow } = this.state;

    return records.map((record, idx) => {
      if(!record) return;
      const { _highlight = '' } = record;
      let key = this.getRowKey(record, idx);
      return (
        <tr
          key={key}
          onMouseEnter={e => this.handleHoverRow(idx)}
          className={`${_highlight} ${hoveringRow === idx ? 'hovering' : ''}`}>
          {
            this.renderCell({
              rowKey: key, record, parentIdx: idx, ...other
            })
          }
        </tr>
      );
    });
  }

  calcTableWidth = (keyMapper) => {
    const { headerWidthMapper } = this.state;
    if(headerWidthMapper.length === 0) return;
    let res = 0;

    keyMapper.forEach((mapper, _idx) => {
      const { fixed, idx } = mapper;
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
    const { needSort } = this.props;
    const { tableWidth, headerWidthMapper, sortField, isDesc } = this.state;
    const { keyMapper, isAllCheck } = options;
    const style = {
      width: this.calcTableWidth(keyMapper)
    };
    return (
      <div
        key="tableHead"
        className="uke-table-scroll"
        style={style}>
        <table className="table nomargin table-header">
          <thead>
            <tr>
              {
                keyMapper.map((item, idx) => {
                  if(!item) return;
                  // const { key, w } = item;
                  // const cellWidth = w || headerWidthMapper[idx];
                  const { key } = item;
                  const cellWidth = headerWidthMapper[idx];
                  
                  let title = '';
                  if(key !== 'checkbox') {
                    title = this.titleFilter(item, idx);
                  } else {
                    title = (
                      <input type="checkbox" checked={isAllCheck}
                        onChange={e => this.toggleAllItems(e.target.checked)}/>
                    );
                  }

                  const isOrdering = sortField == key;
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
                    onClick: () => this.orderRecord(key)
                  } : {};

                  return (
                    <th 
                      className={`${isOrdering ? (isDesc ? '_desc' : '_asc') : ''} ${canOrder ? '_order _btn' : ''}`}
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

  saveTableBody = t => {
    this.firstRowNodes = t ? t.querySelectorAll('tbody tr:first-child td') : null;
    t && this.calcSize(this.firstRowNodes);
  }

  hasFixedGroup = () => {
    return this.leftFixedTable || this.rightFixedTable;
  }

  renderTableBody = (options) => {
    const { height, needCount } = this.props;
    const { tableWidth, isAutoWidth } = this.state;
    const { hasRecord, isSetWidth, keyMapper, ref, main } = options;
    const hasFixedTable = this.hasFixedGroup();

    /** 统计字段，每一次统计都是一个新对象 */
    let statistics = {
      _highlight: 'theme',
      id: 'statistics'
    };
    const style = Object.assign({}, {
      height,
      width: isAutoWidth ? tableWidth : this.calcTableWidth(keyMapper)
    });
    
    return hasRecord ? (
      <div
        key="tableBody"
        onScroll={!isAutoWidth && hasFixedTable ? this.handleTableScroll : null}
        ref={ref}
        className="uke-table-scroll"
        style={style}>
        <table className="table nomargin table-body"
          ref={isSetWidth ? this.saveTableBody : null}>
          <tbody>
            {
              this.renderRow({
                ...options, needCount,
                /** 在渲染 body 的时候会做数据统计，以 statistics 对象做记录 */
                statistics
              })
            }
          </tbody>
          <tfoot>
            {
              needCount && this.renderRow({
                ...options,
                records: [statistics],
                needAction: false,
                filter: moneyFormat
              })
            }
          </tfoot>
        </table>
      </div>
    ) : (
      <span className="no-record-tip">
        <Icon n="noData"/>
        <span className="text">{this.gm('暂无记录')}</span>
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
        className={`uke-table-scroll-container ${className || ''}`}>
        {tableHeader}
        {tableBody}
      </div>
    );
  }

  saveDOM = ref => e => {
    this[ref] = e;
  }

  saveLeftFixed = e => {
    this.leftFixedTable = e;
  }

  saveRightFixed = e => {
    this.rightFixedTable = e;
  }

  saveMainTable = e => {
    this.mainTable = e;
  }

  renderFixedGroup = (options) => {
    const hasLeft = this.fixedLeftGroup.length > 0;
    const hasRight = this.fixedRightGroup.length > 0;
    const leftFixedTable = hasLeft && this.renderTable({
      ...options,
      className: 'table-fixed left',
      keyMapper: this.fixedLeftGroup,
      ref: this.saveLeftFixed,
    }, 'table-fixed-left');
    const rightFixedTable = hasRight && this.renderTable({
      ...options,
      className: 'table-fixed right',
      ref: this.saveRightFixed,
      keyMapper: this.fixedRightGroup,
    }, 'table-fixed-right');

    return !hasLeft && !hasRight ? null : [
      leftFixedTable, rightFixedTable
    ];
  }

  renderMainTable = (options) => {
    return this.renderTable({
      ...options,
      main: true,
      ref: this.saveMainTable,
      isSetWidth: true
    }, 'mainTable');
  }

  handleTableScroll = e => {
    const target = e.target;
    if (e.currentTarget !== target) return;
    const currScrollOffset = target.scrollTop;
    if(currScrollOffset === this.lastScrollTop) return;

    const { rightFixedTable, leftFixedTable, mainTable } = this;
    if(target !== leftFixedTable && leftFixedTable) {
      leftFixedTable.scrollTop = currScrollOffset;
    }
    if(target !== rightFixedTable && rightFixedTable) {
      rightFixedTable.scrollTop = currScrollOffset;
    }
    if(target !== mainTable && mainTable) {
      mainTable.scrollTop = currScrollOffset;
    }
    this.lastScrollTop = currScrollOffset;
  }

  handleScrollHor = (e) => {
    // this.calcScroll(e, 'scrollLeft');
    const target = e.target;
    if (e.currentTarget !== target) return;
    const scrollLeft = target.scrollLeft;
    if(scrollLeft === this.lastScrollTop) return;

    const { tableWidth } = this.state;
    const scrollLeftEndPoint = tableWidth - this.tableContainerWidth;
    if(scrollLeft > 0) {
      target.classList.add(scrollLeftClass);
    } else {
      target.classList.remove(scrollLeftClass);
    }
    if(scrollLeft === scrollLeftEndPoint) {
      target.classList.add(scrollRightClass);
    } else {
      target.classList.remove(scrollRightClass);
    }
    this.lastScrollLeft = scrollLeft;
  }

  render() {
    const {
      whenCheckAction, needCheck
    } = this.props;
    const {
      checkedItems, tableWidth, isAutoWidth
    } = this.state;
    const records = this.recordsOrderFilter();
    const hasRecord = records.length > 0;
    const keyMapper = this.getKeyMapper();

    const checkedItemLen = Object.keys(checkedItems).length;
    const hasChecked = checkedItemLen > 0;
    const isAllCheck = hasRecord && (checkedItemLen == records.length);

    const renderTableConfig = {
      hasRecord,
      keyMapper,
      records,
      isAllCheck
    };

    const mainTable = this.renderMainTable(renderTableConfig);
    // const fixedGroup = this.renderFixedGroup(mainTable);
    const fixedGroup = this.renderFixedGroup(renderTableConfig);

    const extendDOM = needCheck && whenCheckAction && (
      <div className={"checked-actions" + (hasChecked ? ' show' : '')}>
        <span className="mr10">
          <span className="mr10">{this.gm('已选')} <span className="t_theme">{checkedItemLen}</span> {this.gm('项')}</span>
          <span className="link" onClick={this.clearCheckeds}>{this.gm('清除')}</span>
        </span>
        {IsFunc(whenCheckAction) ? whenCheckAction({
          checkedItems, clearCheckeds: this.clearCheckeds
        }) : whenCheckAction}
      </div>
    );

    return (
      <div className="uke-table" onMouseLeave={e => this.handleHoverRow(null)}>
        {extendDOM}
        <div
          className={"table-render" + (isAutoWidth ? ' auto-width' : '')}
          onScroll={!isAutoWidth && fixedGroup ? this.handleScrollHor : undefined}
          // className={"table-render" + (hasChecked ? ' has-checked' : '')}
          ref={this.saveContainer}>
          {mainTable}
          {fixedGroup}
          {/* {tableHeader}
          {tableBody} */}
        </div>
      </div>
    );
  }
}
