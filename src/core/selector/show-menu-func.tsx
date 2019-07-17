import React, {Component, PureComponent} from 'react';

import MenuGroup from './menu-selector';
import {ShowGlobalModal, CloseGlobalModal} from '../modal/modal-func';

let menuId;

export function ShowGlobalMenu(options) {
  let entityWrapper = (
    <MenuGroup {...options} onClose={e => CloseMenu()}/>
  );
  menuId = ShowGlobalModal({
    modalLayoutDOM: entityWrapper,
    className: 'uke-dropdown-menu',
    topClassName: 'none',
    animateType: 'drop-menu',
    clickBgToClose: true,
    needMask: false,
    duration: 200,
    Header: false,
  });
}
export function CloseMenu() {
  CloseGlobalModal(menuId);
}
