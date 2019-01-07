import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, ToFixed, TimeFormat } from 'basic-helper';

import CountdownBg from './countdown-svg-bg';

const timeTitleMapper = {
  hour: '时',
  min: '分',
  sec: '秒'
};

export default class Countdown extends Component {
  static propTypes = {
    start: PropTypes.number.isRequired,
    freq: PropTypes.number.isRequired,
    needBg: PropTypes.bool,
    needProgress: PropTypes.bool,
    jumpClass: PropTypes.string,
    firstStopColor: PropTypes.string,
    secondStopColor: PropTypes.string,
    countdownNotifyTimer: PropTypes.any,
    onCountdownNotify: PropTypes.func,
    onTimeout: PropTypes.func.isRequired
  };
  static defaultProps = {
    firstStopColor: '#fe0362',
    secondStopColor: '#7473e3'
  };
  constructor(props) {
    super(props);
    this.state = {
      isTimerStart: false,
      countdown: 0
    };
  }
  startCountdown() {
    const {start} = this.props;
    if (this.state.isTimerStart || start === 0) return;
    this._clearTimer();
    this.interval = this.startTimer();
  }
  // getSameJumpElem() {
  //   const {jumpClass = ''} = this.props;
  //   if(!jumpClass) return;
  //   this.jumpElem = document.querySelector('.' + jumpClass) || null;
  // }
  setJumpElemCount(timeObj) {
    if(!this.jumpElem) return;

    this.jumpElem.innerHTML = `${timeObj.hour}:${timeObj.min}:${timeObj.sec}` || 0;
  }
  // componentWillReceiveProps(nextProps) {
  //   if(nextProps.start !== this.props.start) {
  //     this.clearTimer();
  //   }
  // }
  shouldComponentUpdate(nextProps, nextState) {
    const isReceiveNewStart = this.props.start !== nextProps.start;
    const isNewCount = this.state.countdown !== nextState.countdown;
    if(nextProps.start !== this.props.start) {
      this.clearTimer();
    }
    return isNewCount ||
           !nextState.isTimeout ||
           !nextState.isTimerStart ||
           isReceiveNewStart;
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
    let self = this;
    let countdown = start - 1;
    self.setState({
      isTimerStart: true,
      // isTimeout: false,
      countdown: countdown
    });
    let oneRound = setInterval(() => {
      countdown--;
      self.setState({
        countdown: (countdown < 0) ? 0 : countdown
      });
      if(countdown == +countdownNotifyTimer) Call(onCountdownNotify, countdown);
      if(countdown === -1) {
        countdown = freq - 1;
        onTimeout();
        // clearInterval(oneRound);
        // self.setState({
        //   isTimerStart: false,
        //   isTimeout: true
        // });
      }
    }, 1000);
    return oneRound;
  }
  // getPercentage(time) {
  //   const {freq} = this.props;
  //   let _freq = freq > 60 ? 60 : freq;
  //   let result = 0;
  //   result = time == 0 ? 0 : (_freq - time) / _freq * 100;
  //   return result;
  // }
  getBgDOM(timeObj, time, idx) {
    const {needBg = true, freq, firstStopColor, secondStopColor} = this.props;

    if(!needBg) return '';
    let currTime = timeObj[time];

    let currCycle = freq > 60 ? 60 : freq;
    let hourCycle = freq / 3600;
    switch (time) {
    case 'hour':
      currCycle = hourCycle;
      break;
    case 'min':
      currCycle = hourCycle > 1 ? 60 : freq / 60;
      break;
    }
    let currPercent = +(currTime / currCycle * 100);
    let percent = currPercent == 0 ? 0 : ToFixed(100 - currPercent, 0);
    // if(time == 'sec') console.log(percent);
    return (
      <CountdownBg
        percent={percent}
        text={currTime}
        firstStopColor={firstStopColor}
        secondStopColor={secondStopColor}/>
    );
  }
  render () {
    const { needBg = true, freq, needProgress = false } = this.props;
    const { countdown } = this.state;
    const timeObj = TimeFormat(countdown);
    const percent = +(countdown / freq * 100);

    const progressDOM = needProgress ? (
      <span className="progress" style={{right: percent + '%'}} />
    ) : '';

    this.setJumpElemCount(timeObj);

    return(
      <section className="countdown">
        {
          Object.keys(timeObj).map((time, idx) => {
            let currTime = timeObj[time];

            let countBg = this.getBgDOM(timeObj, time, idx);
            return (
              <span className={"item " + time} key={time}>
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
