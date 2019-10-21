import React, { Component, PureComponent } from 'react';

import RandomDisplayNember from './animate-ball';

const splitStr = ',';

export interface BallProps {
  openCode?: string;
  animate?: boolean;
  numberRange?: number[];
  animateTimer?: number;
  activeFilter?: string;
  extendTxt?: string;
  isOpening?: boolean;
  size?: string;
}

export class Ball extends Component<BallProps, {
  openedInfo: {};
  openCodeLen: number;
}> {
  static defaultProps = {
    openCode: '?????',
    animateTimer: 300,
    numberRange: [0, 9],
  }

  animateBallRefs

  timer

  constructor(props) {
    super(props);
    const { openCode } = props;
    const openArr = this.getOpenCodeArr(openCode);
    this.state = {
      openCodeLen: openArr.length,
      openedInfo: {}
    };
    this.animateBallRefs = {};
  }

  hasSplit = str => str.indexOf(splitStr) !== -1

  getOpenCodeArr(openCode) {
    return this.hasSplit(openCode) ? openCode.split(splitStr) : openCode.split('');
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.isOpening !== nextProps.isOpening || (!/\?+/.test(nextProps.openCode) && nextProps.openCode !== this.props.openCode)) {
      this.openCodeAnimate(!nextProps.isOpening, nextProps);
    }
    return true;
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  clearTimeout() {
    this.timer && clearTimeout(this.timer);
    this.timer = null;
  }

  openCodeAnimate(isOpened, props) {
    const { openCode, animateTimer } = props || this.props;

    const { openedInfo } = this.state;
    const openCodeArr = this.getOpenCodeArr(openCode);
    let openIdx = 0;

    const setOpenCodeIdx = (idx) => {
      openedInfo[idx] = isOpened;
      this.setState({
        openedInfo
      });
      this.clearTimeout();
      this.timer = setTimeout(() => {
        if (openIdx >= openCodeArr.length) return;
        setOpenCodeIdx(openIdx);
      }, animateTimer);
      openIdx++;
    };
    setOpenCodeIdx(openIdx);
  }

  render() {
    const {
      openCode, size, animate = false, activeFilter = '', extendTxt = '',
      numberRange
    } = this.props;

    const extendTxtArr = this.hasSplit(extendTxt) ? extendTxt.split(splitStr) : extendTxt;

    const { openCodeLen, openedInfo } = this.state;
    const openCodeArr = this.getOpenCodeArr(openCode);
    const ballClass = size ? `${size} ball` : 'ball';

    const activeFilterArr = activeFilter.split('');

    const ballGroup = openCodeArr.map((_ball, _idx) => {
      const isOpening = !openedInfo[_idx];
      const currFilter = activeFilterArr[_idx] || '';
      const isActive = currFilter == 'o';
      const ballID = `ball-${_ball}`;

      const extendTxtDOM = (
        <div key={_idx} className="extend-txt">{extendTxtArr[_idx]}</div>
      );

      if (animate) {
        return (
          <div
            id={ballID}
            key={_idx}
            className={`${ballClass}${isActive ? ' s' : ''}`}>
            <RandomDisplayNember
              activeNumb={openCodeArr[_idx]}
              numberRange={numberRange || []}
              animating={isOpening}/>
            {extendTxtDOM}
          </div>
        );
      }
      return (
        <div
          id={ballID}
          className={`${ballClass} b${isActive ? ' s' : ''}`} key={_idx}>
          {_ball}
        </div>
      );
    });

    return (
      <div className="ball-group">
        {ballGroup}
      </div>
    );
  }
}
