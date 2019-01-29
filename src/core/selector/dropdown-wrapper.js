import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import classnames from 'classnames';
import { IsFunc } from 'basic-helper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Icon } from '../icon';
import ClickAway from '../uke-utils/click-away';
import positionFilter from '../position-filter';
import setDOMById, { getElementOffset } from '../set-dom';

const dropdownContainerID = 'DropdownContainer';
const dropdownContainerDOM = setDOMById(dropdownContainerID, 'uke-dropdown-menu');

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
      e.preventDefault();
      // console.log(e.pageX)
      const { clientX, clientY } = e;
      const { offsetTop, offsetLeft } = getElementOffset(e.target);
      this.containerOffset = {
        offsetTop: offsetTop + e.target.offsetHeight + 10,
        offsetLeft: clientX - 30
        // offsetTop: clientX + 10,
        // offsetLeft: clientY
      };
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
    this.setState({
      isShow: false,
      searchValue: ''
    });
    if(this.addScrollListener) {
      document.removeEventListener('scroll', this.hide);
      this.addScrollListener = false;
    }
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
  childrenFilter = () => {
    const { children, outside, position } = this.props;
    const { isShow } = this.state;
    const isLeft = position.indexOf('left') !== -1;
    const caretOffset = this.displayTitleDOM ? this.displayTitleDOM.offsetWidth / 2 : 10;
    const dropdownCom = (
      <TransitionGroup component={null}>
        <CSSTransition
          key={isShow ? 'opened' : 'none'}
          classNames="drop-menu"
          timeout={200}>
          {
            isShow ? (
              <div className={
                "dropdown-items " + 
                this._position
              } style={outside ? {
                top: this.containerOffset.offsetTop,
                left: this.containerOffset.offsetLeft,
                position: 'fixed'
              } : {}}>
                <span className="caret" style={isLeft ? {
                  left: caretOffset
                } : {
                  right: caretOffset
                }} />
                {children(this.getPropsForChild())}
              </div>
            ) : <span />
          }
        </CSSTransition>
      </TransitionGroup>
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
      className, withInput, style, menuTitle, error, menuWrapper
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
                    withInput ? (
                      <input type="text"
                        ref={this.saveInput}
                        placeholder={typeof menuTitle === 'string' ? menuTitle : ''}
                        value={searchValue}
                        className="search-input"
                        onChange={this.onSearch}/>
                    ) : null
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
