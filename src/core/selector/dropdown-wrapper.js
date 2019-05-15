import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import classnames from 'classnames';
import { IsFunc } from 'basic-helper';
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
const calculateOutsidePosition = (options) => {
  const { target, position, children } = options;
  const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = getElementOffsetInfo(target);
  const childrenWidth = children.offsetWidth;
  const childrenHeight = children.offsetHeight;
  let top, left = offsetLeft;
  if(position.indexOf('top') !== -1) {
    top = offsetTop - offsetHeight - childrenHeight + offset;
  } else if(position.indexOf('bottom') !== -1) {
    top = offsetTop + offsetHeight + offset;
  }
  if(position.indexOf('right') !== -1) {
    left = offsetLeft + offsetWidth - childrenWidth;
  }
  // res = { top, left };
  // topAnimation(children, top);
  children.style.left = `${left}px`;
  children.style.top = `${top}px`;
  // setTimeout(() => children.classList.add('done'), 50);
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
    children: PropTypes.func,
    /** 用于渲染最外层的内容 */
    menuWrapper: PropTypes.func,
    /** style */
    style: PropTypes.shape({}),
  }
  static defaultProps = {
    withInput: true,
    menuTitle: 'Title',
    outside: false,
    position: 'bottom,left',
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
    const { outside } = this.props;
    if(outside) {
      // e.preventDefault();
      // const { clientX, clientY } = e;
      if(!this.addScrollListener) document.addEventListener('scroll', this.hide);
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
      document.removeEventListener('scroll', this.hide);
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
  getPropsForChild = () => {
    return {
      ...this.state,
      hide: this.hide,
      showSubMenu: this.showSubMenu,
      focusInput: this.focusInput,
    };
  }
  saveItems = e => {
    this.wrapperChildren = e;
    if(!e) return;
    calculateOutsidePosition({
      children: this.wrapperChildren,
      target: this.displayTitleDOM,
      position: this._position
    });
  }
  childrenFilter = () => {
    const { children, outside, position } = this.props;
    const { isShow } = this.state;
    const isLeft = position.indexOf('left') !== -1;
    const caretOffset = this.displayTitleDOM ? this.displayTitleDOM.offsetWidth / 2 : 10;
    // const dropdownCom = (
    //   <TransitionGroup component={null}>
    //     <CSSTransition
    //       key="opened"
    //       classNames="drop-menu"
    //       timeout={200}>
    //       <div
    //         ref={outside ? e => this.saveItems(e) : null}
    //         className={classnames({
    //           "dropdown-items": true,
    //           [this._position]: !!this._position,
    //           "show": isShow,
    //         })}>
    //         <span className="caret" style={isLeft ? {
    //           left: caretOffset
    //         } : {
    //           right: caretOffset
    //         }} />
    //         {children(this.getPropsForChild())}
    //       </div>
    //     </CSSTransition>
    //   </TransitionGroup>
    // );
    const dropdownCom = (
      <div
        ref={outside ? e => this.saveItems(e) : null}
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
        {children(this.getPropsForChild())}
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
  render() {
    const { isShow, searchValue } = this.state;
    const {
      className, withInput, style, menuTitle, error, menuWrapper, outside
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
            onClick={this.handleClickMenu}>
            {
              IsFunc(menuWrapper) ? menuWrapper(this.getPropsForChild()) : (
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
              )
            }
          </span>
          {this.childrenFilter()}
        </div>
      </ClickAway>
    );
  }
}
