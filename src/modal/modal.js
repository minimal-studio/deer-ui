import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
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
      if(!this.props.isOpen) $GH.CallFunc(this.props.onClose)();
    }
  }

  setContentFocus() {
    if (this.props.isOpen) {
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

  render () {
    const {
      children = '', title = 'Modal', isOpen, onCloseModal, width, minHeight = '200px',
      bgColor = '#FFF', marginTop = '3%', className = '', clickBgToClose = false, showCloseBtn = true
    } = this.props;
    const closeBtnDOM = showCloseBtn ? (
      <span className="close-btn"
        onClick={e => onCloseModal()}>
        x
      </span>
    ) : '';

    const transitionKey = isOpen ? 'modal-open' : 'modal-close';
    const sections = isOpen ? (
      <div className={"v-modal-container " + className}>
        <div className="v-modal-layout" ref={c => this._content = c} style={{width, minHeight, marginTop, outline: 'none'}} onKeyDown={this.handleKeyDown} tabIndex="-1">
          <header className="v-modal-header">
            <h5 className="title">{title}</h5>
            {closeBtnDOM}
          </header>
          <div className="v-modal-content">
            {children}
          </div>
        </div>
        <div className="section-mark" onClick={e => {
            if(clickBgToClose) onCloseModal()
          }}></div>
      </div>
    ) : (
      <span></span>
    );

    return (
      <TransitionGroup>
        <CSSTransition
          key={transitionKey}
          classNames="modal"
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
  bgColor: PropTypes.string,
  marginTop: PropTypes.any,
  minHeight: PropTypes.any,
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

export class ModalHelper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSetting: {
        title: '',
        isOpen: false,
        children: '',
        id: ''
      }
    };
  }
  setModal(modalSetting) {
    this.setState({
      modalSetting: Object.assign({}, modalSetting, {
        isOpen: typeof modalSetting.isOpen == 'undefined' ? true : modalSetting.isOpen
      })
    });
  }
  closeModal() {
    this.setState({
      modalSetting: {
        isOpen: false
      }
    });
  }
}

class ModalEntity extends ModalHelper {
  render() {
    const {topClassName, onCloseModal} = this.props;
    return (
      <Modal
        {...this.state.modalSetting}
        {...this.props}
        onCloseModal={onCloseModal || this.closeModal.bind(this)}>
        {this.props.children}
      </Modal>
    )
  }
}

let modalEntity = {};
function getModalEntityIdLen() {
  return Object.keys(modalEntity).length;
}

function CloseGlobalModal(modalId) {
  modalEntity[modalId].closeModal();
  delete modalEntity[modalId];
  function deleteModalNode() {
    let modalNode = document.getElementById(modalId);
    if(modalNode) modalNode.parentElement.removeChild(modalNode);
  }
  setTimeout(() => deleteModalNode(), 300);
}

function ShowGlobalModal(options) {
  let modalLen = getModalEntityIdLen();
  let defaultModalId = 'topModal' + modalLen;

  const {
    type, confirmText = '确定？', title, showFuncBtn = true, className,
    width = $UK.isMobile ? '90%' : 600, id, children, onClose,
    onConfirm
  } = options;

  let modalId = id || defaultModalId;

  let topModalDOM = document.getElementById(modalId);
  if(!topModalDOM) {
    topModalDOM = document.createElement('div');
    topModalDOM.id = modalId;
    topModalDOM.className = 'top-modal idx-' + modalLen;
    document.body.appendChild(topModalDOM);
  }
  let modalTMPL = null;

  let btnGroupDOM = showFuncBtn ? (
    <div className="btn-group">
      <span className="btn flat default" onClick={e => onClickBtn(false)}>取消</span>
      <span className="btn flat theme" onClick={e => onClickBtn(true)}>确定</span>
    </div>
  ) : null;

  switch (type) {
    case 'confirm':
      modalTMPL = (
        <div className="confirm-container">
          <div className="content">{confirmText}</div>
          {btnGroupDOM}
        </div>
      )
      break;
    default:
      modalTMPL = (
        <div className="global-modal-container">
          <div className="content">{children}</div>
          {btnGroupDOM}
        </div>
      )
  }
  function onClickBtn(confirm) {
    $GH.CallFunc(onConfirm)(confirm);
    CloseGlobalModal(modalId);
  }
  const modalWrapper = (
    <ModalEntity
      ref={_modalEntity => {
        if(!_modalEntity) return;
        modalEntity[modalId] = _modalEntity;
        modalEntity[modalId].setModal({
          isOpen: true,
          title,
          width
        })
      }}
      topClassName='top-modal-opend'
      className={className}
      onCloseModal={e => {
        $GH.CallFunc(onClose)();
        CloseGlobalModal(modalId);
      }}>
      {modalTMPL}
    </ModalEntity>
  )
  ReactDOM.render(
    modalWrapper,
    topModalDOM,
  );

  return modalId;
}

/**
 * 例子
 * ShowGlobalModal({
 *   type, confirmText = '确定？', title, width = 400, onConfirm
 * })
 */


export {
  ShowGlobalModal, CloseGlobalModal
};
