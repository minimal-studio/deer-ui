import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';

import { Call, GenerteID } from 'basic-helper';
import { Provider, connect } from 'unistore/react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Icon } from '../icon';
import ModalHelper from './modal-helper';
import Modal, { animateTypeFilter } from './modal';
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
    if(!currItem) return;
    const { id } = currItem;
    const animateType = animateTypeFilter(currItem);
    const sectionId = id;
    const currSectionIdx = sectionsQueue.indexOf(sectionId);
    return (
      <CSSTransition
        key={key}
        classNames={animateType}
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
                className="min-item">
                <span className="title" onClick={e => selectWindow(minSectionId)}>{currItem.title}</span>
                <Icon n="close" onClick={e => closeWindow(minSectionId)} />
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
  connectedStore.closeWindow(entityId);
}
function CloseAllModal() {
  connectedStore.closeAllWindow();
}

/**
 * 给对应的 type 的 modal 返回默认的 width
 * @param {string} modalType modal 的类型
 */
const getModalDefaultWidth = (modalType) => {
  const widthConfig = {
    confirm: 300,
    'side': 400
  };
  return widthConfig[modalType] || 600;
};

const getDefaultOptions = (options) => {
  const { width, type } = options;
  const { isMobile } = window.$UKE;
  return {
    className: 'fixed',
    topClassName: 'top-modal-opend',
    showFuncBtn: false,
    marginTop: isMobile ? '0' : undefined,
    width: width ? width : isMobile ? '90%' : getModalDefaultWidth(type)
  };
};

// const generteID = (obj) => {
//   let keyStr;
//   try {
//     keyStr = JSON.stringify(obj);
//     // keyStr.split(0, 32);
//   } catch(e) {
//     console.log(e);
//   }
//   return btoa(unescape(encodeURIComponent(keyStr)));
// };

function ShowModal(options) {

  let gm = window.$UKE.getUkeKeyMap;

  let {
    type, confirmText = gm('确定') + '?', title, showFuncBtn,
    // width = window.$UKE.isMobile ? '90%' : 600, 
    id, children, position = 'right',
    onConfirm, needHeader
  } = options;
  const _showFuncBtn = type == 'confirm' || showFuncBtn;

  // let entityId = id || generteID(children);
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
  case 'side':
    options = Object.assign({}, {
      modalType: 'side',
      clickBgToClose: true,
      needMaxBtn: false,
      needMinBtn: false,
    }, options);
    modalTMPL = (
      <div className="global-modal-container">
        <div className="content">{children}</div>
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
