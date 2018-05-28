import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

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
  constructor(props) {
    super(props);
    this.state = {
      popoverOffset: {
        width: 0,
        height: 0
      }
    };
    this.setContentFocus = this.setContentFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  shouldComponentUpdate(nextProps) {
    let shouldUpdate = typeof nextProps.update === 'undefined' ? true : nextProps.update;
    return shouldUpdate;
  }
  getPopoverDOM(e) {
    this.popoverDOM = e;
  }
  handleKeyDown(event) {
    if (event.keyCode === ESC_KEY) {
      event.preventDefault();
      event.stopPropagation();
      this.props.RequestClose(event);
    }
  }
  setContentFocus() {
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
  render() {
    const {
      open, children, relativeElem, position = 'right',
      className = '', RequestClose,
      showCloseBtn = true
    } = this.props;
    if(!relativeElem) return <span></span>;
    const {offsetWidth = 0, offsetHeight = 0} = relativeElem;
    const {offsetTop = 0, offsetLeft = 0} = getPosition(relativeElem);
    const {popoverOffset} = this.state;
    const popOffsetHeight = popoverOffset.height;
    const popOffsetWidth = popoverOffset.width;

    const popoverClass = open ? 'popover show' : 'popover';
    let container = (<span></span>);
    const transitionKey = open ? 'popover' : 'popover-close';
    if(open) {
      let positionInfo = {};
      let caretPositionClass;
      let sideOffsetTop = -10;

      switch (position) {
        case 'left':
          caretPositionClass = 'right';
          positionInfo = {top: offsetTop + sideOffsetTop, left: offsetLeft - popOffsetWidth - 12};
          break;
        case 'bottom':
          caretPositionClass = 'top';
          positionInfo = {top: offsetTop + offsetHeight + offsetHeight / 2, left: offsetLeft - popOffsetWidth / 2};
          break;
        case 'top':
          caretPositionClass = 'bottom';
          positionInfo = {top: offsetTop - popOffsetHeight - offsetHeight / 2, left: offsetLeft - popOffsetWidth / 2};
          break;
        default:
          caretPositionClass = 'left';
          positionInfo = {top: offsetTop + sideOffsetTop, left: offsetLeft + offsetWidth + 15};
          break;
      }

      const closeBtn = showCloseBtn ? (
        <div className="close-btn" onClick={e => RequestClose()}>x</div>
      ) : null;

      container = (
        <div tabIndex="-1" onKeyDown={this.handleKeyDown} className={"v-popover " + className}
          style={positionInfo} ref={e => this.getPopoverDOM(e)}>
          {closeBtn}
          <span className={"caret " + caretPositionClass}></span>
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
Popover.propTypes = {
  open: PropTypes.bool.isRequired,
  relativeElem: PropTypes.object.isRequired,
  RequestClose: PropTypes.func.isRequired,
  position: PropTypes.any,
  className: PropTypes.string,
  showCloseBtn: PropTypes.bool,
  update: PropTypes.bool,
};
