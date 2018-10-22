import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class Pagination extends Component {
  static propTypes = {
    /** 分页的存储数据，可以为不确定的结构，通过 infoMapper 做映射 */
    pagingInfo: PropTypes.object.isRequired,
    /** 由于不确定远端分页数据具体字段，所以有分页数据的字段映射 */
    infoMapper: PropTypes.shape({
      /** 当前第几页 */
      pIdx: PropTypes.string,
      /** 每页多少项 */
      pSize: PropTypes.string,
      /** 一共多少项 */
      total: PropTypes.string,
      /** 是否激活分页 */
      active: PropTypes.string,
    }),
    /** 是否需要辅助分页的按钮 */
    isNeedHelper: PropTypes.bool,
    /** 前面的按钮数量 */
    prevBtnCount: PropTypes.number,
    /** 后面的按钮数量 */
    lastBtnCount: PropTypes.number,
    /** 分页切换时的回调 */
    onPagin: PropTypes.func.isRequired
  };
  static defaultProps = {
    infoMapper: {
      pIdx: 'PageIndex',
      pSize: 'PageSize',
      total: 'AllCount',
      active: 'UsePagin',
    },
    isNeedHelper: true,
    prevBtnCount: 3,
    lastBtnCount: 3,
  }
  infoTranslate(nextPaginInfo) {
    const { pagingInfo, infoMapper } = this.props;
    const { pIdx, pSize, total, active } = infoMapper;

    return nextPaginInfo ? {
      [infoMapper.pIdx]: nextPaginInfo.pIdx,
      [infoMapper.pSize]: nextPaginInfo.pSize,
      [infoMapper.total]: nextPaginInfo.total,
      [infoMapper.active]: nextPaginInfo.active,
    } : {
      pIdx: pagingInfo[pIdx],
      pSize: pagingInfo[pSize],
      total: pagingInfo[total],
      active: pagingInfo[active],
    };
  }
  changePagin(nextIdx, nextSize) {
    const pagingInfo = this.infoTranslate();
    const { onPagin } = this.props;
    const { pIdx, pSize, total } = pagingInfo;
    
    if (nextIdx == pIdx && pSize == nextSize) return;
    if((nextIdx < 0 || nextIdx * pSize > total - 1 || pIdx == nextIdx) && !nextSize) return;

    const nextPagin = Object.assign({}, pagingInfo, {
      pIdx: nextSize ? 0 : +(nextIdx),
      pSize: +(nextSize) || pSize
    });
    
    onPagin(this.infoTranslate(nextPagin));
  }
  render () {
    const {
      isNeedHelper,
      lastBtnCount, prevBtnCount
    } = this.props;
    const pagingInfo = this.infoTranslate();
    const { pIdx, pSize, total, active } = pagingInfo;

    const gm = window.$UKE.getUkeKeyMap;

    const paginBtnCount = Math.ceil(total / pSize);

    const _isNeedHelper = isNeedHelper && paginBtnCount > 1;

    if(total == -1 || total == 0) return <span />;
    if(!active) return (
      <span className="nopaging" />
    );

    const first = (
      <span onClick={e => this.changePagin(0)} className="item"> &lt;&lt; </span>
    );
    const next = (
      <span onClick={e => this.changePagin(pIdx + 1)} className="item"> &gt; </span>
    );
    const last = (
      <span onClick={e => this.changePagin(paginBtnCount - 1)} className="item"> &gt;&gt; </span>
    );
    const prev = (
      <span onClick={e => this.changePagin(pIdx - 1)} className="item"> &lt; </span>
    );
    const jumpInputDOM = (
      <div className="jump-input">
        <span>{gm('共')} {paginBtnCount || 1} {gm('页')}, {gm('跳转到第')}</span>
        <input type="text" className="form-control input-sm ms10 input" onBlur={e => this.changePagin(e.target.value - 1)}/>
        <span>{gm('页')}</span>
      </div>
    );
    const pageCountInputDOM = (
      <div className="mr10 page-size-input">
        <span>{gm('每页')}</span>
        <input type="text" className="form-control input-sm ms10 input"
          defaultValue={pSize}
          onBlur={e => this.changePagin(pIdx, e.target.value)}/>
        <span>{gm('条记录')}</span>
      </div>
    );
    const btnGroup = (
      <div className="btn-group">
        {
          [...Array(prevBtnCount + lastBtnCount + 1)].map((_, idx) => {
            let currIdx = pIdx - prevBtnCount + idx + 1;
            let isActive = currIdx == (pIdx + 1);
            if(currIdx > 0 && currIdx < paginBtnCount + 1) {
              return (
                <span key={idx} className={"item" + (isActive ? ' active' : '')} onClick={e => this.changePagin(currIdx - 1)}>
                  {currIdx}
                </span>
              );
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
    ) : (<span />);
    const lastCon = _isNeedHelper ? (
      <span className="item-group">
        {next}
        {last}
      </span>
    ) : (<span />);
    return (
      <div className="pagin-con has-pagin">
        {firstCon}
        {btnGroup}
        {lastCon}
        <span className="flex" />
        {pageCountInputDOM}
        {jumpInputDOM}
      </div>
    );
  }
}
