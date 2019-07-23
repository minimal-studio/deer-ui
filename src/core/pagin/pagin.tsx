import React from 'react';
import ReactDOM from 'react-dom';
import { UkeComponent } from '../uke-utils';
import Selector from '../selector/dropdown-menu';
import { getElementOffset } from '../set-dom';
import { getScreenHeight, getScrollTop } from '../utils';

export type PaginInfo = {
  [key: string]: number | boolean;
} | {
  /** 当前第几页 */
  pIdx: number;
  /** 每页多少项 */
  pSize: number;
  /** 一共多少项 */
  total: number;
  /** 是否激活分页 */
  active: number;
}

export interface PaginationProps {

  /** 分页的存储数据，可以为不确定的结构，通过 infoMapper 做映射 */
  pagingInfo: PaginInfo;
  /** 分页切换时的回调 */
  onPagin: (nextPaginInfo: PaginInfo) => void;
  /** 由于不确定远端分页数据具体字段，所以有分页数据的字段映射 */
  infoMapper?: {
    /** 当前第几页 */
    pIdx: string;
    /** 每页多少项 */
    pSize: string;
    /** 一共多少项 */
    total: string;
    /** 是否激活分页 */
    active: string;
  };
  /** 是否显示全部项 */
  displayTotal?: boolean;
  /** 是否需要辅助分页的按钮 */
  isNeedHelper?: boolean;
  /** 前面的按钮数量 */
  prevBtnCount?: number;
  /** 后面的按钮数量 */
  lastBtnCount?: number;
}

interface DefaultProps {
  infoMapper: {};
  isNeedHelper: boolean;
  displayTotal: boolean;
  prevBtnCount: number;
  lastBtnCount: number;
}

export default class Pagination extends UkeComponent<PaginationProps> {
  static defaultProps: DefaultProps = {
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

  node

  dropdownPosition: string = 'bottom';

  getSelectorOptions = () => {
    const pageListData = [10, 20, 30, 40, 50, 100];
    const pageListMap = {};
    pageListData.forEach((item) => {
      pageListMap[item] = `${item} ${this.$T_UKE('条/页')}`;
    });
    return pageListMap;
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
  }

  componentDidUpdate() {
    if (!this.node) return;
    const { offsetTop } = getElementOffset(this.node);
    if (getScreenHeight() < offsetTop + getScrollTop() + 200) {
      this.dropdownPosition = 'top';
    }
  }

  paginInfoTranslate(nextPaginInfo?: PaginInfo) {
    const { pagingInfo, infoMapper } = this.props as DefaultProps & PaginationProps;
    const {
      pIdx, pSize, total, active
    } = infoMapper;

    return nextPaginInfo ? {
      [pIdx]: +nextPaginInfo.pIdx,
      [pSize]: +nextPaginInfo.pSize,
      [total]: +nextPaginInfo.total,
      [active]: !!nextPaginInfo.active,
    } : {
      pIdx: +pagingInfo[pIdx],
      pSize: +pagingInfo[pSize],
      total: +pagingInfo[total],
      active: !!pagingInfo[active],
    };
  }

  changePagin(nextIdx: number, nextSize?) {
    const pagingInfo = this.paginInfoTranslate();
    const { onPagin } = this.props;
    const { pIdx, pSize = 0, total = 0 } = pagingInfo;

    if (nextIdx === pIdx && pSize === nextSize) return;
    if ((nextIdx < 0 || (nextIdx * pSize) > total - 1 || pIdx === nextIdx) && !nextSize) return;

    const nextPagin = Object.assign({}, pagingInfo, {
      pIdx: nextSize ? 0 : +(nextIdx),
      pSize: +(nextSize) || pSize
    });

    onPagin(this.paginInfoTranslate(nextPagin));
  }

  render() {
    const {
      isNeedHelper, displayTotal,
      lastBtnCount, prevBtnCount
    } = this.props as DefaultProps & PaginationProps;
    const pagingInfo = this.paginInfoTranslate();
    const {
      pIdx = 0, pSize = 0, total = 0, active = true
    } = pagingInfo;

    if (!active) {
      return (
        <span className="nopaging" />
      );
    }

    const { $T_UKE } = this;

    const paginBtnCount = Math.ceil(total / pSize);

    const _isNeedHelper = isNeedHelper && paginBtnCount > 1;

    if (total === -1 || total === 0) return <span />;

    const jumpInputDOM = (
      <div className="jump-input">
        {/* <span>{$T_UKE('共')} {paginBtnCount || 1} {$T_UKE('页')}, {$T_UKE('跳至')}</span> */}
        <span>{$T_UKE('跳至')}</span>
        <input
          type="text"
          className="form-control input-sm ms10 input"
          onBlur={e => this.changePagin(+e.target.value - 1)}/>
        <span>{$T_UKE('页')}</span>
      </div>
    );
    const pageCountInputDOM = (
      <div className="mr10 page-size-input">
        <Selector
          value={pSize}
          isNum
          needAction={false}
          position={this.dropdownPosition}
          onChange={nextVal => this.changePagin(+pIdx, nextVal)}
          values={this.getSelectorOptions()} />
      </div>
    );
    const btnGroup = (
      <div className="pagin-btn-group">
        {
          [...Array(prevBtnCount + lastBtnCount + 1)].map((_, idx) => {
            const currIdx = pIdx - prevBtnCount + idx + 1;
            const isActive = currIdx === (pIdx + 1);
            if (currIdx > 0 && currIdx < paginBtnCount + 1) {
              return (
                <span key={currIdx}
                  className={`item${isActive ? ' active' : ''}`}
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
          displayTotal && <span> {$T_UKE('共')} {total} {$T_UKE('项')}</span>
        }
        <span className="flex" />
        {pageCountInputDOM}
        {jumpInputDOM}
      </div>
    );
  }
}
