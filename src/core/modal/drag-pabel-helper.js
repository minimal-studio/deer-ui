import React from 'react';
import PropTypes from 'prop-types';

// let SCREEN_WIDTH = document.documentElement.clientWidth;
function getScreenWidth() {
  return document.documentElement.clientWidth;
}

export class DragPanelClass extends React.Component {
  static propTypes = {
    topLimit: PropTypes.number,
  };
  static defaultProps = {
    topLimit: 0
  };
  drapElemInfo = {
    isDrapStart: false,
    dragElem: null,
    dragOriginX: 0,
    dragOriginY: 0,
    elemOrigonX: 0,
    elemOriginY: 0
  };
  getScreenWidth = getScreenWidth;
  dragStart(event, elem) {
    this.drapElemInfo = {
      isDrapStart: true,
      dragElem: elem,
      dragOriginX: event.clientX,
      dragOriginY: event.clientY,
      elemOrigonX: elem.offsetLeft,
      elemOriginY: elem.offsetTop
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
    const { dragElem, dragOriginX, dragOriginY, elemOrigonX, elemOriginY } = this.drapElemInfo;
    const leftOffset = event.clientX - dragOriginX + elemOrigonX;
    const topOffset = event.clientY - dragOriginY + elemOriginY;
    const _screenWidth = getScreenWidth() - dragElem.offsetWidth;
    let setLeftOffset = leftOffset;
    let setTopOffset = topOffset;
    if(leftOffset < 0) {
      setLeftOffset = 0;
    } else if(leftOffset > _screenWidth) {
      setLeftOffset = _screenWidth;
    }
    if(setTopOffset < topLimit) {
      setTopOffset = topLimit;
    }
    dragElem.style.left = setLeftOffset + "px";
    dragElem.style.top = setTopOffset + "px";
  }
  dragEnd = (event) => {
    if (!this.drapElemInfo.isDrapStart) return;
    this.drapElemInfo = {
      isDrapStart: false,
      dragElem: null,
      dragOriginX: 0,
      dragOriginY: 0,
      elemOrigonX: 0,
      elemOriginY: 0
    };
    this.mouseMoved();
  }
}