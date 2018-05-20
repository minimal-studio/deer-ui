import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import MapperFilter from './mapper-filter';

export default class TableBody extends MapperFilter {
  constructor(props) {
    super(props);
    this._resizeCalcSize = this.resizeCalcSize.bind(this);

    this.state = {
      headerWidthMapper: [],
      containerWidth: 'auto'
    }

    this.firstTDDOMs = {};
    this.tdNumb = 0;
  }

  componentDidUpdate() {
    this.calcSize();
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

  resizeCalcSize() {
    const {containerWidth} = this.state;
    if(containerWidth != 'auto' && containerWidth < this.tableRenderDOM.offsetWidth) {
      this.setState({
        containerWidth: 'auto'
      });
    }
    this.calcSize();
  }

  componentDidMount() {
    window.addEventListener('resize', this._resizeCalcSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeCalcSize);
  }

  getMapperItemsDOM(record, parentIdx, needCount, needAction = true) {
    if(!record) return;
    const {keyMapper} = this.props;
    let tdLen = 0;
    let result = keyMapper.map((item, _idx) => {
      if(!item) return;
      tdLen += 1;
      let {key, num = true} = item;
      let currText = record[key];
      let result =  (item.key == 'action' && !needAction) ? '' : this.mapperFilter(item, record, parentIdx);
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
      )
    });

    this.tdNumb = tdLen;

    return result;
  }

  getStatisticDOM(record) {
    if(this.props.needCount && Object.keys(record).length > 0) return this.getMapperItemsDOM(record, 'statistics', false, false);
  }

  getHeaderWidth() {
    const {headerWidthMapper} = this.state;
    let result = 0;
    this.props.keyMapper.forEach((item, idx) => {
      if(item) result += headerWidthMapper[idx];
    });
    return result;
  }

  render() {
    const {keyMapper, records, needCount = false, allCheck, height} = this.props;
    const {headerWidthMapper, containerWidth} = this.state;
    const hasRecord = records.length > 0;

    if(!Array.isArray(records)) {
      console.error('records 必须为 []');
      return <span></span>
    }
    this.statistics = {};

    const tableHeader = (
      <div className="table-body-scroll" style={{width: containerWidth}}>
        <table className="table nomargin table-header">
          <thead>
            <tr>
              {
                keyMapper.map((item, idx) => {
                  let currHeaderWidth = headerWidthMapper[idx];
                  if(!item) return;
                  let title = item.title || $UK.getKeyMap(item.key);
                  if(item.key == 'checkbox') title = (
                    <input type="checkbox" checked={allCheck}
                      onChange={e => $GH.CallFunc(this.props.onCheckAll)(e.target.checked)}/>
                  );
                  return (
                    <th key={idx} style={{
                      width: currHeaderWidth
                    }}>{title}</th>
                  )
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
                )
              })
            }
            {this.props.needCount ? <tr className="theme">
              {this.getStatisticDOM(this.statistics)}
            </tr> : null}
          </tbody>
        </table>
      </div>
    ) : (
      <span className="no-record-tip">暂无记录</span>
    );

    return (
      <div className="table-render" ref={tableRenderDOM => {
        if(tableRenderDOM) this.tableRenderDOM = tableRenderDOM;
      }}>
        {tableHeader}
        {/* {hideTable} */}
        {tableBody}
      </div>
    );
  }
}
TableBody.propTypes = {
  keyMapper: PropTypes.array.isRequired,
  needCount: PropTypes.bool,
  allCheck: PropTypes.bool,
  onCheckAll: PropTypes.func,
  records: PropTypes.array.isRequired
};
