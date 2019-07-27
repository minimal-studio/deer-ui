import React from 'react';

import { UkeComponent } from '../utils/uke-component';
import { getScreenWidth } from '../utils/screen';

export interface DragPanelClassProps {
  topLimit?: number;
}

// let SCREEN_WIDTH = document.documentElement.clientWidth;

export class DragPanelClass<P extends DragPanelClassProps> extends UkeComponent<P> {

  drapElemInfo: {
    isDrapStart: boolean;
    dragElem: HTMLElement | undefined;
    dragOriginX: number;
    dragOriginY: number;
    elemOrigonX: number;
    elemOriginY: number;
  } = {
    isDrapStart: false,
    dragElem: undefined,
    dragOriginX: 0,
    dragOriginY: 0,
    elemOrigonX: 0,
    elemOriginY: 0
  };

  getScreenWidth = getScreenWidth;

  isSetPosition

  setLayoutInitPosition = (elem: HTMLElement) => {
    if (!this.isSetPosition) {
      this.isSetPosition = true;
      // elem.style.left = (this.getScreenWidth() - elem.offsetWidth) / 2 + 'px';
      // elem.style.top = '100px';
      elem.style.transform = `translate(${(this.getScreenWidth() - elem.offsetWidth) / 2}px, 100px)`;
    }
  }

  dragStart(event, elem) {
    const elemTransform = elem.style.transform;
    const arr = elemTransform.split(',');
    const [translateX, translateY] = arr.map(item => item.replace(/[^\d.]/g, ''));
    this.drapElemInfo = {
      isDrapStart: true,
      dragElem: elem,
      dragOriginX: event.clientX,
      dragOriginY: event.clientY,
      elemOrigonX: +translateX || 0,
      elemOriginY: +translateY || 0
    };
    this.mouseMoving();
    event.stopPropagation();
  }

  mouseMoving() {
    document.addEventListener('mousemove', this.setContainerPosition, false);
    document.addEventListener('mouseup', this.dragEnd, false);
  }

  mouseMoved() {
    document.removeEventListener('mousemove', this.setContainerPosition, false);
    document.removeEventListener('mouseup', this.dragEnd, false);
  }

  setContainerPosition = (event) => {
    if (!this.drapElemInfo.isDrapStart) return;
    const { topLimit = 0 } = this.props;
    const {
      dragElem, dragOriginX, dragOriginY, elemOrigonX, elemOriginY
    } = this.drapElemInfo;
    if (dragElem) {
      const leftOffset = event.clientX - dragOriginX + elemOrigonX;
      const topOffset = event.clientY - dragOriginY + elemOriginY;
      const _screenWidth = getScreenWidth() - dragElem.offsetWidth;
      let setLeftOffset = leftOffset;
      let setTopOffset = topOffset;
      if (leftOffset < 0) {
        setLeftOffset = 0;
      } else if (leftOffset > _screenWidth) {
        setLeftOffset = _screenWidth;
      }
      if (setTopOffset < topLimit) {
        setTopOffset = topLimit;
      }
      dragElem.style.transform = `translate(${setLeftOffset}px, ${setTopOffset}px)`;
      // dragElem.style.transform = setTopOffset + "px";
    }
  }

  dragEnd = (event) => {
    if (!this.drapElemInfo.isDrapStart) return;
    this.drapElemInfo = {
      isDrapStart: false,
      dragElem: undefined,
      dragOriginX: 0,
      dragOriginY: 0,
      elemOrigonX: 0,
      elemOriginY: 0
    };
    this.mouseMoved();
  }
}
