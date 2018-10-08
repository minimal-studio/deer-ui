import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';

import { Call, GenerteID } from 'basic-helper';
import { Provider, connect } from 'unistore/react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import ModalHelper from './modal-helper';
import Modal from './modal';
import setDOMById from '../set-dom';
import {
  windowManagerActions,
  windowManagerStore
} from './window-manager';

let connectedStore;
const selector = state => state;

class ModalEntity extends ModalHelper {
  componentDidMount() {
    // console.log(this)
    this.setModal({
      ...this.props,
      isOpen: true,
    });
  }
  render() {
    const {onCloseModal} = this.props;
    return (
      <Modal
        {...this.state.modalSetting}
        {...this.props}
        onCloseModal={onCloseModal || this.closeModal.bind(this)}>
        {this.props.children}
      </Modal>
    );
  }
}

const ModalsManager = connect(selector, windowManagerActions)((props) => {
  connectedStore = props;
  const {sectionsList, closeWindow, selectWindow, sectionsQueue} = props;
  const sections = Object.keys(sectionsList).map(key => {
    const currItem = sectionsList[key];
    const sectionId = currItem.id;
    const currSectionIdx = sectionsQueue.indexOf(sectionId);
    return (
      <CSSTransition
        key={key}
        classNames="modal"
        timeout={300}>
        <ModalEntity
          idx={currSectionIdx}
          sectionId={sectionId}
          selectWindow={selectWindow}
          {...currItem} onCloseModal={e => closeWindow(sectionId)}>
          {currItem.children}
        </ModalEntity>
      </CSSTransition>
    );
  });
  return (
    <div className="modals-render">
      <TransitionGroup
        component={null}>
        {sections}
      </TransitionGroup>
    </div>
  );
});

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
  connectedStore.closeWindow(entityId);
}

function ShowGlobalModal(options) {

  let gm = window.$UKE.getUkeKeyMap;

  const {
    type, confirmText = gm('确定') + '?', title, showFuncBtn = true,
    width = window.$UKE.isMobile ? '90%' : 600, id, children, draggable,
    onConfirm
  } = options;

  let entityId = id || GenerteID();
  options.id = entityId;

  let modalTMPL = null;

  let btnGroupDOM = showFuncBtn ? (
    <div className="btn-group">
      <span className="btn flat default" onClick={e => onClickBtn(false)}>{gm('取消')}</span>
      <span className="btn flat theme" onClick={e => onClickBtn(true)}>{gm('确定')}</span>
    </div>
  ) : null;

  switch (type) {
  case 'confirm':
    modalTMPL = (
      <div className="confirm-container">
        <div className="content">{confirmText}</div>
        {btnGroupDOM}
      </div>
    );
    break;
  default:
    modalTMPL = (
      <div className="global-modal-container">
        <div className="content">{children}</div>
        {btnGroupDOM}
      </div>
    );
  }
  function onClickBtn(confirm) {
    Call(onConfirm, confirm);
    CloseGlobalModal(entityId);
  }
  if(draggable) {
    connectedStore.openWindow(options);
  } else {
    let entityDOM = setDOMById(entityId, 'top-modal idx-' + entityId);
    const entityWrapper = (
      <ModalEntity
        ref={_Entity => {
          if(!_Entity) return;
          Entity[entityId] = _Entity;
          Entity[entityId].setModal({
            isOpen: true,
            title,
            width
          });
        }}
        {...options}
        onCloseModal={e => {
          CloseGlobalModal(entityId);
        }}>
        {modalTMPL}
      </ModalEntity>
    );
    ReactDOM.render(
      entityWrapper,
      entityDOM,
    );
  }
  return entityId;
}

let modalsManagerContainer = setDOMById('ModalsManager', 'modals-manager');
ReactDOM.render(
  <Provider store={windowManagerStore}>
    <ModalsManager/>
  </Provider>,
  modalsManagerContainer,
);

/**
 * 例子
 * ShowGlobalModal({
 *   type, confirmText = '确定？', title, width = 400, onConfirm
 * })
 */

export {
  ShowGlobalModal, CloseGlobalModal
};
