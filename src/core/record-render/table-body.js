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
    /** 无视的排序字段 */
    sortIgnores: PropTypes.arrayOf(PropTypes.string),
    /** 当选中时往表格顶部嵌入的内容 */
    whenCheckAction: PropTypes.any,
  };
  static defaultProps = {
    sortIgnores: [],
    needCheck: false,
    needSort: true,
    fixHead: true,
    checkWidth: 30,
    needCount: false,
  };
  excludeFilterField = ['action', 'checkbox'];
  sortIgnores = ['action', 'checkbox'];
  firstTDDOMs = {};
  sameSortTime = 0;
  fixedLeftGroup = {};
  fixedRightGroup = {};
  constructor(props) {
    super(props);

    this.state = {
      headerWidthMapper: [],
      containerWidth: 'auto',
      sortField: '',
      isDesc: false,
      checkedItems: {},
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeCalcSize);
    this.calcSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCalcSize);
  }

  componentDidUpdate() {
    this.calcSize();
  }

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

    // this.getFixedGroup(result);

    return result;
  }

  // getFixedGroup = (keyMapper) => {
  //   keyMapper.forEach(item => {
  //     const { key, fixed } = item;
  //     switch (fixed) {
  //     case 'left':
  //       this.fixedLeftGroup[key] = true;
  //       break;
  //     case 'right':
  //       this.fixedRightGroup[key] = true;
  //       break;
  //     }
  //   });
  // }

  calcSize() {
    if(!this.tableRenderDOM) return;
    let nextHeaderWidthMapper = [];
    let nextContainerWidth = 0;
    const { headerWidthMapper } = this.state;
    const keyMapper = this.getKeyMapper();
    if(Object.keys(this.firstTDDOMs).length === 0) return;
    keyMapper.forEach((_, tdIdx) => {
      let currTDDOM = this.firstTDDOMs[tdIdx];
      let currWidth = currTDDOM.offsetWidth || headerWidthMapper[tdIdx];
      nextHeaderWidthMapper[tdIdx] = currWidth;
      nextContainerWidth += nextHeaderWidthMapper[tdIdx];
    });
    if(
      nextHeaderWidthMapper.join(',') !== headerWidthMapper.join(',')
    ) {
      const tableRenderWidth = this.tableRenderDOM.offsetWidth;
      this.setState({
        headerWidthMapper: nextHeaderWidthMapper,
        containerWidth: nextContainerWidth > tableRenderWidth ? nextContainerWidth : 'auto'
      });
    }
  }

  resizeCalcSize = () => {
    if(!this.tableRenderDOM) return;
    const { containerWidth } = this.state;
    if(containerWidth != 'auto' && containerWidth < this.tableRenderDOM.offsetWidth) {
      this.setState({
        containerWidth: 'auto'
      });
    }
    this.calcSize();
  }

  ignoreFilter(str) {
    return [...this.sortIgnores, ...this.props.sortIgnores].indexOf(str) !== -1;
  }

  tdRefSaver = (idx, parentIdx) => tdDOM => {
    if(parentIdx == 0 && tdDOM) {
      this.firstTDDOMs[idx] = tdDOM;
    }
    if(tdDOM && tdDOM.offsetWidth >= tdMaxWidth) tdDOM.classList.add('break-word');
  }

  renderCell(options) {
    const {
      record, parentIdx, needCount, rowKey,
      needAction = true, filter, statistics
    } = options;
    if(!record) return;
    const keyMapper = this.getKeyMapper();
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
      const _className = `${tdSpecClassMapper[key] || ''} ${className ? className : ''}`;
      const tdDOM = (
        <td
          ref={this.tdRefSaver(_idx, parentIdx)}
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

  // getStatisticDOM(record) {
  //   if(Object.keys(record).length > 0) return this.renderCell({
  //     record, parentIdx: 'statistics', needCount: false, needAction: false
  //   });
  // }

  // getHeaderWidth() {
  //   const { headerWidthMapper } = this.state;
  //   let result = 0;
  //   const keyMapper = this.getKeyMapper();
  //   keyMapper.forEach((item, idx) => {
  //     if(item) result += headerWidthMapper[idx];
  //   });
  //   return result;
  // }

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

  saveTable = e => {
    this.tableRenderDOM = e;
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

  renderRow = (options) => {
    const { records, ...other } = options;
    return records.map((record, idx) => {
      if(!record) return;
      const { _highlight } = record;
      let key = this.getRowKey(record, idx);
      return (
        <tr
          key={key}
          className={_highlight}>
          {
            this.renderCell({
              rowKey: key, record, parentIdx: idx, ...other
            })
          }
        </tr>
      );
    });
  }

  renderTableHeader = (options) => {
    const { needSort } = this.props;
    const { containerWidth, headerWidthMapper, sortField, isDesc } = this.state;
    const { keyMapper, isAllCheck } = options;
    return (
      <div
        key="tableHead"
        className="uke-table-scroll" style={{width: containerWidth}}>
        <table className="table nomargin table-header">
          <thead>
            <tr>
              {
                keyMapper.map((item, idx) => {
                  if(!item) return;
                  // const { key, w } = item;
                  // const currHeaderWidth = w || headerWidthMapper[idx];
                  const { key } = item;
                  const currHeaderWidth = headerWidthMapper[idx];
                  
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
                        width: currHeaderWidth
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

  renderTableBody = (options) => {
    const { height, needCount } = this.props;
    const { containerWidth } = this.state;
    const { hasRecord, records } = options;

    /** 统计字段，每一次统计都是一个新对象 */
    let statistics = {
      _highlight: 'theme',
      id: 'statistics'
    };
    
    return hasRecord ? (
      <div
        key="tableBody"
        className="uke-table-scroll" style={{height, width: containerWidth}}>
        <table className="table nomargin table-body">
          <tbody>
            {
              this.renderRow({
                records, needCount,
                /** 在渲染 body 的时候会做数据统计，以 statistics 对象做记录 */
                statistics
              })
            }
          </tbody>
          <tfoot>
            {
              needCount && this.renderRow({
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

  renderTable = (options) => {
    const tableHeader = this.renderTableHeader(options);
    const tableBody = this.renderTableBody(options);
    return [
      tableHeader, tableBody
    ];
  }

  render() {
    const {
      whenCheckAction, needCheck
    } = this.props;
    const {
      checkedItems
    } = this.state;
    const records = this.recordsOrderFilter();
    const hasRecord = records.length > 0;
    const keyMapper = this.getKeyMapper();

    const checkedItemLen = Object.keys(checkedItems).length;
    const hasChecked = checkedItemLen > 0;
    const isAllCheck = hasRecord && (checkedItemLen == records.length);

    const table = this.renderTable({
      hasRecord,
      keyMapper,
      records,
      isAllCheck
    });

    const extendDOM = needCheck && whenCheckAction && (
      <div className={"checked-actions" + (hasChecked ? ' show' : '')}>
        <span className="mr10">
          <span className="mr10">{this.gm('已选')} <span className="t_theme">{checkedItemLen}</span> {this.gm('项')}</span>
          <span className="link" onClick={this.clearCheckeds}>{this.gm('清除')}</span>
        </span>
        {whenCheckAction}
      </div>
    );

    return (
      <div className={"table-render" + (hasChecked ? ' has-checked' : '')}
        ref={this.saveTable}>
        {extendDOM}
        {table}
        {/* {tableHeader}
        {tableBody} */}
      </div>
    );
  }
}
