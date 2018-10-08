import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { CallFunc } from 'basic-helper';

import MapperFilter from './mapper-filter';
import Icon from '../icon';

export default class TableBody extends MapperFilter {
  static propTypes = {
    keyMapper: PropTypes.arrayOf(PropTypes.object).isRequired,
    needCount: PropTypes.bool,
    needCheck: PropTypes.bool,
    allCheck: PropTypes.bool,
    sortIgnores: PropTypes.arrayOf(PropTypes.string),
    onCheckAll: PropTypes.func,
    whenCheckAction: PropTypes.any,
    records: PropTypes.arrayOf(PropTypes.object).isRequired
  };
  static defaultProps = {
    sortIgnores: ['checkbox']
  };
  constructor(props) {
    super(props);

    this.state = {
      headerWidthMapper: [],
      containerWidth: 'auto',
      sortField: '',
      isDesc: false,
      checkedItems: {},
    };

    this.firstTDDOMs = {};
    this.tdNumb = 0;
    this.sameSortTime = 0;
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeCalcSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCalcSize);
  }

  componentDidUpdate() {
    this.calcSize();
  }

  toggleSelectItem = (item, idx) => {
    let nextCheckedItems = this.state.checkedItems;
    if(nextCheckedItems[idx]) {
      delete nextCheckedItems[idx];
    } else {
      nextCheckedItems[idx] = item;
    }
    this.selectItems(nextCheckedItems, idx);
  }

  toggleAllItems(allCheck) {
    let nextCheckedItems = this.state.checkedItems;
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
    CallFunc(onCheck)(nextState, idx);
  }

  getKeyMapper = () => {
    const { keyMapper = [], needCheck } = this.props;

    let checkExtend = {
      key: 'checkbox',
      filter: (str, item, mapper, idx) => {
        // console.log()
        let checked = !!this.state.checkedItems[idx];
        return (
          <input type="checkbox" checked={checked} onClick={e => this.toggleSelectItem(item, idx)}/>
        );
      }
    };

    let result = needCheck ? [checkExtend, ...keyMapper] : keyMapper;

    return result;
  }

  calcSize() {
    let nextHeaderWidthMapper = {};
    let nextContainerWidth = 0;
    Object.keys(this.firstTDDOMs).forEach(tdIdx => {
      let currTDDOM = this.firstTDDOMs[tdIdx];
      nextHeaderWidthMapper[tdIdx] = currTDDOM.offsetWidth;
      nextContainerWidth += nextHeaderWidthMapper[tdIdx];
    });
    if(
      JSON.stringify(nextHeaderWidthMapper) !== JSON.stringify(this.state.headerWidthMapper)
    ) {
      const tableRenderWidth = this.tableRenderDOM.offsetWidth;
      this.setState({
        headerWidthMapper: nextHeaderWidthMapper,
        containerWidth: nextContainerWidth > tableRenderWidth ? nextContainerWidth : 'auto'
      });
    }
  }

  resizeCalcSize = () => {
    const {containerWidth} = this.state;
    if(containerWidth != 'auto' && containerWidth < this.tableRenderDOM.offsetWidth) {
      this.setState({
        containerWidth: 'auto'
      });
    }
    this.calcSize();
  }

  ignoreFilter(str) {
    return this.props.sortIgnores.indexOf(str) !== -1;
  }

  getMapperItemsDOM(record, parentIdx, needCount, needAction = true) {
    if(!record) return;
    const keyMapper = this.getKeyMapper();
    let tdLen = 0;
    let result = keyMapper.map((item, _idx) => {
      if(!item) return;
      tdLen += 1;
      let {key, num = true} = item;
      let currText = record[key];
      let result =  (item.key == 'action' && !needAction) ? '-' : this.mapperFilter(item, record, parentIdx);
      if(needCount) {
        let isNumbTxt = (!!currText && currText.replace) ? +(currText.replace(',', '')) : currText;
        if(isNumbTxt && num) {
          this.statistics[key] = (this.statistics[key] || 0) + isNumbTxt;
        }
      }
      return (
        <td
          ref={tdDOM => {
            if(tdDOM && parentIdx == 0) {
              this.firstTDDOMs[_idx] = tdDOM;
            }
          }}
          style={item.w ? {width: item.w, whiteSpace: 'pre-wrap'} : null}
          className={item.className || ''}
          key={parentIdx + '_' + _idx}>
          {result}
        </td>
      );
    });

    this.tdNumb = tdLen;

    return result;
  }

  getStatisticDOM(record) {
    if(this.props.needCount && Object.keys(record).length > 0) return this.getMapperItemsDOM(record, 'statistics', false, false);
  }

  getHeaderWidth() {
    const { headerWidthMapper } = this.state;
    let result = 0;
    const keyMapper = this.getKeyMapper();
    keyMapper.forEach((item, idx) => {
      if(item) result += headerWidthMapper[idx];
    });
    return result;
  }

  recordDescFilter() {
    const {sortField, isDesc} = this.state;
    const {records} = this.props;
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

  render() {
    const {
      needCount = false, height, whenCheckAction
    } = this.props;
    const {
      headerWidthMapper, containerWidth, sortField, isDesc,
      checkedItems
    } = this.state;
    const records = this.recordDescFilter();
    const hasRecord = records.length > 0;
    const keyMapper = this.getKeyMapper();

    const isAllCheck = Object.keys(checkedItems).length == records.length;

    if(!Array.isArray(records)) {
      console.error('records 必须为 []');
      return <span/>;
    }
    this.statistics = {};

    const hasChecked = Object.keys(checkedItems).length != 0;

    const tableHeader = (
      <div className="table-body-scroll" style={{width: containerWidth}}>
        <table className="table nomargin table-header">
          <thead>
            <tr>
              {
                keyMapper.map((item, idx) => {
                  let currHeaderWidth = headerWidthMapper[idx];
                  if(!item) return;
                  let title = item.title || window.$UKE.getKeyMap(item.key);
                  if(item.key == 'checkbox') title = (
                    <input type="checkbox" checked={isAllCheck}
                      onChange={e => this.toggleAllItems(e.target.checked)}/>
                  );
                  let isOrdering = sortField == item.key;
                  let sortTip = isOrdering ? (
                    <span className="caret" style={{
                      transform: `rotate(${!isDesc ? '180deg' : '0deg'})`
                    }}/>
                  ) : null;
                  return (
                    <th 
                      className={`${isOrdering ? ('_order ' + (isDesc ? '_desc ' : '_asc ')) : ''}_btn`}
                      key={title} 
                      onClick={e => this.orderRecord(item.key)}
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

    const tableBody = hasRecord ? (
      <div className="table-body-scroll" style={{height, width: containerWidth}}>
        <table className="table nomargin table-body">
          <tbody>
            {
              records.map((record, _idx) => {
                let {_highlight = ''} = record;
                let idx = _idx;
                return (
                  <tr
                    key={idx}
                    className={_highlight}>
                    {this.getMapperItemsDOM(record, idx, needCount)}
                  </tr>
                );
              })
            }
            {
              this.props.needCount ? (
                <tr className="theme">
                  {this.getStatisticDOM(this.statistics)}
                </tr>
              ) : null
            }
          </tbody>
        </table>
      </div>
    ) : (
      <span className="no-record-tip">
        <Icon type="noData"/>
        <span className="text">暂无记录</span>
      </span>
    );

    return (
      <div className={"table-render" + (hasChecked ? ' has-checked' : '')} ref={tableRenderDOM => {
        if(tableRenderDOM) this.tableRenderDOM = tableRenderDOM;
      }}>
        {
          hasChecked && !!whenCheckAction? (
            <div className="checked-actions">{whenCheckAction}</div>
          ) : null
        }
        {tableHeader}
        {/* {hideTable} */}
        {tableBody}
      </div>
    );
  }
}
