import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import ModalHelper from './modal-helper';
import Modal from './modal';

import setDOMById from '../set-dom';

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

  let topModalDOM = setDOMById(modalId, 'top-modal idx-' + modalLen);
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
