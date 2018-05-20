import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import RandomDisplayNember from './animate-ball';
// import RandomDisplayNember from './random.ball';

export default class Ball extends Component {
  constructor(props) {
    super(props);
    const {openCode = '?????'} = props;
    const openArr = this.getOpenCodeArr(openCode);
    this.state = {
      openCodeLen: openArr.length,
      openedInfo: {}
    }
    this.animateBallRefs = {};
  }
  getOpenCodeArr(openCode) {
    return /\,/.test(openCode) ? openCode.split(',') : openCode.split('')
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.isOpening != nextProps.isOpening || (!/\?+/.test(nextProps.openCode) && nextProps.openCode !== this.props.openCode)) {
      this.openCodeAnimate(!nextProps.isOpening, nextProps)
    }
  }
  componentWillUnmount() {
    this.clearTimeout()
  }
  clearTimeout(){
    this.timer && clearTimeout(this.timer);
    this.timer = null
  }
  openCodeAnimate(isOpened, props) {
    const {openCode, animateTimer = 300} = props || this.props;
    let {openedInfo} = this.state;
    const self = this;
    let openCodeArr = this.getOpenCodeArr(openCode);
    let openIdx = 0;
    function setOpenCodeIdx(idx) {
      openedInfo[idx] = isOpened;
      self.setState({
        openedInfo: openedInfo
      });
      self.clearTimeout();
      self.timer = setTimeout(() => {
        if(openIdx >= openCodeArr.length) return;
        setOpenCodeIdx(openIdx);
      }, animateTimer);
      openIdx++;
    }
    setOpenCodeIdx(openIdx);
  }
  render() {
    const {
      openCode = '?????', size, animate = false, activeFilter = '', extendTxt = '',
      numberRange = [0, 9]
    } = this.props;

    const extendTxtArr = /\,/.test(extendTxt) ? extendTxt.split(',') : extendTxt;

    const {openCodeLen, openedInfo} = this.state;
    let openCodeArr = this.getOpenCodeArr(openCode);
    let ballClass = size ? size + ' ball' : 'ball';

    let activeFilterArr = activeFilter.split('');

    const ballGroup = openCodeArr.map((_ball, _idx) => {
      let isOpening = !openedInfo[_idx];
      let currFilter = activeFilterArr[_idx] || '';
      let isActive = currFilter == 'o';
      let ballID = `ball-${_ball}`;

      let extendTxtDOM = (
        <div key={_idx} className="extend-txt">{extendTxtArr[_idx]}</div>
      )

      {/* <div className={ballClass + ' flip-container' + (isOpening ? '' : ' flipper active') + (isActive ? ' s' : '')} key={_idx}>
        <div className="front">
          <RandomDisplayNember
            ref={animateBall => {
              if(!!animateBall && !this.animateBallRefs[_idx]) this.animateBallRefs[_idx] = animateBall;
            }}
            index={_idx}
            numberRange={numberRange}
            isStart={isOpening}/>
        </div>
        <div className="back">{_ball}</div>
        {extendTxtDOM}
      </div> */}
      if(animate) {
        return (
          <div
            id={ballID}
            key={_idx}
            className={ballClass + '' + (isActive ? ' s' : '')}>
            <RandomDisplayNember
              activeNumb={openCodeArr[_idx]}
              index={_idx}
              numberRange={numberRange}
              animating={isOpening}/>
            {extendTxtDOM}
          </div>
        )
      } else {
        return (
          <div
            id={ballID}
            className={ballClass + ' b' + (isActive ? ' s' : '')} key={_idx}>
            {_ball}
          </div>
        )
      }
    });

    return (
      <div className="ball-group">
        {ballGroup}
      </div>
    )
  }
}
Ball.propTypes = {
  openCode: PropTypes.string.isRequired,
  animate: PropTypes.bool,
  numberRange: PropTypes.array,
  animateTimer: PropTypes.number,
  activeFilter: PropTypes.string,
  extendTxt: PropTypes.string,
  isOpening: PropTypes.bool,
  size: PropTypes.string
};
