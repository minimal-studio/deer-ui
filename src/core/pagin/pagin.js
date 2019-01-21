import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { UkeComponent, UkePureComponent } from '../uke-utils';
import Selector from '../selector/dropdown-menu';
import { getElementOffset } from '../set-dom';
import { getScreenWidth, getScreenHeight, getScrollTop } from '../utils';

const pageListData = [10, 20, 30, 40, 50];
let pageListMap = {};
pageListData.forEach(item => pageListMap[item] = `${item} 条/页`);

export default class Pagination extends UkeComponent {
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
    /** 是否显示全部项 */
    displayTotal: PropTypes.bool,
    /** 是否需要辅助分页的按钮 */
    isNeedHelper: PropTypes.bool,
    /** 前面的按钮数量 */
    prevBtnCount: PropTypes.number,
    /** 后面的按钮数量 */
    lastBtnCount: PropTypes.number,
    /** 分页切换时的回调 */
    onPagin: PropTypes.func.isRequired
  };
  dropdownPosition = 'bottom';
  static defaultProps = {
    infoMapper: {
      pIdx: 'PageIndex',
      pSize: 'PageSize',
      total: 'AllCount',
      active: 'UsePaging',
    },
    isNeedHelper: true,
    displayTotal: true,
    prevBtnCount: 3,
    lastBtnCount: 3,
  }
  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
  }
  componentDidUpdate() {
    if(!this.node) return;
    const { offsetTop } = getElementOffset(this.node);
    if(getScreenHeight() < offsetTop + getScrollTop() + 200) {
      this.dropdownPosition = 'top';
    }
  }
  infoTranslate(nextPaginInfo) {
    const { pagingInfo, infoMapper } = this.props;
    const { pIdx, pSize, total, active } = infoMapper;

    return nextPaginInfo ? {
      [pIdx]: nextPaginInfo.pIdx,
      [pSize]: nextPaginInfo.pSize,
      [total]: nextPaginInfo.total,
      [active]: nextPaginInfo.active,
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
      isNeedHelper, displayTotal,
      lastBtnCount, prevBtnCount
    } = this.props;
    const pagingInfo = this.infoTranslate();
    const { pIdx, pSize, total, active } = pagingInfo;

    if(!active) return (
      <span className="nopaging" />
    );

    const gm = this.gm;

    const paginBtnCount = Math.ceil(total / pSize);

    const _isNeedHelper = isNeedHelper && paginBtnCount > 1;

    if(total == -1 || total == 0) return <span />;

    const jumpInputDOM = (
      <div className="jump-input">
        {/* <span>{gm('共')} {paginBtnCount || 1} {gm('页')}, {gm('跳至')}</span> */}
        <span>{gm('跳至')}</span>
        <input
          type="text"
          className="form-control input-sm ms10 input"
          onBlur={e => this.changePagin(e.target.value - 1)}/>
        <span>{gm('页')}</span>
      </div>
    );
    const pageCountInputDOM = (
      <div className="mr10 page-size-input">
        <Selector
          defaultValue={10}
          isNum
          needAction={false}
          position={this.dropdownPosition}
          onChange={nextVal => this.changePagin(pIdx, nextVal)}
          values={pageListMap} />
        {/* <span>{gm('每页')}</span>
        <input type="text" className="form-control input-sm ms10 input"
          defaultValue={pSize}
          onBlur={e => this.changePagin(pIdx, e.target.value)}/>
        <span>{gm('条')}</span> */}
      </div>
    );
    const btnGroup = (
      <div className="pagin-btn-group">
        {
          [...Array(prevBtnCount + lastBtnCount + 1)].map((_, idx) => {
            let currIdx = pIdx - prevBtnCount + idx + 1;
            let isActive = currIdx == (pIdx + 1);
            if(currIdx > 0 && currIdx < paginBtnCount + 1) {
              return (
                <span key={currIdx}
                  className={"item" + (isActive ? ' active' : '')}
                  onClick={e => this.changePagin(currIdx - 1)}>
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
        <span onClick={e => this.changePagin(0)} className="item"> &lt;&lt; </span>
        <span onClick={e => this.changePagin(pIdx - 1)} className="item"> &lt; </span>
      </span>
    ) : null;
    const lastCon = _isNeedHelper ? (
      <span className="item-group">
        <span onClick={e => this.changePagin(pIdx + 1)} className="item"> &gt; </span>
        <span onClick={e => this.changePagin(paginBtnCount - 1)} className="item"> &gt;&gt; </span>
      </span>
    ) : null;
    return (
      <div className="pagin-con has-pagin">
        <div className="layout btns-wrap">
          {firstCon}
          {btnGroup}
          {lastCon}
        </div>
        {
          displayTotal && <span> {gm('共')} {total} {gm('项')}</span>
        }
        <span className="flex" />
        {pageCountInputDOM}
        {jumpInputDOM}
      </div>
    );
  }
}
