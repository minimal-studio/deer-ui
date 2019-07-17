import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, GenerteID } from 'basic-helper';

import { PopoverEntity } from '../popover';

/**
 * 基于 Button 和 Popover 的组合组件
 *
 * @export
 * @class TipButton
 * @extends {Component}
 */
export default class TipButton extends Component {
  static propTypes = {
    /** 点击按钮的回调 */
    onClick: PropTypes.func.isRequired,
    /** 按钮的显示文字 */
    text: PropTypes.string.isRequired,
    /** 弹出层关闭的回调 */
    onClose: PropTypes.func,
    /** 弹出层多久自动关闭 */
    timer: PropTypes.number,
    /** 是否显示弹出层 */
    showTip: PropTypes.bool,
    /** 是否自动关闭弹出层 */
    autoClose: PropTypes.bool,
    /** 弹出层的位置 */
    position: PropTypes.string,
    /** 按钮的 className */
    className: PropTypes.string,
    /** 传入 popover 显示的 children */
    popover: PropTypes.any,
    /** 是否禁用 */
    disabled: PropTypes.bool
  };
  static defaultProps = {
    showTip: true,
    autoClose: true,
    timer: 3000,
  }
  constructor(props) {
    super(props);
    this.popoverLifeTimer = null;

    this.btnId = GenerteID();
    this.popover = new PopoverEntity('tipBtnIdx');
  }
  closePopover() {
    const {onClose} = this.props;
    this.clearTimer();
    this.popover.close();
    Call(onClose);
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
    if(!autoClose) return;
    this.clearTimer();
    this.popoverLifeTimer = setTimeout(() => {
      self.closePopover();
    }, timer);
  }
  _onClick(e) {
    const { disabled, onClick, showTip } = this.props;
    if(!disabled) {
      Call(onClick);
    }
    this.prevNode = e.target;
    if(showTip) this.showPopover(e);
    // setTimeout(() => {
    //   this.setPopoverChildren(this.props.children);
    // }, 0);
  }
  refreshChild() {
    this.setPopoverChildren(this.props.popover);
  }
  setPopoverChildren(popover) {
    if(!this.prevNode) return;
    this.popover.show({
      children: popover
    });
  }
  render() {
    const { className = 'theme', text, disabled } = this.props;

    return (
      <span className="tip-btn">
        <span className={"btn " + className} disabled={disabled}
          ref={clickBtn => this.relativeBtn = clickBtn}
          onClick={e => {
            if(disabled) return;
            this._onClick(e);}
          }>{text}
        </span>
      </span>
    );
  }
}
