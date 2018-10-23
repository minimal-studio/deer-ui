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
  };
  static defaultProps = {
    position: 'right',
    type: 'white',
    showCloseBtn: true
  }
  constructor(props) {
    super(props);
    this.state = {
      popoverOffset: {
        width: 0,
        height: 0
      }
    };
  }
  shouldComponentUpdate(nextProps) {
    let shouldUpdate = typeof nextProps.update === 'undefined' ? true : nextProps.update;
    return shouldUpdate;
  }
  getPopoverDOM(e) {
    this.popoverDOM = e;
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
  }
  componentDidUpdate() {
    this.setContentFocus();
    const popover = this.popoverDOM || {};
    if(this.state.popoverOffset.width === 0 && !!popover.offsetWidth && popover.offsetWidth > 0 || !!popover.offsetWidth && popover.offsetWidth !== this.state.popoverOffset.width) {
      this.setState({
        popoverOffset: {
          width: popover.offsetWidth,
          height: popover.offsetHeight
        }
      });
    }
  }
  calaStyle(position) {
    const { relativeElem } = this.props;
    const { offsetWidth = 0, offsetHeight = 0 } = relativeElem;
    const { offsetTop = 0, offsetLeft = 0 } = getElementOffset(relativeElem) || {};
    const { popoverOffset } = this.state;
    const popOffsetHeight = popoverOffset.height;
    const popOffsetWidth = popoverOffset.width;
    let sideOffsetTop = -10;
    let positionStyle = {};

    switch (position) {
    case 'left':
      positionStyle = {top: offsetTop + sideOffsetTop, left: offsetLeft - popOffsetWidth - 12};
      break;
    case 'bottom':
      positionStyle = {top: offsetTop + offsetHeight + offsetHeight / 2, left: offsetLeft - popOffsetWidth / 2};
      break;
    case 'top':
      positionStyle = {top: offsetTop - popOffsetHeight - offsetHeight / 2, left: offsetLeft - popOffsetWidth / 2};
      break;
    case 'right':
      positionStyle = {top: offsetTop + sideOffsetTop, left: offsetLeft + offsetWidth + 15};
      break;
    }
    return positionStyle;
  }
  render() {
    const {
      open, children, relativeElem, position,
      className = '', onClose, fixed, type,
      showCloseBtn
    } = this.props;
    if(!relativeElem) return <span />;

    let container = (<span />);
    const transitionKey = open ? 'popover' : 'popover-close';
    if(open) {
      const closeBtn = showCloseBtn ? (
        <div className="close-btn" onClick={e => onClose()}>x</div>
      ) : null;

      container = (
        <div tabIndex="-1"
          onKeyDown={this.handleKeyDown}
          className={`uke-popover ${fixed ? 'fixed' : ''} ${position} ${className} ${type}`}
          style={this.calaStyle(position)} ref={e => this.getPopoverDOM(e)}>
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
