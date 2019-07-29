import React, { Component, PureComponent } from 'react';
import { Call, ToFixed, TimeFormat } from 'basic-helper';

import CountdownBg from './countdown-svg-bg';

const timeTitleMapper = {
  hour: '时',
  min: '分',
  sec: '秒'
};

interface CountdownProps {
  start: number;
  freq: number;
  onTimeout: () => void;
  needBg?: boolean;
  needProgress?: boolean;
  jumpClass?: string;
  firstStopColor?: string;
  secondStopColor?: string;
  countdownNotifyTimer?: any;
  onCountdownNotify?: () => void;
}

export default class Countdown extends Component<CountdownProps, {
  isTimerStart: boolean;
  countdown: number;
}> {
  static defaultProps = {
    firstStopColor: '#fe0362',
    secondStopColor: '#7473e3'
  };

  interval

  jumpElem

  constructor(props) {
    super(props);
    this.state = {
      isTimerStart: false,
      countdown: 0
    };
  }

  startCountdown() {
    const { start } = this.props;
    if (this.state.isTimerStart || start === 0) return;
    this._clearTimer();
    this.interval = this.startTimer();
  }

  setJumpElemCount(timeObj) {
    if (!this.jumpElem) return;

    this.jumpElem.innerHTML = `${timeObj.hour}:${timeObj.min}:${timeObj.sec}` || 0;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isReceiveNewStart = this.props.start !== nextProps.start;
    const isNewCount = this.state.countdown !== nextState.countdown;
    if (nextProps.start !== this.props.start) {
      this.clearTimer();
    }
    return isNewCount
           || !nextState.isTimeout
           || !nextState.isTimerStart
           || isReceiveNewStart;
  }

  componentDidMount() {
    this.startCountdown();
  }

  componentDidUpdate() {
    this.startCountdown();
  }

  _clearTimer() {
    this.interval && clearInterval(this.interval);
    this.interval = null;
  }

  clearTimer() {
    this._clearTimer();
    this.setState({
      isTimerStart: false
    });
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  startTimer() {
    // if (this.state.isTimerStart) return;
    const {
      start, freq = 10,
      countdownNotifyTimer,
      onCountdownNotify, onTimeout
    } = this.props;
    let countdown = start - 1;
    this.setState({
      isTimerStart: true,
      // isTimeout: false,
      countdown
    });
    const oneRound = setInterval(() => {
      countdown--;
      this.setState({
        countdown: (countdown < 0) ? 0 : countdown
      });
      if (countdown == +countdownNotifyTimer) Call(onCountdownNotify, countdown);
      if (countdown === -1) {
        countdown = freq - 1;
        onTimeout();
      }
    }, 1000);
    return oneRound;
  }

  getBgDOM(timeObj, time, idx) {
    const {
      needBg = true, freq, firstStopColor, secondStopColor
    } = this.props;

    if (!needBg) return '';
    const currTime = timeObj[time];

    let currCycle = freq > 60 ? 60 : freq;
    const hourCycle = freq / 3600;
    switch (time) {
      case 'hour':
        currCycle = hourCycle;
        break;
      case 'min':
        currCycle = hourCycle > 1 ? 60 : freq / 60;
        break;
    }
    const currPercent = +(currTime / currCycle * 100);
    const percent = currPercent == 0 ? 0 : ToFixed(100 - currPercent, 0);
    // if(time == 'sec') console.log(percent);
    return (
      <CountdownBg
        percent={percent}
        firstStopColor={firstStopColor}
        secondStopColor={secondStopColor} />
    );
  }

  render() {
    const { freq, needProgress = false } = this.props;
    const { countdown } = this.state;
    const timeObj = TimeFormat(countdown);
    const percent = +(countdown / freq * 100);

    const progressDOM = needProgress ? (
      <span className="progress" style={{ right: `${percent}%` }} />
    ) : '';

    this.setJumpElemCount(timeObj);

    return (
      <section className="countdown">
        {
          Object.keys(timeObj).map((time, idx) => {
            const currTime = timeObj[time];

            const countBg = this.getBgDOM(timeObj, time, idx);
            return (
              <span className={`item ${time}`} key={time}>
                <span className="text">{currTime}</span>
                {countBg}
                <span className="foot">{timeTitleMapper[time]}</span>
              </span>
            );
          })
        }
        {progressDOM}
      </section>
    );
  }
}
