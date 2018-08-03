import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { CallFunc, IsFunc } from 'basic-helper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {DragPanelClass} from './drag-pabel-helper';

const ESC_KEY = 27;

export default class Modal extends DragPanelClass {
  static defaultProps = {
    shouldCloseOnEsc: true,
    showCloseBtn: true,
    needMask: true,
    clickBgToClose: false,
    draggable: false,
    duration: 300,
    animateType: 'modal',
    title: '无',
    className: '',
    children: null,
  };
  static propTypes = {
    title: PropTypes.string,
    width: PropTypes.any,
    duration: PropTypes.number,
    idx: PropTypes.any,
    className: PropTypes.string,
    topClassName: PropTypes.string,
    clickBgToClose: PropTypes.bool,
    draggable: PropTypes.bool,
    needMask: PropTypes.bool,
    showCloseBtn: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    Header: PropTypes.any,
    onCloseModal: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    shouldCloseOnEsc: PropTypes.bool,
  };
  state = {...this.state};

  componentDidMount() {
    this.setContentFocus();
  }

  componentDidUpdate(preProps) {
    if(this.props.isOpen !== preProps.isOpen) {
      let {topClassName = 'modal-opend'} = this.props;
      document.body.classList.toggle(topClassName, this.props.isOpen);
      this.setContentFocus();

      /**
       * 关闭窗口的callback
       */
      if(!this.props.isOpen) CallFunc(this.props.onClose)();
    }
  }

  setContentFocus = () => {
    if (this.props.isOpen && this._content) {
      this._content.focus();
    }
  }

  setLayoutInitPosition(elem) {
    // console.log(this.screenWidth)
    if(this.props.draggable && elem && !this.isSetPosition) {
      this.isSetPosition = true;
      elem.style.left = (this.screenWidth - elem.offsetWidth) / 2 + 'px';
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
      onCloseModal
    } = this.props;

    let modalIdx = this.props.idx;

    const _needMark = draggable ? false : needMask;
    const classNames = className + (draggable ? ' drag-mode' : ' normal-mode');

    const closeBtnDOM = showCloseBtn ? (
      <span className="close-btn"
        onClick={e => onCloseModal()}>x</span>
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
                <div className="uke-modal-content">
                  {children}
                </div>
              </div>
            )
          }
        </div>
        {
          _needMark ? (
            <div className="section-mark" onClick={e => {
              if(clickBgToClose) onCloseModal()
            }}></div>
          ) : null
        }
      </div>
    ) : <span></span>;

    return (
      <TransitionGroup component={null}>
        <CSSTransition
          key={transitionKey}
          classNames={animateType}
          timeout={duration}>
          {sections}
        </CSSTransition>
      </TransitionGroup>
    )
  }
}
