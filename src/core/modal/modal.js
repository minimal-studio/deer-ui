import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { Call, IsFunc } from 'basic-helper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { DragPanelClass } from './drag-pabel-helper';

const ESC_KEY = 27;

export default class Modal extends DragPanelClass {
  static propTypes = {
    /** title */
    title: PropTypes.string,
    /** 宽度 */
    width: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number
    ]),
    /** 动画的持续时间 */
    duration: PropTypes.number,
    /** 当前 modal 的 index */
    idx: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number
    ]),
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
    /** 当前 modal 是否打开 */
    isOpen: PropTypes.bool.isRequired,
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
  state = {...this.state};

  componentDidMount() {
    this.setContentFocus();
  }
  
  componentWillUnmount() {
    let { topClassName, isOpen } = this.props;
    document.body.classList.remove(topClassName);

    /**
     * 关闭窗口的 callback
     */
    if(isOpen) Call(this.props.onClose);
  }
  
  componentDidUpdate(preProps) {
    if(this.props.isOpen !== preProps.isOpen) {
      let { topClassName } = this.props;
      document.body.classList.toggle(topClassName, this.props.isOpen);
      this.setContentFocus();
    }
  }

  setContentFocus = () => {
    if (this.props.isOpen && this._content) {
      this._content.focus();
    }
  }

  setLayoutInitPosition(elem) {
    if(this.props.draggable && elem && !this.isSetPosition) {
      this.isSetPosition = true;
      elem.style.left = (this.getScreenWidth() - elem.offsetWidth) / 2 + 'px';
      elem.style.top = '100px';
    }
  }

  handleKeyDown = (event) => {
    if (this.props.shouldCloseOnEsc && event.keyCode === ESC_KEY && this.props.showCloseBtn != false) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onCloseModal(event);
    }
  }

  render() {
    const {
      children, title, isOpen, animateType, selectWindow, sectionId,
      width, style, className, modalLayoutDOM, duration, id, 
      clickBgToClose, showCloseBtn, Header, needMask, draggable, 
      onCloseModal, maxHeightable,
    } = this.props;

    let modalIdx = this.props.idx;

    const _needMark = draggable ? false : needMask;
    const classNames = className + (draggable ? ' drag-mode' : ' normal-mode');

    const closeBtnDOM = showCloseBtn ? (
      <span className="close-btn"
        onClick={e => onCloseModal()}>x
      </span>
    ) : null;

    const _style = Object.assign({}, style, {
      width,
      outline: 'none'
    });

    const transitionKey = isOpen ? 'modal-open' : 'modal-close';
    
    const sections = isOpen ? (
      <div className={'uke-modal-container ' + classNames + ' idx-' + modalIdx}
        onMouseDown={e => {
          selectWindow && selectWindow(id);
        }}>
        <div className="animate-layout">
          {
            modalLayoutDOM ? modalLayoutDOM : (
              <div className="uke-modal-layout"
                ref={c => {
                  this._content = c;
                  this.setLayoutInitPosition(c);
                }}
                style={_style}
                onKeyDown={this.handleKeyDown}
                tabIndex="-1">
                {
                  IsFunc(Header) ? (
                    <Header onCloseModal={onCloseModal}/>
                  ) : (
                    <header className="uke-modal-header"
                      onMouseDown={e => {
                        draggable && this.dragStart(e, this._content);
                        selectWindow && selectWindow(id);
                      }}>
                      <h5 className="title">{title}</h5>
                      {closeBtnDOM}
                    </header>
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
              if(clickBgToClose) onCloseModal();
            }} />
          ) : null
        }
      </div>
    ) : <span />;

    return (
      <TransitionGroup component={null}>
        <CSSTransition
          key={transitionKey}
          classNames={animateType}
          timeout={duration}>
          {sections}
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
