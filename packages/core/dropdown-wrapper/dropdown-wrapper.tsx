import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { IsFunc, DebounceClass } from '@mini-code/base-func';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Children, FuncChildren } from '../utils/props';
import { getElementOffsetInfo } from '../utils/get-elem-offset';
import {
  getLeft, getRight, getTop, getBottom, PositionReturn,
} from '../utils/position';
import positionFilter from '../utils/position-filter';
import setDOMById from '../utils/set-dom';

import { Icon } from '../icon';
import { ClickAway } from '../click-away';
import { queryIsMobile } from '../utils';

interface State {
  isShow: boolean;
  ready: boolean;
  outsideReady: boolean;
  searchValue: string;
}

interface FuncChildrenParams extends State {
  /** 关闭 Dropdown */
  hide: () => void;
  /** showSubMenu */
  showSubMenu: () => void;
  /** focusInput */
  focusInput: () => void;
}

export interface DropdownWrapperProps {
  /** 是否带搜索输入 */
  withInput?: boolean;
  /** 是否渲染在 react root 之外 */
  outside?: boolean;
  /** 是否有错误 */
  error?: boolean;
  /** 弹出的位置，用 , 分隔，最多支持两个不冲突位置，如果冲突，则选择第一个值 */
  position?: string;
  /** className */
  className?: HTMLElement['className'];
  /** 外层的 title */
  menuTitle?: string | number | Children;
  /** 接受函数 children，只在 show 的时候渲染 */
  children?: Children | FuncChildren;
  /** 监听滚动时隐藏的外层元素 */
  scrollElem?: () => HTMLElement;
  /** 父容器的 scrollX 偏移值 */
  scrollX?: number;
  /** 父容器的 scrollY 偏移值 */
  scrollY?: number;
  /** 监听滚动时隐藏的外层元素 */
  trigger?: 'click' | 'hover';
  /** 用于渲染最外层的内容 */
  overlay?: (helper: FuncChildrenParams) => Children;
  /** style */
  style?: HTMLElement['style'];
}

const dropdownContainerID = 'DropdownContainer';
let dropdownContainerDOM: HTMLElement;

const calculateOverlayPosition = (options) => {
  const {
    target, position, overlayElem, scrollX, scrollY
  } = options;
  const {
    offsetTop, offsetLeft, offsetWidth, offsetHeight
  } = getElementOffsetInfo(target);
  const overlayElemWidth = overlayElem.offsetWidth;
  const overlayElemHeight = overlayElem.offsetHeight;
  const offsetInfo = {
    offsetWidth,
    offsetHeight,
    elemHeight: overlayElemHeight,
    elemWidth: overlayElemWidth,
    offsetLeft,
    offsetTop
  };
  let posiInfo!: PositionReturn;
  const _position: string[] = [];
  // const left = getLeft(offsetInfo);
  if (position.indexOf('top') !== -1) {
    posiInfo = getTop(offsetInfo);
  } else if (position.indexOf('bottom') !== -1) {
    posiInfo = getBottom(offsetInfo);
  }
  if (position.indexOf('right') !== -1) {
    posiInfo.left = offsetLeft + offsetWidth - overlayElemWidth;
    _position.push('right');
  } else {
    _position.push('left');
  }
  _position.push(posiInfo.position);
  // overlayElem.classList.add(position);
  // console.log(overlayElem.classList)
  _position.forEach((p) => {
    overlayElem.classList.add(p);
  });
  // res = { top, left };
  // topAnimation(overlayElem, top);
  overlayElem.style.left = `${posiInfo.left - scrollX}px`;
  overlayElem.style.top = `${posiInfo.top - scrollY}px`;
  // setTimeout(() => overlayElem.classList.add('done'), 50);
  // return { top, left };
  return posiInfo;
};

export class DropdownWrapper extends React.PureComponent<DropdownWrapperProps, State> {
  static defaultProps = {
    menuTitle: 'Title',
    trigger: 'click',
    scrollX: 0,
    scrollY: 0,
    position: 'bottom,left',
    scrollElem: () => document
  };

  state = {
    isShow: false,
    ready: false,
    outsideReady: !!dropdownContainerDOM,
    searchValue: ''
  };

  _position

  _input

  // 记录是否已经渲染过一次 overlay
  _shown = false

  overlayElem

  displayTitleDOM

  delayExec

  hideDebounce

  addScrollListener

  clickAwayRef: any;

  updateNodeRef: any;

  _withInput

  _outside

  isMobile

  // constructor(props) {
  //   super(props);

  //   const { withInput, position, outside } = props;

  // }

  componentDidMount() {
    const { withInput, position, outside } = this.props;
    const isMobile = queryIsMobile();

    this.isMobile = isMobile;
    this._withInput = typeof withInput == 'undefined' ? !isMobile : withInput;
    this._outside = typeof outside == 'undefined' ? isMobile : outside;
    this._position = positionFilter(position).split(' ');

    this.setState({
      ready: true,
    });
  }

  handleClickAway = () => {
    if (this.state.isShow) this.hide();
  }

  handleClickMenu = (e, preventDefault = false) => {
    const { scrollElem } = this.props;
    if (this._outside) {
      if (preventDefault) e.preventDefault();
      // const { clientX, clientY } = e;
      if (!this.addScrollListener && scrollElem) {
        const _scrollElem = scrollElem();
        _scrollElem.addEventListener('scroll', this.hide);
      }
      this.addScrollListener = true;
    }
    this.showSubMenu();
    this.focusInput();
  }

  focusInput() {
    this._input && this._input.focus();
  }

  /**
   * 为了兼容 SSR 渲染，以及更新 state 触发动画效果
   */
  setOutSideContainer = () => {
    if (this._outside && !this.state.outsideReady) {
      if (!dropdownContainerDOM) {
        dropdownContainerDOM = setDOMById(dropdownContainerID, '__dropdown-menu outside');
      }
      this.overlayRender();
      this.setState({
        outsideReady: true
      });
    }
  }

  showSubMenu = (isShow = true) => {
    this.setState({
      isShow: !!isShow,
    });
  }

  hide = () => {
    const { scrollElem } = this.props;
    if (this.addScrollListener && scrollElem) {
      const elem = scrollElem();
      elem.removeEventListener('scroll', this.hide);
      this.addScrollListener = false;
    }
    /** 一定隐藏成功 */
    if (!this.hideDebounce) this.hideDebounce = new DebounceClass();
    this.hideDebounce.exec(this._hide, 50);
  }

  _hide = () => {
    this.setState({
      isShow: false,
      searchValue: ''
    });
  }

  saveInput = (_i) => {
    if (_i) this._input = _i;
  }

  onSearch = (e) => {
    const val = e.target.value.trim();
    this.setState({
      searchValue: val
    });
  }

  getPropsForOverlay = () => ({
    ...this.state,
    hide: this.hide,
    showSubMenu: this.showSubMenu,
    focusInput: this.focusInput,
  })

  saveItems = (e) => {
    this.overlayElem = e;
    if (!e) return;
    const { scrollX, scrollY } = this.props;
    calculateOverlayPosition({
      overlayElem: this.overlayElem,
      target: this.displayTitleDOM,
      position: this._position,
      scrollX,
      scrollY
    });
  }

  getOverlayDOM = () => {
    const { overlay } = this.props;
    const { isShow } = this.state;
    if (this.isMobile && dropdownContainerDOM) {
      dropdownContainerDOM.classList.toggle('show', isShow);
    }

    // const isLeft = position.indexOf('left') !== -1;
    // const caretOffset = this.displayTitleDOM ? this.displayTitleDOM.offsetWidth / 2 : 10;
    const overlayClasses = classnames(
      "dropdown-items",
      !this._outside && this._position,
      isShow && 'show'
    );
    const transitionKey = isShow ? "opened" : "closed";
    const dropdownCom = (
      <TransitionGroup component={null}>
        <CSSTransition
          key={transitionKey}
          classNames="drop-menu"
          timeout={200}
        >
          {isShow ? (
            <div
              ref={this._outside ? (e) => this.saveItems(e) : null}
              {...this.bindOverlayTrigger()}
              className={overlayClasses}
            >
              <span className="caret" />
              {overlay && overlay(this.getPropsForOverlay())}
            </div>
          ) : <span />}
        </CSSTransition>
      </TransitionGroup>
    );
    return dropdownCom;
  }

  overlayRender = () => {
    return this._outside ? (dropdownContainerDOM && ReactDOM.createPortal(
      this.getOverlayDOM(),
      dropdownContainerDOM,
    )) : this.getOverlayDOM();
  }

  saveClickAway = (e) => {
    this.clickAwayRef = e;
    if (e) {
      this.updateNodeRef = e.updateNodeRef;
    }
  }

  getDefaultChild = (menuTitle) => {
    const { searchValue } = this.state;
    return (
      <div className="display-menu">
        <div className="display-title">
          {menuTitle}
        </div>
        {
          this._withInput && (
            <input type="text"
              ref={this.saveInput}
              placeholder={typeof menuTitle === 'string' ? menuTitle : ''}
              value={searchValue}
              className="search-input"
              onChange={this.onSearch}
            />
          )
        }
        <div className="icon-wrap">
          <Icon n="angle-down" />
        </div>
      </div>
    );
  }

  childrenRender = () => {
    const { children, menuTitle } = this.props;
    let child;
    let _title = menuTitle;
    switch (true) {
      case typeof children === 'function':
        child = children(this.getPropsForOverlay());
        break;
      case React.isValidElement(children):
        child = children;
        break;
      default:
        if (typeof children === 'string') {
          _title = children;
        }
        child = this.getDefaultChild(_title);
        break;
    }

    return React.cloneElement(child, {
      onMouseEnter: this.setOutSideContainer
    });
  }

  handleMouseEnter = (event) => {
    if (this.delayExec) this.delayExec.cancel();
    this.handleClickMenu(event);
  }

  handleMouseLeave = () => {
    if (!this.delayExec) this.delayExec = new DebounceClass();
    this.delayExec.exec(this.handleClickAway, 200);
  }

  bindOverlayTrigger = () => {
    const { trigger } = this.props;
    let res = {};
    switch (trigger) {
      case 'click':
        if (this._outside) {
          res = {
            onClick: (e) => this.handleClickMenu(e, true)
          };
        }
        break;
      case 'hover':
        res = {
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave
        };
        break;
    }
    return res;
  }

  bindWrapperTrigger = () => {
    const { trigger } = this.props;
    let res = {};
    switch (trigger) {
      case 'click':
        res = {
          onClick: this.handleClickMenu
        };
        break;
      case 'hover':
        res = {
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave
        };
        break;
    }
    return res;
  }

  render() {
    const { isShow } = this.state;
    const {
      className, style, error
    } = this.props;

    const classNames = classnames(
      "__dropdown-menu",
      className && className,
      this._withInput && "input-mode",
      error && 'error',
      isShow && 'show',
      !this._outside && this._position
    );

    return (
      <ClickAway ref={this.saveClickAway} onClickAway={this.handleClickAway}>
        <div
          className={classNames}
          style={style}
        >
          <div className="menu-wrapper" ref={(e) => { this.displayTitleDOM = e; }}
            {...this.bindWrapperTrigger()}
          >
            {
              this.childrenRender()
            }
          </div>
          {this.overlayRender()}
        </div>
      </ClickAway>
    );
  }
}
