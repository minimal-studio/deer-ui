import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { Call, IsFunc } from 'basic-helper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classnames from 'classnames';

import { DragPanelClass } from './drag-pabel-helper';
import { Icon } from '../icon';

const ESC_KEY = 27;

export default class Modal extends DragPanelClass {
  static propTypes = {
    /** title */
    title: PropTypes.string,
    /** 宽度 */
    width: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number
    ]),
    /** 点击的元素 */
    // elem: PropTypes.node,
    /** 动画的持续时间 */
    duration: PropTypes.number,
    /** 当前 modal 的 index */
    idx: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number
    ]),
    /** 用于嵌入 Modal 之中的模版 */
    template: PropTypes.func,
    /** 是否需要动画效果 */
    animation: PropTypes.bool,
    /** class name */
    className: PropTypes.string,
    /** 当 modal 打开是，在 body 挂载的 class name */
    topClassName: PropTypes.string,
    /** 是否点击背景关闭 modal */
    clickBgToClose: PropTypes.bool,
    /** 是否可拖拽模式的 modal */
    draggable: PropTypes.bool,
    /** 是否需要 mask 背景 */
    needMask: PropTypes.bool,
    /** 是否渲染关闭 modal 的按钮 */
    showCloseBtn: PropTypes.bool,
    /** 是否需要最大化按钮 */
    needMaxBtn: PropTypes.bool,
    /** 是否需要最小化按钮 */
    needMinBtn: PropTypes.bool,
    /** 当前 modal 是否打开 */
    isOpen: PropTypes.bool.isRequired,
    /** 是否需要头部 */
    needHeader: PropTypes.bool,
    /** 头部插件，传入未事例化的组件 */
    Header: PropTypes.func,
    /** 关闭 modal */
    onCloseModal: PropTypes.func.isRequired,
    /** 关闭 modal 时的回调 */
    onClose: PropTypes.func,
    /** 是否使用 esc 按键关闭 modal */
    shouldCloseOnEsc: PropTypes.bool,
    /** 是否关闭 modal content 的最大高度 80vh */
    maxHeightable: PropTypes.bool,
  };
  static defaultProps = {
    shouldCloseOnEsc: true,
    showCloseBtn: true,
    needMaxBtn: true,
    needMinBtn: true,
    needHeader: true,
    animation: true,
    needMask: true,
    clickBgToClose: false,
    draggable: false,
    duration: 300,
    animateType: 'modal',
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

  componentDidMount() {
    this.setContentFocus();
    this.__mount = true;
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props != nextProps || this.state != nextState;
  }
  
  componentWillUnmount() {
    let { topClassName, isOpen } = this.props;
    document.body.classList.remove(topClassName);
    this.__mount = false;

    /**
     * 关闭窗口的 callback
     */
    if(isOpen) Call(this.props.onClose);
  }
  
  componentDidUpdate(preProps) {
    let { topClassName, draggable } = this.props;
    !draggable && document.body.classList.add(topClassName);
    if(this.props.isOpen !== preProps.isOpen) {
      this.setContentFocus();
    }
  }

  setContentFocus = () => {
    if (this.props.isOpen && this._content) {
      this._content.focus();
    }
  }

  handleKeyDown = (event) => {
    if (this.props.shouldCloseOnEsc && event.keyCode === ESC_KEY && this.props.showCloseBtn != false) {
      event.preventDefault();
      event.stopPropagation();
      this.closeModal(event);
    }
  }

  wrapPropsForTMPL = () => {
    return {
      ...this.props
    };
  }

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
      children, title, isOpen, animateType, selectWindow, sectionId, idx,
      width, style, className, modalLayoutDOM, duration, id, template,
      clickBgToClose, showCloseBtn, Header, needMask, draggable, animation,
      onCloseModal, maxHeightable, needHeader, needMaxBtn, needMinBtn,
      minimizeWindow,
      // isMaximize
    } = this.props;
    const { isMaximize } = this.state;

    let modalIdx = this.props.idx || 0;

    const _needMark = draggable ? false : needMask;
    const classNames = classnames({
      [className]: !!className,
      'drag-mode': draggable,
      'normal-mode': !draggable,
      maximinze: isMaximize
    });

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
        onClick={e => minimizeWindow(sectionId)}>
        <Icon n="min" />
      </span>
    );

    const _style = Object.assign({}, style, {
      width,
      outline: 'none'
    });

    const transitionKey = isOpen ? 'modal-open' : 'modal-close';
    
    const sections = isOpen ? IsFunc(template) ? template(this.wrapPropsForTMPL()) : (
      <div className={'uke-modal-container ' + classNames + ' idx-' + modalIdx}
        onMouseDown={e => {
          /** 用于判断是否通过 ShowModal 打开的 Modal，如果有 idx != 0 的时候才触发选择窗口 */
          idx && selectWindow && selectWindow(id);
        }}>
        <div className="animate-layout">
          {
            modalLayoutDOM ? modalLayoutDOM : (
              <div className="uke-modal-layout"
                ref={c => {
                  if(!c) return;
                  this._content = c;
                  draggable && this.setLayoutInitPosition(c);
                }}
                style={_style}
                onKeyDown={this.handleKeyDown}
                tabIndex="-1">
                {
                  needHeader && (
                    IsFunc(Header) ? (
                      <Header onCloseModal={this.closeModal}/>
                    ) : (
                      <header className="uke-modal-header">
                        <div
                          onMouseDown={e => {
                            !isMaximize && draggable && this.dragStart(e, this._content);
                            selectWindow && selectWindow(id);
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
                <div className={'uke-modal-content'+(maxHeightable ? ' max-height' : '')}>
                  {children}
                </div>
              </div>
            )
          }
        </div>
        {
          _needMark ? (
            <div className="section-mark" onClick={e => {
              if(clickBgToClose) this.closeModal();
            }} />
          ) : null
        }
      </div>
    ) : <span />;

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
