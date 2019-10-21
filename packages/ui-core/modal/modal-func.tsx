/* eslint-disable prefer-const */
import React from 'react';
import ReactDOM from 'react-dom';

import { Call, GenerteID } from 'basic-helper';
import { Provider, connect } from 'unistore/react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { $T_UKE, getIsMobile } from '../config';
import { Icon } from '../icon';
import ModalHelper from './modal-helper';
import Modal, { ModalOptions } from './modal';
import setDOMById from '../set-dom';
import { Children } from '../utils/props';
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
  const sections = Array.isArray(sectionsQueue) && sectionsQueue.map((key) => {
    const currItem = sectionsList[key];
    if (!currItem) return null;
    const { id } = currItem;
    const animateType = Modal.animateTypeFilter(currItem);
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
          minSecQueue.map((minSectionId) => {
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

const Entity = {};

function CloseModal(modalID: ModalID) {
  if (!modalID) return;
  connectedStore.closeWindow(modalID);
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
    side: 400
  };
  return widthConfig[modalType] || 600;
};

const getDefaultOptions = (options) => {
  const { width, type } = options;
  const isMobile = getIsMobile();
  // const { isMobile } = window.$UKE;
  return {
    className: 'fixed',
    topClassName: 'top-modal-opend',
    showFuncBtn: false,
    marginTop: isMobile ? '0' : undefined,
    width: width || (isMobile ? '90%' : getModalDefaultWidth(type))
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
export type ModalID = string | number;
export interface ShowModalParams extends ModalOptions {
  /** modalType */
  type?: ModalOptions['modalType'] | 'confirm';
  /** 当 type === confirm 时渲染的内容 */
  confirmText?: Children;
  /** 当 type === confirm 时，点击确认按钮的回调 */
  onConfirm?;
  /** 是否显示「确定、取消」按钮 */
  showFuncBtn?: boolean;
  /** 是否需要 header */
  needHeader?: boolean;
}

let hasModalContainer = false;
const checkModalContainer = () => {
  if (!hasModalContainer) {
    hasModalContainer = true;
    const modalsManagerContainer = setDOMById('ModalsManager', 'modals-manager');
    ReactDOM.render(
      <Provider store={windowManagerStore}>
        <ModalsManager/>
      </Provider>,
      modalsManagerContainer,
    );
  }
};
/**
 * @param {ShowModalParams} params
 */
function ShowModal(params: ShowModalParams): ModalID {
  /** 用于检查是否已经渲染了最外层 div */
  checkModalContainer();
  /** @type {ShowModalParams} */
  let options = Object.assign({}, params);
  let {
    type, confirmText = `${$T_UKE('确定')}?`, showFuncBtn,
    id, children,
    onConfirm, needHeader
  } = options;
  const _showFuncBtn = type === 'confirm' || showFuncBtn;

  const entityId: ModalID = id || GenerteID();
  options.id = entityId;

  let modalTMPL;

  function onClickBtn(confirm) {
    confirm && Call(onConfirm, confirm);
    CloseModal(entityId);
  }

  const btnGroupDOM = _showFuncBtn && (
    <div className="btn-group">
      <span className="btn flat default" onClick={e => onClickBtn(false)}>{$T_UKE('取消')}</span>
      <span className="btn flat theme" onClick={e => onClickBtn(true)}>{$T_UKE('确定')}</span>
    </div>
  );

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

  options.children = modalTMPL;
  options = {
    ...getDefaultOptions(options),
    ...options,
    needHeader,
  };
  connectedStore.openWindow(options);

  return entityId;
}

const ShowGlobalModal = ShowModal;
const CloseGlobalModal = CloseModal;


const ShowModalAPI: React.SFC<ShowModalParams> = props => (
  <div></div>
);

export { ShowModalAPI };

export {
  ShowModal, CloseModal,
  ShowGlobalModal, CloseGlobalModal, CloseAllModal
};
