import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { getElementOffset } from '../set-dom';
import { getLeft, getRight, getTop, getBottom } from '../uke-utils/position';

const ESC_KEY = 27;

function getChildrenKeys(children) {
  if(!children) return [];
  let _children = Array.isArray(children) ? children : [children];
  let childrenKeys = _children.map(item => item.key);
  return childrenKeys;
}

export default class Popover extends Component {
  static propTypes = {
    /** 是否激活 */
    open: PropTypes.bool.isRequired,
    /** 关闭的回调，之前是 RequestClose */
    onClose: PropTypes.func.isRequired,
    /** 相对的元素，传入 document node */
    relativeElem: PropTypes.object,
    /** 弹出的位置 */
    position: PropTypes.oneOf([
      'top',
      'right',
      'left',
      'bottom',
    ]),
    /** 内容 */
    children: PropTypes.any,
    /** class name */
    className: PropTypes.string,
    /** 弹出框的颜色类型 */
    type: PropTypes.oneOf([
      'black',
      'white',
      'theme',
      'blue',
      'red',
      'green',
      'gold',
    ]),
    /** 是否显示关闭按钮 */
    showCloseBtn: PropTypes.bool,
    /** 是否 fixed 定位 */
    fixed: PropTypes.bool,
    /** 是否 update 组件 */
    update: PropTypes.bool,
    /** 外层的 style */
    style: PropTypes.object,
    /** 是否支持快捷键 Esc 关闭 */
    enableTabIndex: PropTypes.bool,
  };
  static defaultProps = {
    position: 'right',
    type: 'white',
    showCloseBtn: true,
    enableTabIndex: true,
  };
  static getDerivedStateFromProps(nextProps, {prevProps}) {
    let hasChangeChildren = JSON.stringify(getChildrenKeys(nextProps.children)) !== JSON.stringify(getChildrenKeys(prevProps.children));
    if(hasChangeChildren) {
      return {
        childrenChange: true,
        prevProps: nextProps
      };
    }
    return null;
  }
  readPosition = '';
  constructor(props) {
    super(props);

    this.state = {
      // popoverOffset: {
      //   width: 0,
      //   height: 0
      // },
      positionStyle: {},
      prevProps: props,
      childrenChange: false
    };
  }
  shouldComponentUpdate(nextProps) {
    let shouldUpdate = typeof nextProps.update === 'undefined' ? true : nextProps.update;
    return shouldUpdate;
  }
  handleKeyDown = (event) => {
    if (event.keyCode === ESC_KEY) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onClose(event);
    }
  }
  setContentFocus = () => {
    this.popoverDOM && this.popoverDOM.focus && this.popoverDOM.focus();
  }
  componentDidMount() {
    this.setContentFocus();
    // this.setPopoverOffset();
  }
  // setPopoverOffset() {
  //   if(!this.popoverDOM) return;
  //   const { offsetHeight, offsetWidth } = this.popoverDOM;
  //   this.setState({
  //     popoverOffset: {
  //       width: offsetWidth,
  //       height: offsetHeight
  //     }
  //   });
  // }
  componentDidUpdate(prevProps, prevState) {
    this.setContentFocus();
    // const popover = this.popoverDOM || {};
    // const { offsetWidth, offsetHeight } = popover;
    if(prevState.childrenChange) {
      this.__isMounted && this.setState({
        // popoverOffset: {
        //   width: offsetWidth,
        //   height: offsetHeight
        // },
        childrenChange: false
      });
    }
  }
  getRelativeElemOffset() {
    const { relativeElem } = this.props;
    const { offsetWidth = 0, offsetHeight = 0 } = relativeElem;
    const { offsetTop = 0, offsetLeft = 0 } = getElementOffset(relativeElem) || {};
    return {
      offsetWidth, offsetHeight, offsetTop, offsetLeft
    };
  }
  calaStyle(position, popoverScale) {
    const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = this.getRelativeElemOffset();
    const { height, width } = popoverScale;

    let positionStyle = {};
    const args = [offsetTop, offsetLeft, offsetWidth, offsetHeight, width, height];

    switch (position) {
    case 'left':
      positionStyle = getLeft(...args);
      break;
    case 'bottom': 
      positionStyle = getBottom(...args);
      break;
    case 'top':
      positionStyle = getTop(...args);
      break;
    case 'right':
      positionStyle = getRight(...args);
      break;
    }
    return positionStyle;
  }
  setSelfPosition = (elem) => {
    if(!elem) return;
    const { position } = this.props;
    this.popoverDOM = elem;
    const popoverScale = {
      width: elem.offsetWidth,
      height: elem.offsetHeight,
    };
    const nextPositionStyle = this.calaStyle(position, popoverScale);
    const { positionStyle } = this.state;
    if(JSON.stringify(nextPositionStyle) !== JSON.stringify(positionStyle)) {
      this.setState({
        positionStyle: nextPositionStyle
      });
    }
    // elem.style.top = positionStyle.top + 'px';
    // elem.style.left = positionStyle.left + 'px';
    // this.readPosition = positionStyle.position;
  }
  render() {
    const {
      open, children, relativeElem,
      className = '', onClose, fixed, type, style,
      showCloseBtn, enableTabIndex
    } = this.props;
    if(!relativeElem) return <span />;
    const { positionStyle } = this.state;
    const { top, left, position } = positionStyle;
    const _style = Object.assign({}, style, {
      top: top,
      left: left,
    });

    let container = (<span />);
    const transitionKey = open ? 'popover' : 'popover-close';
    if(open) {
      const closeBtn = showCloseBtn && (
        <div className="close-btn" onClick={e => onClose()}>x</div>
      );
      let obj = enableTabIndex ? {tabIndex: '-1', onKeyDown: this.handleKeyDown} : {};
      container = (
        <div {...obj}
          className={`uke-popover ${fixed ? 'fixed' : ''} ${position} ${className} ${type}`}
          style={_style}
          ref={e => this.setSelfPosition(e)}>
          {closeBtn}
          <span className="caret" />
          {children}
        </div>
      );
    }
    return (
      <TransitionGroup>
        <CSSTransition
          key={transitionKey}
          classNames="popover"
          timeout={200}>
          {container}
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
