import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

const prevBtnCount = 3;
const lastBtnCount = 3;

export default class PagingBtn extends Component {
  changePagin(pIdx, pSize) {
    const {pagingInfo, onPagin} = this.props;
    const {PageIndex, PageSize, AllCount} = pagingInfo;
    if (pIdx == PageIndex && PageSize == pSize) return
    if((pIdx < 0 || pIdx * PageSize > AllCount - 1 || PageIndex == pIdx) && !pSize) return;
    let nextPagin = Object.assign({}, pagingInfo, {
      PageIndex: pSize ? 0 : +(pIdx),
      PageSize: +(pSize) || PageSize
    });
    onPagin(nextPagin);
  }
  render () {
    const {isNeedHelper = true, pagingInfo, onPagin} = this.props;
    const {AllCount, UsePaging, PageIndex, PageSize} = pagingInfo;

    const paginBtnCount = Math.ceil(AllCount / PageSize);
    const paginCount = 5;

    const _isNeedHelper = isNeedHelper && paginBtnCount > 1;

    if(AllCount == -1 || AllCount == 0) return <span></span>
    // if(AllCount == -1 || AllCount == 0) return (
    //   <div className="pagin-con text-light text-center">{AllCount == -1 ? '请查询' : '暂无记录'}</div>
    // );
    if(UsePaging == 0) return (
      <span className="nopaging"></span>
    );

    const first = (
      <span onClick={e => this.changePagin(0)} className="item"> &lt;&lt; </span>
    )
    const next = (
      <span onClick={e => this.changePagin(PageIndex + 1)} className="item"> &gt; </span>
    )
    const last = (
      <span onClick={e => this.changePagin(paginBtnCount - 1)} className="item"> &gt;&gt; </span>
    )
    const prev = (
      <span onClick={e => this.changePagin(PageIndex - 1)} className="item"> &lt; </span>
    )
    const jumpInputDOM = (
      <div className="jump-input">
        <span>共 {paginBtnCount || 1} 页, 跳转到第</span>
        <input type="text" className="form-control input-sm ms10 input" onBlur={e => this.changePagin(e.target.value - 1)}/>
        <span>页</span>
      </div>
    )
    const pageCountInputDOM = (
      <div className="mr10 page-size-input">
        <span>每页</span>
        <input type="text" className="form-control input-sm ms10 input"
          defaultValue={PageSize}
          onBlur={e => this.changePagin(PageIndex, e.target.value)}/>
        <span>条记录</span>
      </div>
    )
    const btnGroup = (
      <div className="btn-group">
        {
          [...Array(prevBtnCount + lastBtnCount + 1)].map((_, idx) => {
            let currIdx = PageIndex - prevBtnCount + idx + 1;
            let isActive = currIdx == (PageIndex + 1);
            if(currIdx > 0 && currIdx < paginBtnCount + 1) {
              return (
                <span key={idx} className={"item" + (isActive ? ' active' : '')} onClick={e => this.changePagin(currIdx - 1)}>
                  {currIdx}
                </span>
              )
            }
          })
        }
      </div>
    );
    const firstCon = _isNeedHelper ? (
      <span className="item-group">
        {first}
        {prev}
      </span>
    ) : (<span></span>);
    const lastCon = _isNeedHelper ? (
      <span className="item-group">
        {next}
        {last}
      </span>
    ) : (<span></span>);
    return (
      <div className="pagin-con has-pagin">
        {firstCon}
        {btnGroup}
        {lastCon}
        <span className="flex"></span>
        {pageCountInputDOM}
        {jumpInputDOM}
      </div>
    )
  }
}

PagingBtn.propTypes = {
  pagingInfo: PropTypes.object.isRequired,
  isNeedHelper: PropTypes.bool,
  onPagin: PropTypes.func.isRequired
};
