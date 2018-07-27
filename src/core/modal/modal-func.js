import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {CallFunc} from 'basic-helper';

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

let Entity = {};
function getEntityIdLen() {
  return Object.keys(Entity).length;
}

function CloseGlobalModal(entityId) {
  if(!entityId) return;
  Entity[entityId] && Entity[entityId].closeModal();
  delete Entity[entityId];
  function deleteModalNode() {
    let modalNode = document.getElementById(entityId);
    if(modalNode) modalNode.parentElement.removeChild(modalNode);
  }
  setTimeout(() => deleteModalNode(), 300);
}

function ShowGlobalModal(options) {
  let modalLen = getEntityIdLen();
  let defaultModalId = 'topModal' + modalLen;

  const {
    type, confirmText = '确定？', title, showFuncBtn = true,
    width = $UKE.isMobile ? '90%' : 600, id, children,
    onConfirm
  } = options;

  let entityId = id || defaultModalId;

  let entityDOM = setDOMById(entityId, 'top-modal idx-' + modalLen);
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
    CallFunc(onConfirm)(confirm);
    CloseGlobalModal(entityId);
  }
  const entityWrapper = (
    <ModalEntity
      ref={_Entity => {
        if(!_Entity) return;
        Entity[entityId] = _Entity;
        Entity[entityId].setModal({
          isOpen: true,
          title,
          width
        })
      }}
      {...options}
      onCloseModal={e => {
        CloseGlobalModal(entityId);
      }}>
      {modalTMPL}
    </ModalEntity>
  )
  ReactDOM.render(
    entityWrapper,
    entityDOM,
  );

  return entityId;
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
