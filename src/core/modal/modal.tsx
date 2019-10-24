import React from 'react';

import { Call, IsFunc } from 'basic-helper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classnames from 'classnames';

import { DragPanelClass, DragPanelClassProps } from './drag-pabel-helper';
import { Icon } from '../icon';
import { Children } from '../utils/props';

export interface ModalRequiredProps {
  /** 当前 modal 是否打开 */
  isOpen: boolean;
  /** 关闭 modal */
  onCloseModal: () => void;
}

export interface ModalOptions extends DragPanelClassProps {
  /** style */
  style?: React.CSSProperties;
  /** 动画的持续时间 */
  duration?: number;
  /** title */
  title?: string;
  /** id */
  id?: string | number;
  /** class name */
  className?: string;
  /** 当 modal 打开是，挂载在 document.body 的 class */
  topClassName?: string;
  /** 宽度 */
  width?: string | number;
  /** 当前 modal 的 index */
  idx?: string | number;
  /** marginTop */
  marginTop?: string | number;
  /** 是否需要动画效果 */
  animation?: boolean;
  /** 是否点击背景关闭 modal */
  clickBgToClose?: boolean;
  /** 是否可拖拽模式的 modal */
  draggable?: boolean;
  /** 是否需要 mask 背景 */
  needMask?: boolean;
  /** 是否渲染关闭 modal 的按钮 */
  showCloseBtn?: boolean;
  /** 是否需要最大化按钮 */
  needMaxBtn?: boolean;
  /** 是否需要最小化按钮 */
  needMinBtn?: boolean;
  /** 是否需要头部 */
  needHeader?: boolean;
  /** 是否关闭 modal content 的最大高度 80vh */
  maxHeightable?: boolean;
  /** 是否使用 esc 按键关闭 modal */
  shouldCloseOnEsc?: boolean;
  /** 是否最小化 */
  isMinimize?: boolean;
  /** 是否使用 esc 按键关闭 modal */
  modalType?: 'normal' | 'side';
  /** modeType == 'side' 时弹出的方向 */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** 用于嵌入 Modal 之中的模版 */
  template?: (modalProps: ModalProps) => Children;
  /** 头部插件，传入未事例化的组件 */
  Header?: (modalProps: {}) => Children;
  /** 关闭 modal 时的回调 */
  onClose?: (modalProps: {}) => void;
  /** 替代默认的 layout */
  modalLayoutDOM?: Children;
  /** children */
  children?: Children;
  /** 多窗口模式的 sectionId */
  sectionId?: string | number;
  /** 响应最小化的事件的接口 */
  minimizeWindow?: (sectionId: string | number) => void;
  /** 多窗口模式下的选择窗口的接口 */
  selectWindow?: (sectionId: string | number) => void;
}

export interface ModalProps extends ModalOptions, ModalRequiredProps {
  /** style */
  style?: React.CSSProperties;
  /** 动画的持续时间 */
  duration?: number;
  /** title */
  title?: string;
  /** id */
  id?: string | number;
  /** class name */
  className?: string;
  /** 当 modal 打开是，挂载在 document.body 的 class */
  topClassName?: string;
  /** 宽度 */
  width?: string | number;
  /** 当前 modal 的 index */
  idx?: string | number;
  /** marginTop */
  marginTop?: string | number;
  /** 是否需要动画效果 */
  animation?: boolean;
  /** 是否点击背景关闭 modal */
  clickBgToClose?: boolean;
  /** 是否可拖拽模式的 modal */
  draggable?: boolean;
  /** 是否需要 mask 背景 */
  needMask?: boolean;
  /** 是否渲染关闭 modal 的按钮 */
  showCloseBtn?: boolean;
  /** 是否需要最大化按钮 */
  needMaxBtn?: boolean;
  /** 是否需要最小化按钮 */
  needMinBtn?: boolean;
  /** 是否需要头部 */
  needHeader?: boolean;
  /** 是否关闭 modal content 的最大高度 80vh */
  maxHeightable?: boolean;
  /** 是否使用 esc 按键关闭 modal */
  shouldCloseOnEsc?: boolean;
  /** 是否最小化 */
  isMinimize?: boolean;
  /** 是否使用 esc 按键关闭 modal */
  modalType?: 'normal' | 'side';
  /** modeType == 'side' 时弹出的方向 */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** 用于嵌入 Modal 之中的模版 */
  template?: (modalProps?: {}) => Children;
  /** 头部插件，传入未事例化的组件 */
  Header?: (modalProps?: {}) => Children;
  /** 关闭 modal 时的回调 */
  onClose?: (modalProps?: {}) => void;
  /** 替代默认的 layout */
  modalLayoutDOM?: Children;
  /** children */
  children?: Children;
  /** 多窗口模式的 sectionId */
  sectionId?: string | number;
  /** 响应最小化的事件的接口 */
  minimizeWindow?: (sectionId: string | number) => void;
  /** 多窗口模式下的选择窗口的接口 */
  selectWindow?: (sectionId: string | number) => void;
}

const ESC_KEY = 27;
const classNameMap = {
  side: 'side-modal',
  normal: 'normal-modal'
};
const animateTypeFilter = (props) => {
  const { animateType, position, modalType } = props;
  if (animateType) return animateType;
  let res = 'modal';
  switch (modalType) {
    case 'side':
      res = `${position}-side-modal`;
      break;
  }
  return res;
};

export default class Modal extends DragPanelClass<ModalRequiredProps & ModalProps> {
  static animateTypeFilter = animateTypeFilter

  static defaultProps = {
    shouldCloseOnEsc: true,
    showCloseBtn: true,
    needMaxBtn: true,
    needMinBtn: true,
    needHeader: true,
    animation: true,
    needMask: true,
    draggable: false,
    duration: 300,
    marginTop: '2%',
    modalType: 'normal',
    title: 'Title',
    className: '',
    children: null,
    topClassName: 'modal-opend',
    maxHeightable: true,
  };

  state = {
    ...this.state,
    isMaximize: false
  };

  __mount

  ukeLayout

  componentDidMount() {
    this.setContentFocus();
    this.__mount = true;
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props != nextProps || this.state != nextState;
  }

  componentWillUnmount() {
    const { isOpen } = this.props;
    this.toggleTopClass(false);
    this.__mount = false;

    /**
     * 关闭窗口的 callback
     */
    if (isOpen) Call(this.props.onClose);
  }

  componentDidUpdate(preProps) {
    const { draggable, isMinimize } = this.props;
    const isAdd = !isMinimize && !draggable;
    this.toggleTopClass(isAdd);
    if (this.props.isOpen !== preProps.isOpen) {
      this.setContentFocus();
    }
  }

  toggleTopClass = (isAdd) => {
    const { topClassName } = this.props;
    topClassName && document.body.classList.toggle(topClassName, isAdd);
  }

  setContentFocus = () => {
    if (this.props.isOpen && this.ukeLayout) {
      this.ukeLayout.focus();
    }
  }

  handleKeyDown = (event) => {
    if (
      this.props.shouldCloseOnEsc
        && event.keyCode === ESC_KEY
        && this.props.showCloseBtn !== false
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.closeModal();
    }
  }

  wrapPropsForTMPL = () => ({
    ...this.props
  })

  maximinzeWindow = (isMaximize) => {
    this.setState({
      isMaximize
    });
  }

  closeModal = () => {
    this.props.onCloseModal();
  }

  render() {
    const {
      children, title, isOpen, selectWindow, sectionId, idx,
      width, marginTop, style, className, modalLayoutDOM, duration, id, template,
      showCloseBtn, Header, needMask, draggable, animation,
      onCloseModal, maxHeightable, needHeader, needMaxBtn, needMinBtn,
      minimizeWindow, position, modalType,
      isMinimize,
    } = this.props;
    const { clickBgToClose = modalType !== 'normal' } = this.props;
    const animateType = animateTypeFilter(this.props);
    const { isMaximize } = this.state;

    const modalIdx = this.props.idx || 0;

    const _needMark = draggable ? false : needMask;
    const classNames = classnames(
      className,
      position,
      modalType && classNameMap[modalType],
      draggable ? 'drag-mode' : 'normal-mode',
      isMaximize && 'maximinze',
      isMinimize && 'miniminze',
    );

    const closeBtnDOM = showCloseBtn && (
      <span className="close _btn"
        onClick={e => onCloseModal()}>
        <Icon n="close" />
      </span>
    );
    const maxBtnDOM = needMaxBtn && (
      <span className="max _btn"
        onClick={e => this.maximinzeWindow(!isMaximize)}>
        <Icon n={isMaximize ? "restore" : "max"} />
      </span>
    );
    const minBtnDOM = !isMaximize && minimizeWindow && needMinBtn && (
      <span className="min _btn"
        onClick={e => sectionId && minimizeWindow(sectionId)}>
        <Icon n="min" />
      </span>
    );

    const _style = Object.assign({}, style, {
      width,
      marginTop,
      outline: 'none'
    });

    const transitionKey = isOpen ? 'modal-open' : 'modal-close';
    const sectionMark = _needMark && (
      <div className="section-mark" onClick={(e) => {
        if (clickBgToClose) this.closeModal();
      }} />
    );

    let sections;
    if (isOpen) {
      if (template && IsFunc(template)) {
        sections = template(this.wrapPropsForTMPL());
      } else {
        sections = (
          <div className={`__modal-container ${classNames} idx-${isMinimize ? '-1' : modalIdx}`}
            onMouseDown={(e) => {
              /** 用于判断是否通过 ShowModal 打开的 Modal，如果有 idx != 0 的时候才触发选择窗口 */
              id && idx && selectWindow && selectWindow(id);
            }}>
            <div className="animate-layout">
              {
                modalLayoutDOM || (
                  <div className="__modal-layout"
                    ref={(c) => {
                      if (!c) return;
                      this.ukeLayout = c;
                      draggable && this.setLayoutInitPosition(c);
                    }}
                    style={_style}
                    onKeyDown={this.handleKeyDown}
                    tabIndex={-1}>
                    {
                      needHeader && (
                        Header && IsFunc(Header) ? Header({
                          closeModal: this.closeModal,
                          props: this.props
                        }) : (
                          <header className="__modal-header">
                            <div
                              onMouseDown={(e) => {
                                !isMaximize && draggable && this.dragStart(e, this.ukeLayout);
                                id && selectWindow && selectWindow(id);
                              }}>
                              <h5 className="title">{title}</h5>
                            </div>
                            <span className="btn-set">
                              {minBtnDOM}
                              {maxBtnDOM}
                              {closeBtnDOM}
                            </span>
                          </header>
                        )
                      )
                    }
                    <div className={`__modal-content${maxHeightable ? ' max-height' : ''}`}>
                      {children}
                    </div>
                  </div>
                )
              }
            </div>
            {sectionMark}
          </div>
        );
      }
    } else {
      sections = <span />;
    }

    return animation ? (
      <TransitionGroup component={null}>
        <CSSTransition
          key={transitionKey}
          classNames={animateType}
          timeout={duration}>
          {sections}
        </CSSTransition>
      </TransitionGroup>
    ) : sections;
  }
}
