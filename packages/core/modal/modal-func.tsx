/* eslint-disable prefer-const */
import React from 'react';

import { Call, GenerteID } from '@mini-code/base-func';

import { $T_IN, queryIsMobile, loadPlugin } from '../utils';
import { Children } from '../utils/props';
import { ModalOptions } from './modal';
import { setupModal } from './modal-setup';


const CloseModal = (modalID: ModalID) => {
  if (!modalID) return;
  setupModal().then((modalManagerEntity) => {
    modalManagerEntity.closeWindow(modalID);
  });
};
const CloseAllModal = () => {
  setupModal().then((modalManagerEntity) => {
    modalManagerEntity.closeAllWindow();
  });
};

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

const getDefaultOptions = (options): ShowModalParams => {
  const { width, type } = options;
  const isMobile = queryIsMobile();
  return {
    className: 'fixed',
    topClassName: 'top-modal-opend',
    showFuncBtn: false,
    marginTop: isMobile ? '0' : undefined,
    type: isMobile ? 'side' : 'normal',
    modalType: isMobile ? 'side' : 'normal',
    position: isMobile ? 'bottom' : undefined,
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

/**
 * Show Global Modal
 */
function ShowModal(params: ShowModalParams): ModalID {
  /** @type {ShowModalParams} */
  let options = { ...params };
  let {
    type, confirmText = `${$T_IN('确定')}?`, showFuncBtn,
    id, children,
    onConfirm, needHeader
  } = options;
  const _showFuncBtn = type === 'confirm' || showFuncBtn;

  const entityId: ModalID = id || GenerteID();
  options.id = entityId;

  let modalTMPL;

  const closeCurrModal = () => {
    CloseModal(entityId);
  };

  const onClickBtn = (confirm) => {
    confirm && Call(onConfirm, confirm);
    closeCurrModal();
  };

  const btnGroupDOM = _showFuncBtn && (
    <div className="btn-group">
      <span className="btn default" onClick={(e) => onClickBtn(false)}>{$T_IN('取消')}</span>
      <span className="btn theme" onClick={(e) => onClickBtn(true)}>{$T_IN('确定')}</span>
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
      options = {
        modalType: 'side',
        clickBgToClose: true,
        needMaxBtn: false,
        needMinBtn: false,
        ...options
      };
      modalTMPL = (
        <div className="global-modal-container">
          <div className="content">{loadPlugin(children, {
            close: closeCurrModal
          })}</div>
          {btnGroupDOM}
        </div>
      );
      break;
    default:
      modalTMPL = (
        <div className="global-modal-container">
          <div className="content">{loadPlugin(children, {
            close: closeCurrModal
          })}</div>
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

  /** 用于检查是否已经渲染了最外层 div */
  setupModal().then((modalManagerEntity) => {
    modalManagerEntity.openWindow(options);
  });
  return entityId;
}

const ShowGlobalModal = ShowModal;
const CloseGlobalModal = CloseModal;

export {
  ShowModal, CloseModal,
  ShowGlobalModal, CloseGlobalModal, CloseAllModal
};
