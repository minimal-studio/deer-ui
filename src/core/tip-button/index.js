import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {CallFunc, GenerteID} from 'basic-helper';

import {PopoverEntity} from '../popover';

export default class TipButton extends Component {
  constructor(props) {
    super(props);
    this.popoverLifeTimer = null;

    this.btnId = GenerteID();
    this.popover = new PopoverEntity('tipBtnIdx');
  }
  closePopover() {
    const {onClose} = this.props;
    this.clearTimer();
    this.popover.setPopover({
      open: false,
    })
    CallFunc(onClose)();
  }
  componentWillUnmount() {
    this.clearTimer();
  }
  clearTimer() {
    if(this.popoverLifeTimer) clearTimeout(this.popoverLifeTimer);
    this.popoverLifeTimer = null;
  }
  showPopover(e) {
    const {
      timer = 5000, autoClose = true, children, position = 'left'
    } = this.props;
    const self = this;
    this.popover.setPopover({
      elem: e.target,
      props: {
        position,
      },
      open: true,
      children
    })
    if(!autoClose) return;
    this.clearTimer();
    this.popoverLifeTimer = setTimeout(() => {
      self.closePopover();
    }, timer);
  }
  _onClick(e) {
    const {disabled, onClick, showTip = true} = this.props;
    if(!disabled) {
      CallFunc(onClick)();
    }
    this.prevNode = e.target;
    if(showTip) this.showPopover(e);
    // setTimeout(() => {
    //   this.setPopoverChildren(this.props.children);
    // }, 0);
  }
  refreshChild() {
    this.setPopoverChildren(this.props.children);
  }
  setPopoverChildren(children) {
    if(!this.prevNode) return;
    this.popover.setPopover({
      open: true,
      children
    });
  }
  render() {
    const {children, position = 'left', className = 'theme', text, disabled} = this.props;

    return (
      <span className="tip-btn">
        <span className={"btn " + className} disabled={disabled}
          ref={clickBtn => this.relativeBtn = clickBtn}
          onClick={e => {
            if(disabled) return;
            this._onClick(e)}
          }>{text}</span>
      </span>
    );
  }
}
TipButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  text: PropTypes.string.isRequired,
  timer: PropTypes.any,
  showTip: PropTypes.bool,
  autoClose: PropTypes.bool,
  position: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool
};
