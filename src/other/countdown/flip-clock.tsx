/* eslint-disable react/no-multi-comp */

import React, { Component, PureComponent } from 'react';
import { Call, ToFixed, TimeFormat } from 'basic-helper';
import { Grid } from '../../core/grid';

interface FlipUnitContainerProps {
  digit: number | string;
  width: number;
  height: number;
  flipItemstyle?: React.CSSProperties;
  unit?: string;
}

const AnimatedCard = ({
  position, animation, digit, style
}) => (
  <div className={`flip-card ${position} ${animation}`} style={style}>
    <span className="count">{digit}</span>
  </div>
);

const StaticCard = ({ position, digit, style }) => (
  <div className={position} style={style}>
    <span className="count">{digit}</span>
  </div>
);

class FlipUnitContainer extends React.Component<FlipUnitContainerProps> {
  static defaultProps = {
    width: 140,
    height: 120,
  }

  preDigit: number | string = 0;

  shuffle = true;

  state = {
    preDigit: 0,
    shuffle: true
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.digit !== nextProps.digit) {
      this.preDigit = this.props.digit;
      this.shuffle = !this.shuffle;
    }
    return true;
  }

  render() {
    const {
      digit, unit, width = 140, height = 120, flipItemStyle
    } = this.props;
    // const { shuffle, preDigit } = this.state;
    const { shuffle, preDigit } = this;

    let previousDigit: number | string = +preDigit || 0;
    let currentDigit: number | string = +digit;
    // let previousDigit = +FlipDigitCache[unit] || 0;

    if (unit !== 'hour') {
      previousDigit = previousDigit === -1 ? 59 : previousDigit;
      previousDigit = previousDigit === 60 ? '00' : previousDigit;
    } else {
      previousDigit = previousDigit === -1 ? 23 : previousDigit;
    }

    if (+currentDigit < 10) {
      currentDigit = `0${currentDigit}`;
    }
    if (previousDigit !== '00' && previousDigit < 10) {
      previousDigit = `0${previousDigit}`;
    }

    const digit1 = shuffle ? previousDigit : currentDigit;
    const digit2 = !shuffle ? previousDigit : currentDigit;

    const animation1 = shuffle ? 'fold' : 'unfold';
    const animation2 = !shuffle ? 'fold' : 'unfold';

    const scaleStyle = {
      height, width, fontSize: height / 1.3
    };
    const styleForAnimate = {
      ...flipItemStyle,
      height: height / 2,
      width,
    };

    return (
      <div className="flip-unit-container" style={scaleStyle}>
        <StaticCard
          position="before"
          style={flipItemStyle}
          digit={currentDigit}/>
        <StaticCard
          position="now"
          style={flipItemStyle}
          digit={previousDigit}/>
        <AnimatedCard
          style={styleForAnimate}
          position="first"
          digit={digit1}
          animation={animation1}/>
        <AnimatedCard
          style={styleForAnimate}
          position="second"
          digit={digit2}
          animation={animation2}/>
      </div>
    );
  }
}

interface CountdownProps {
  /** 时间到 0 的时候触发的回调 */
  onTimeout: () => void;
  /** 倒计时开始时间 */
  start: number;
  /** 每一个 flip 的宽度 */
  width?: number;
  /** 每一个 flip 的高度 */
  height?: number;
  className: string;
  /** 给每一个 flip 的 style */
  flipItemstyle?: React.CSSProperties;
  /** 需要广播的时间节点 */
  countdownNotifyTimer?: number;
  /** 广播的时间节点触发的回调 */
  onCountdownNotify?: () => void;
}

export default class Countdown extends Component<CountdownProps, {
  isTimerStart: boolean;
  countdown: number;
}> {
  static defaultProps = {
    width: 140,
    height: 120,
  };

  jumpElem

  interval

  // isTimerStart = false;
  constructor(props) {
    super(props);
    this.state = {
      isTimerStart: false,
      countdown: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isReceiveNewProps = this.props !== nextProps;
    const isNewCount = this.state.countdown !== nextState.countdown;
    const isChangeTimerStatus = this.state.isTimerStart !== nextState.isTimerStart;
    // if(isReceiveNewProps) {
    //   this.clearTimer();
    // }
    return isNewCount || isReceiveNewProps || isChangeTimerStatus;
  }

  componentDidMount() {
    this.startCountdown();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.start != prevProps.start || !this.state.isTimerStart) {
      this.clearTimer();
      this.startCountdown();
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  startCountdown() {
    const { start } = this.props;
    if (this.state.isTimerStart || start === 0) return;
    this.clearTimer();
    this.startTimer();
  }

  setJumpElemCount(timeObj) {
    if (!this.jumpElem) return;

    this.jumpElem.innerHTML = `${timeObj.hour}:${timeObj.min}:${timeObj.sec}` || 0;
  }

  clearTimer() {
    // this.isTimerStart = false;
    this.interval && clearInterval(this.interval);
    this.interval = null;
    this.setState({
      isTimerStart: false
    });
  }

  startTimer() {
    if (this.state.isTimerStart) return;
    const {
      start,
      countdownNotifyTimer,
      onCountdownNotify, onTimeout
    } = this.props;
    let countdown = start - 1;
    // this.isTimerStart = true;
    this.setState({
      isTimerStart: true,
      countdown
    });
    this.interval = setInterval(() => {
      countdown--;
      this.setState({
        countdown: (countdown < 0) ? 0 : countdown
      });
      if (countdownNotifyTimer && countdown === +countdownNotifyTimer) {
        Call(onCountdownNotify, countdown);
      }
      if (countdown === -1) {
        onTimeout();
        this.clearTimer();
        // clearInterval(oneRound);
        // this.setState({
        //   isTimerStart: false,
        //   isTimeout: true
        // });
      }
    }, 1000);
  }

  render() {
    const {
      width, height, countdownNotifyTimer, onCountdownNotify,
      onTimeout, flipItemStyle, className, ...other
    } = this.props;
    const { countdown } = this.state;
    const timeObj = TimeFormat(countdown);

    this.setJumpElemCount(timeObj);
    // const hasCountdown = countdown != -1;

    const container = (
      <section className={`flip-clock ${className || ''}`}>
        <Grid container>
          {
            Object.keys(timeObj).map((unit, idx) => {
              const currTime = timeObj[unit];
              return (
                <Grid key={unit} {...other}>
                  <FlipUnitContainer
                    unit={unit}
                    flipItemStyle={flipItemStyle}
                    width={width}
                    height={height}
                    digit={currTime} />
                </Grid>
              );
            })
          }
        </Grid>
      </section>
    );

    return container;
  }
}
