import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import classnames from 'classnames';
import { IsFunc, DebounceClass } from 'basic-helper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Icon } from '../icon';
import ClickAway from '../uke-utils/click-away';
import positionFilter from '../position-filter';
import setDOMById, { getElementOffset, getElementOffsetInfo } from '../set-dom';

const dropdownContainerID = 'DropdownContainer';
const dropdownContainerDOM = setDOMById(dropdownContainerID, 'uke-dropdown-menu outside');

// function easeOut (t, b, c, d) {
//   return -c *(t/=d)*(t-2) + b;
// }
// const topAnimation = (elem, final) => {
//   let offset = 50;
//   let b = final, d = 20, t = 0, c = offset / d;
//   let top = Math.ceil(easeOut(t,b,c,d));
//   elem.style.top = `${top}px`;
//   if(t < d) { t++; setTimeout(() => topAnimation(elem), 10); }
// };
const offset = 10;
const calculateOverlayPosition = (options) => {
  const { target, position, overlayElem } = options;
  const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = getElementOffsetInfo(target);
  const overlayElemWidth = overlayElem.offsetWidth;
  const overlayElemHeight = overlayElem.offsetHeight;
  let top, left = offsetLeft;
  if(position.indexOf('top') !== -1) {
    top = offsetTop - offsetHeight - overlayElemHeight + offset;
  } else if(position.indexOf('bottom') !== -1) {
    top = offsetTop + offsetHeight + offset;
  }
  if(position.indexOf('right') !== -1) {
    left = offsetLeft + offsetWidth - overlayElemWidth;
  }
  // res = { top, left };
  // topAnimation(overlayElem, top);
  overlayElem.style.left = `${left}px`;
  overlayElem.style.top = `${top}px`;
  // setTimeout(() => overlayElem.classList.add('done'), 50);
  return { top, left };
};

export default class DropdownWrapper extends React.PureComponent {
  static propTypes = {
    /** 是否带搜索输入 */
    withInput: PropTypes.bool,
    /** 是否渲染在 react root 之外 */
    outside: PropTypes.bool,
    /** 是否有错误 */
    error: PropTypes.bool,
    /** 弹出的位置，用 , 分隔，最多支持两个不冲突位置，如果冲突，则选择第一个值 */
    position: PropTypes.string,
    /** className */
    className: PropTypes.string,
    /** 外层的 title */
    menuTitle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element,
      PropTypes.node,
    ]),
    /** 接受函数 children，只在 show 的时候渲染 */
    children: PropTypes.oneOfType([
      PropTypes.func, PropTypes.node, PropTypes.element,
      PropTypes.string, PropTypes.number, PropTypes.bool
    ]),
    /** 监听滚动时隐藏的外层元素 */
    scrollElem: PropTypes.func,
    /** 监听滚动时隐藏的外层元素 */
    trigger: PropTypes.oneOf([
      'click', 'hover'
    ]),
    /** 用于渲染最外层的内容, 将要废弃，请使用 overlay */
    // menuWrapper: PropTypes.func,
    /** 用于渲染最外层的内容 */
    overlay: PropTypes.func,
    /** style */
    style: PropTypes.shape({}),
  }
  static defaultProps = {
    withInput: true,
    menuTitle: 'Title',
    trigger: 'click',
    outside: false,
    position: 'bottom,left',
    scrollElem: () => document
  };
  state = {
    isShow: false,
    searchValue: ''
  };
  constructor(props) {
    super(props);

    this._position = positionFilter(props.position);
  }
  handleClickAway = () => {
    if(this.state.isShow) this.hide();
  }
  
  handleClickMenu = e => {
    const { outside, scrollElem } = this.props;
    if(outside) {
      // e.preventDefault();
      // const { clientX, clientY } = e;
      if(!this.addScrollListener) {
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
  showSubMenu(isShow = true) {
    this.setState({
      isShow,
    });
  }
  hide = () => {
    if(this.addScrollListener) {
      const { scrollElem } = this.props;
      scrollElem().removeEventListener('scroll', this.hide);
      this.addScrollListener = false;
    }
    this.setState({
      isShow: false,
      searchValue: ''
    });
  }
  saveInput = _i => {
    if(_i) this._input = _i;
  }
  onSearch = (e) => {
    const val = e.target.value.trim();
    this.setState({
      searchValue: val
    });
  }
  getPropsForOverlay = () => {
    return {
      ...this.state,
      hide: this.hide,
      showSubMenu: this.showSubMenu,
      focusInput: this.focusInput,
    };
  }
  saveItems = e => {
    this.overlayElem = e;
    if(!e) return;
    calculateOverlayPosition({
      overlayElem: this.overlayElem,
      target: this.displayTitleDOM,
      position: this._position
    });
  }
  overlayRender = () => {
    const { overlay, outside, position } = this.props;
    const { isShow } = this.state;
    const isLeft = position.indexOf('left') !== -1;
    const caretOffset = this.displayTitleDOM ? this.displayTitleDOM.offsetWidth / 2 : 10;
    const dropdownCom = (
      <div
        ref={outside ? e => this.saveItems(e) : null}
        {...this.bindTrigger(true)}
        className={classnames({
          "dropdown-items": true,
          [this._position]: !!this._position,
          "show": isShow,
        })}>
        <span className="caret" style={isLeft ? {
          left: caretOffset
        } : {
          right: caretOffset
        }} />
        {overlay(this.getPropsForOverlay())}
      </div>
    );

    return outside ? ReactDOM.createPortal(
      dropdownCom,
      dropdownContainerDOM
    ) : dropdownCom;
  }
  saveClickAway = (e) => {
    this.clickAwayRef = e;
    if(e) {
      this.updateNodeRef = e.updateNodeRef;
    }
  }
  getDfaultChild = (menuTitle) => {
    const {withInput } = this.props;
    const { searchValue } = this.state;
    return (
      <div className="display-menu">
        <div className="display-title">
          {menuTitle}
        </div>
        {
          withInput && (
            <input type="text"
              ref={this.saveInput}
              placeholder={typeof menuTitle === 'string' ? menuTitle : ''}
              value={searchValue}
              className="search-input"
              onChange={this.onSearch}/>
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
    let child, _title = menuTitle;
    switch (true) {
    case IsFunc(children):
      child = children(this.getPropsForOverlay());
      break;
    case React.isValidElement(children):
      child = children;
      break;
    default:
      if(typeof children === 'string') {
        _title = children;
      }
      child = this.getDfaultChild(_title);
      break;
    }
    
    return child;
  }
  bindTrigger = (isHide = false) => {
    const { trigger } = this.props;
    switch (trigger) {
    case 'click':
      return !isHide ? {
        onClick: this.handleClickMenu
      } : {};
    case 'hover':
      return !isHide ? {
        onMouseEnter: this.handleClickMenu,
        onMouseLeave: () => {
          if(!this.delayExec) this.delayExec = new DebounceClass();
          this.delayExec.exec(this.handleClickAway, 200);
        }
      } : {
        onMouseEnter: () => {
          if(this.delayExec) this.delayExec.cancel();
          this.handleClickMenu();
        },
        onMouseLeave: this.handleClickAway
      };
    }
  }
  render() {
    const { isShow } = this.state;
    const {
      className, withInput, style, error, outside
    } = this.props;

    return (
      <ClickAway ref={this.saveClickAway} onClickAway={this.handleClickAway}>
        <div
          className={classnames({
            "uke-dropdown-menu": true,
            [className]: !!className,
            "error": error,
            "input-mode": withInput,
            "show": isShow,
            [this._position]: true,
          })}
          style={style}>
          <span className="menu-wrapper" ref={e => this.displayTitleDOM = e}
            {...this.bindTrigger()}>
            {
              this.childrenRender()
            }
          </span>
          {
            outside ? this.overlayRender() : (
              <TransitionGroup component={null}>
                <CSSTransition
                  key={isShow ? "opened" : "closed"}
                  classNames="drop-menu"
                  timeout={200}>
                  {isShow ? this.overlayRender() : <span />}
                </CSSTransition>
              </TransitionGroup>
            )
          }
        </div>
      </ClickAway>
    );
  }
}
