import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import {CallFunc} from 'basic-helper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const TRANSTION_TIME = 300;
const ESC_KEY = 27;

export default class Modal extends Component {
  constructor(props) {
    super(props);

    this.setContentFocus = this.setContentFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.setContentFocus()
  }

  componentDidUpdate(preProps) {
    if(this.props.isOpen !== preProps.isOpen) {
      let {topClassName = 'modal-opend'} = this.props;
      document.body.classList.toggle(topClassName, this.props.isOpen);
      // setTimeout(() => {
      // }, TRANSTION_TIME);
      this.setContentFocus();

      /**
       * 关闭窗口的callback
       */
      if(!this.props.isOpen) CallFunc(this.props.onClose)();
    }
  }

  setContentFocus() {
    if (this.props.isOpen && this._content) {
      this._content.focus();
    }
  }

  handleKeyDown(event) {
    if (this.props.shouldCloseOnEsc && event.keyCode === ESC_KEY && this.props.showCloseBtn != false) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onCloseModal(event);
    }
  }

  render() {
    const {
      children = '', title = 'Modal', isOpen, animateType = 'modal',
      width, style, className = '', modalLayoutDOM,
      clickBgToClose = false, showCloseBtn = true, Header,
      onCloseModal,
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
      <div className={"v-modal-container " + className}>
        <div className="animate-layout">
          {
            modalLayoutDOM ? modalLayoutDOM : (
              <div className="v-modal-layout"
                ref={c => this._content = c}
                style={_style}
                onKeyDown={this.handleKeyDown}
                tabIndex="-1">
                {
                  Header ? <Header/> : (
                    <header className="v-modal-header">
                      <h5 className="title">{title}</h5>
                      {closeBtnDOM}
                    </header>
                  )
                }
                <div className="v-modal-content">
                  {children}
                </div>
              </div>
            )
          }
        </div>
        <div className="section-mark" onClick={e => {
          if(clickBgToClose) onCloseModal()
        }}></div>
      </div>
    ) : <span></span>;

    return (
      <TransitionGroup component={null}>
        <CSSTransition
          key={transitionKey}
          classNames={animateType}
          timeout={TRANSTION_TIME}>
          {sections}
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

Modal.propTypes = {
  title: PropTypes.string,
  width: PropTypes.any,
  maxHeight: PropTypes.any,
  className: PropTypes.string,
  topClassName: PropTypes.string,
  clickBgToClose: PropTypes.bool,
  showCloseBtn: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  shouldCloseOnEsc: PropTypes.bool,
};

Modal.defaultProps = {
  shouldCloseOnEsc: true,
}
