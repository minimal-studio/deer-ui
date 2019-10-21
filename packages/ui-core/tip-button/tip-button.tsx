import React, { Component } from 'react';
import { Call, UUID } from 'basic-helper';

import { PopoverEntity } from '../popover/popover-entity';

export interface TipButtonProps {
  /** 点击按钮的回调 */
  onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  /** 按钮的显示文字 */
  text?: string;
  /** 弹出层关闭的回调 */
  onClose?: () => void;
  /** 弹出层多久自动关闭 */
  timer?: number;
  /** 是否显示弹出层 */
  showTip?: boolean;
  /** 是否自动关闭弹出层 */
  autoClose?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 弹出层的位置 */
  position?: string;
  /** 按钮的 className */
  className?: string;
  /** 传入 popover 显示的 children */
  popover?: any;
}

/**
 * 基于 Button 和 Popover 的组合组件
 *
 * @export
 * @class TipButton
 * @extends {Component}
 */
export default class TipButton extends Component<TipButtonProps> {
  static defaultProps = {
    showTip: true,
    autoClose: true,
    timer: 300000,
  }

  popoverLifeTimer

  btnId = UUID()

  popover: PopoverEntity

  prevNode

  relativeBtn

  constructor(props) {
    super(props);
    this.popoverLifeTimer = null;

    this.popover = new PopoverEntity({ id: this.btnId });
  }

  componentWillUnmount() {
    this.clearTimer();
    this.popover.destroy();
  }

  closePopover() {
    const { onClose } = this.props;
    this.clearTimer();
    this.popover.close();
    Call(onClose);
  }

  clearTimer() {
    if (this.popoverLifeTimer) clearTimeout(this.popoverLifeTimer);
    this.popoverLifeTimer = null;
  }

  showPopover(e) {
    const {
      timer, autoClose, popover, position
    } = this.props;
    const self = this;
    this.popover.show({
      elem: e.target,
      props: {
        position,
      },
      children: popover
    });
    if (!autoClose) return;
    this.clearTimer();
    this.popoverLifeTimer = setTimeout(() => {
      self.closePopover();
    }, timer);
  }

  _onClick(e) {
    const { disabled, onClick, showTip } = this.props;
    if (!disabled) {
      Call(onClick);
    }
    this.prevNode = e.target;
    if (showTip) this.showPopover(e);
    // setTimeout(() => {
    //   this.setPopoverChildren(this.props.children);
    // }, 0);
  }

  refreshChild() {
    this.setPopoverChildren(this.props.popover);
  }

  setPopoverChildren(popover) {
    if (!this.prevNode) return;
    this.popover.show({
      children: popover
    });
  }

  render() {
    const { className = 'theme', text, disabled } = this.props;

    return (
      <span className="tip-btn">
        <button className={`btn ${className}`} disabled={disabled}
          ref={(e) => { this.relativeBtn = e; }}
          onClick={(e) => {
            if (disabled) return;
            this._onClick(e);
          }
          }>{text}
        </button>
      </span>
    );
  }
}
