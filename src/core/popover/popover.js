import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { getElementOffset } from '../set-dom';

const ESC_KEY = 27;

function getPosition(elem) {
  var offsetLeft = elem.offsetLeft;
  if (elem.offsetParent != null) {
    offsetLeft += getPosition(elem.offsetParent).offsetLeft;
  }
  var offsetTop = elem.offsetTop;
  if (elem.offsetParent != null) {
    offsetTop += getPosition(elem.offsetParent).offsetTop;
  }
  return {
    offsetTop: offsetTop,
    offsetLeft: offsetLeft
  };
}

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
  constructor(props) {
    super(props);

    this.state = {
      popoverOffset: {
        width: 0,
        height: 0
      },
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
    this.setPopoverOffset();
  }
  setPopoverOffset() {
    if(!this.popoverDOM) return;
    const { offsetHeight, offsetWidth } = this.popoverDOM;
    this.setState({
      popoverOffset: {
        width: offsetWidth,
        height: offsetHeight
      }
    });
  }
  componentDidUpdate(prevProps, prevState) {
    this.setContentFocus();
    const popover = this.popoverDOM || {};
    const { offsetWidth, offsetHeight } = popover;
    if(prevState.childrenChange) {
      this.__isMounted && this.setState({
        popoverOffset: {
          width: offsetWidth,
          height: offsetHeight
        },
        childrenChange: false
      });
    }
  }
  calaStyle(position, popoverScale) {
    const { relativeElem } = this.props;
    const { offsetWidth = 0, offsetHeight = 0 } = relativeElem;
    const { offsetTop = 0, offsetLeft = 0 } = getElementOffset(relativeElem) || {};
    // const { popoverOffset } = this.state;
    // const popOffsetHeight = popoverOffset.height;
    // const popOffsetWidth = popoverOffset.width;
    const { height, width } = popoverScale;
    let sideOffsetTop = -10;
    let positionStyle = {};

    switch (position) {
    case 'left':
      positionStyle = {
        top: offsetTop + sideOffsetTop,
        left: offsetLeft - width - 12
      };
      break;
    case 'bottom':
      positionStyle = {
        top: offsetTop + offsetHeight + offsetHeight / 2,
        left: offsetLeft - width / 2
      };
      break;
    case 'top':
      positionStyle = {
        top: offsetTop - height - offsetHeight / 2,
        left: offsetLeft - width / 2
      };
      break;
    case 'right':
      positionStyle = {
        top: offsetTop + sideOffsetTop,
        left: offsetLeft + offsetWidth + 15
      };
      break;
    }
    return positionStyle;
  }
  setSelfPosition(elem) {
    if(!elem) return;
    const { position } = this.props;
    this.popoverDOM = elem;
    const popoverScale = {
      width: elem.offsetWidth,
      height: elem.offsetHeight,
    };
    const positionStyle = this.calaStyle(position, popoverScale);
    elem.style.top = positionStyle.top + 'px';
    elem.style.left = positionStyle.left + 'px';
  }
  render() {
    const {
      open, children, relativeElem, position,
      className = '', onClose, fixed, type, style,
      showCloseBtn, enableTabIndex
    } = this.props;
    if(!relativeElem) return <span />;

    let container = (<span />);
    const transitionKey = open ? 'popover' : 'popover-close';
    if(open) {
      const closeBtn = showCloseBtn ? (
        <div className="close-btn" onClick={e => onClose()}>x</div>
      ) : null;
      let obj = enableTabIndex ? {tabIndex: '-1', onKeyDown: this.handleKeyDown} : {};
      container = (
        <div {...obj}
          className={`uke-popover ${fixed ? 'fixed' : ''} ${position} ${className} ${type}`}
          style={style}
          ref={e => {
            this.setSelfPosition(e);
          }}>
          {closeBtn}
          {/* <span className="caret"></span> */}
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
