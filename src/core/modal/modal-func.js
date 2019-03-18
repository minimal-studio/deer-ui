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
    const { children, onCloseModal } = this.props;
    return (
      <Modal
        {...this.state.modalSetting}
        {...this.props}
        onCloseModal={onCloseModal || this.closeModal.bind(this)}>
        {children}
      </Modal>
    );
  }
}

const ModalsManager = connect(selector, windowManagerActions)((props) => {
  connectedStore = props;
  const {
    sectionsList, closeWindow, selectWindow, sectionsQueue,
    minimizeWindow, minSecQueue
  } = props;
  const sections = Array.isArray(sectionsQueue) && sectionsQueue.map(key => {
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
          minimizeWindow={minimizeWindow}
          animation={false}
          isOpen
          {...currItem}
          onCloseModal={e => closeWindow(sectionId)} />
      </CSSTransition>
    );
  });
  return (
    <div className="modals-render">
      <TransitionGroup
        component={null}>
        {sections}
      </TransitionGroup>
      <div className="min-container">
        {
          minSecQueue.map(minSectionId => {
            const currItem = sectionsList[minSectionId];
            return (
              <div key={minSectionId}
                className="min-item" onClick={e => selectWindow(minSectionId)}>
                {currItem.title}
              </div>
            );
          })
        }
      </div>
    </div>
  );
});

let Entity = {};
function getEntityIdLen() {
  return Object.keys(Entity).length;
}

function CloseModal(entityId) {
  if(!entityId) return;
  // Entity[entityId] && Entity[entityId].closeModal();
  // delete Entity[entityId];
  // function deleteModalNode() {
  //   let modalNode = document.getElementById(entityId);
  //   if(modalNode) modalNode.parentElement.removeChild(modalNode);
  // }
  // setTimeout(() => deleteModalNode(), 300);
  connectedStore.closeWindow(entityId);
}
function CloseAllModal() {
  connectedStore.closeAllWindow();
}

const getModalDefaultWidth = (modalType) => {
  let width = 600;
  switch (modalType) {
  case 'confirm':
    width = 300;
    break;
  default:
    break;
  }
  return width;
};

const getDefaultOptions = (options) => ({
  className: 'fixed',
  topClassName: 'top-modal-opend',
  showFuncBtn: false,
  width: window.$UKE.isMobile ? '90%' : getModalDefaultWidth(options.type)
});

function ShowModal(options) {

  let gm = window.$UKE.getUkeKeyMap;

  let {
    type, confirmText = gm('确定') + '?', title, showFuncBtn,
    // width = window.$UKE.isMobile ? '90%' : 600, 
    id, children,
    onConfirm, needHeader
  } = options;
  const _showFuncBtn = type == 'confirm' || showFuncBtn;

  let entityId = id || GenerteID();
  options.id = entityId;

  let modalTMPL = null;

  let btnGroupDOM = _showFuncBtn ? (
    <div className="btn-group">
      <span className="btn flat default" onClick={e => onClickBtn(false)}>{gm('取消')}</span>
      <span className="btn flat theme" onClick={e => onClickBtn(true)}>{gm('确定')}</span>
    </div>
  ) : null;

  switch (type) {
  case 'confirm':
    needHeader = false;
    modalTMPL = (
      <div className="confirm-container">
        <div className="content">
          {
            React.isValidElement(confirmText) ? confirmText : (
              <h2 className="text-center">{confirmText}</h2>
            )
          }
        </div>
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
    confirm && Call(onConfirm, confirm);
    CloseModal(entityId);
  }

  options.children = modalTMPL;
  options = {
    ...getDefaultOptions(options),
    ...options,
    needHeader,
  };
  connectedStore.openWindow(options);
  return entityId;
}

let modalsManagerContainer = setDOMById('ModalsManager', 'modals-manager');
ReactDOM.render(
  <Provider store={windowManagerStore}>
    <ModalsManager/>
  </Provider>,
  modalsManagerContainer,
);

const ShowGlobalModal = ShowModal;
const CloseGlobalModal = CloseModal;

export {
  ShowModal, CloseModal,
  ShowGlobalModal, CloseGlobalModal, CloseAllModal
};
