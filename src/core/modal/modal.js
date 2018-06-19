import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { CallFunc, IsFunc } from 'basic-helper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const ESC_KEY = 27;

export default class Modal extends Component {
  static defaultProps = {
    shouldCloseOnEsc: true,
  };
  static propTypes = {
    title: PropTypes.string,
    width: PropTypes.any,
    duration: PropTypes.number,
    className: PropTypes.string,
    topClassName: PropTypes.string,
    clickBgToClose: PropTypes.bool,
    needMask: PropTypes.bool,
    showCloseBtn: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    Header: PropTypes.any,
    onCloseModal: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    shouldCloseOnEsc: PropTypes.bool,
  };

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

  handleKeyDown = (event) => {
    if (this.props.shouldCloseOnEsc && event.keyCode === ESC_KEY && this.props.showCloseBtn != false) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onCloseModal(event);
    }
  }

  render() {
    const {
      children = '', title = 'Modal', isOpen, animateType = 'modal',
      width, style, className = '', modalLayoutDOM, duration = 300,
      clickBgToClose = false, showCloseBtn = true, Header, needMask = true,
      onCloseModal
    } = this.props;

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
      <div className={'uke-modal-container ' + className}>
        <div className="animate-layout">
          {
            modalLayoutDOM ? modalLayoutDOM : (
              <div className="uke-modal-layout"
                ref={c => this._content = c}
                style={_style}
                onKeyDown={this.handleKeyDown}
                tabIndex="-1">
                {
                  IsFunc(Header) ? <Header onCloseModal={onCloseModal}/> : (
                    <header className="uke-modal-header">
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
          needMask ? (
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
