/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classnames from 'classnames';

import { getElementOffset } from '../utils/get-elem-offset';
import {
  getLeft, getRight, getTop, getBottom,
  PositionReturn, PopoverPosition
} from '../utils/position';
import { Children, Color } from '../utils/props';

export interface PopoverProps {
  /** 是否激活 */
  open: boolean;
  /** 是否只有显示效果，关闭所有交互 */
  onlyDisplay?: boolean;
  /** 关闭的回调，之前是 RequestClose */
  onClose: (closeEvent: any) => void;
  /** 相对的元素，传入 document node */
  relativeElem: HTMLElement | EventTarget;
  /** 弹出的位置 */
  position?: PopoverPosition;
  /** 弹出框的颜色类型 */
  type?: Color;
  /** 是否显示关闭按钮 */
  showCloseBtn?: boolean;
  /** 是否 fixed 定位 */
  fixed?: boolean;
  /** 是否 update 组件 */
  update?: boolean;
  /** class name */
  className?: HTMLElement['className'];
  /** class name */
  children?: Children;
  /** style */
  style?: React.CSSProperties;
  /** 是否支持 Esc 关闭 */
  enableTabIndex?: boolean;
}

interface State {
  positionStyle: PositionReturn;
  prevProps: {};
  childrenChange: boolean;
}

const ESC_KEY = 27;

function getChildrenKeys(children) {
  if (!children) return [];
  const _children = Array.isArray(children) ? children : [children];
  const childrenKeys = _children.map((item) => item.key);
  return childrenKeys;
}

export default class Popover extends Component<PopoverProps, State> {
  static defaultProps = {
    position: 'right',
    type: 'white',
    showCloseBtn: true,
    enableTabIndex: true,
  };

  static getDerivedStateFromProps(nextProps, { prevProps }) {
    const hasChangeChildren = JSON.stringify(getChildrenKeys(nextProps.children))
        !== JSON.stringify(getChildrenKeys(prevProps.children));
    if (hasChangeChildren) {
      return {
        childrenChange: true,
        prevProps: nextProps
      };
    }
    return null;
  }

  readPosition = '';

  popoverDOM

  __isMounted

  constructor(props) {
    super(props);

    this.state = {
      positionStyle: {
        position: 'bottom',
        top: 0,
        left: 0,
      },
      prevProps: props,
      childrenChange: false
    };
  }

  shouldComponentUpdate = (nextProps) => {
    const shouldUpdate = typeof nextProps.update === 'undefined' ? true : nextProps.update;
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

  componentDidUpdate(prevProps, prevState) {
    this.setContentFocus();
    if (prevState.childrenChange) {
      this.__isMounted && this.setState({
        childrenChange: false
      });
    }
  }

  getRelativeElemOffset() {
    const { relativeElem } = this.props;
    const { offsetWidth = 0, offsetHeight = 0 } = relativeElem as HTMLElement;
    const { offsetTop = 0, offsetLeft = 0 } = getElementOffset(relativeElem) || {};
    return {
      offsetWidth, offsetHeight, offsetTop, offsetLeft
    };
  }

  calaStyle(position, popoverScale) {
    const {
      offsetTop, offsetLeft, offsetWidth, offsetHeight
    } = this.getRelativeElemOffset();
    const { height, width } = popoverScale;

    let positionStyle: PositionReturn = {
      left: 0,
      top: 0,
      position: 'top'
    };
    const args = {
      offsetTop,
      offsetLeft,
      offsetWidth,
      offsetHeight,
      elemWidth: width,
      // verticalOffset: 8,
      elemHeight: height
    };
    let offset = 0;

    switch (position) {
      case 'bottom':
        offset = 10;
        positionStyle = getBottom({ ...args, offset });
        break;
      case 'top':
        offset = 10;
        positionStyle = getTop({ ...args, offset });
        break;
      case 'left':
        offset = 10;
        positionStyle = getLeft({ ...args, offset });
        break;
      case 'right':
        offset = 10;
        positionStyle = getRight({ ...args, offset });
        break;
    }
    return positionStyle;
  }

  setSelfPosition = (elem: HTMLDivElement | null) => {
    if (!elem) return;
    const { position } = this.props;
    this.popoverDOM = elem;
    const popoverScale = {
      width: elem.offsetWidth,
      height: elem.offsetHeight,
    };
    const nextPositionStyle = this.calaStyle(position, popoverScale);
    elem.style.top = `${nextPositionStyle.top}px`;
    elem.style.left = `${nextPositionStyle.left}px`;
  }

  render() {
    const {
      open, children, relativeElem, onlyDisplay,
      className = '', onClose, fixed, type, style,
      showCloseBtn, enableTabIndex
    } = this.props;
    if (!relativeElem) return <span />;
    // const { positionStyle } = this.state;
    // const { top, left, position } = positionStyle;
    // const _style = Object.assign({}, style, {
    //   top,
    //   left,
    // });

    let container = (<span />);
    if (open) {
      const closeBtn = showCloseBtn && (
        <div className="_close-btn" onClick={(e) => onClose(e)}>x</div>
      );
      const obj = enableTabIndex ? {
        tabIndex: -1, onKeyDown: this.handleKeyDown
      } : {};
      const popClasses = classnames(
        `__popover`,
        // position,
        className,
        type,
        fixed && `fixed`,
        onlyDisplay && `only-display`,
        showCloseBtn && `has-close`,
      );
      container = (
        <div
          {...obj}
          className={popClasses}
          // style={_style}
          ref={(e) => this.setSelfPosition(e)}
        >
          {/* <span className="caret" style={{

          }}
          /> */}
          {children}
          {closeBtn}
        </div>
      );
    }
    return container;
    return (
      <TransitionGroup
        component={null}
      >
        <CSSTransition
          key={open ? 'popover' : 'popover-close'}
          classNames="popover"
          timeout={200}
        >
          {container}
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
