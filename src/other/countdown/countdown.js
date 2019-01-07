import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, ToFixed, TimeFormat } from 'basic-helper';

import CountdownBg from './countdown-svg-bg';

const timeTitleMapper = {
  hour: '时',
  min: '分',
  sec: '秒'
};

const AnimatedCard = ({ position, animation, digit }) => {
  return(
    <div className={`flipCard ${position} ${animation}`}>
      <span>{digit}</span>
    </div>
  );
};

const StaticCard = ({ position, digit }) => {
  return(
    <div className={position}>
      <span>{digit}</span>
    </div>
  );
};

let FlipShuffleCache = {
  hour: true,
  min: true,
  sec: true,
};
let FlipDigitCache = {};

const FlipUnitContainer = ({ digit, unit, increase = false }) => {	
  
  // assign digit values
  let currentDigit = +digit;
  let previousDigit = +digit + (increase ? -1 : 1);

  // to prevent a negative value
  if ( unit !== 'hour') {
    previousDigit = previousDigit === -1 ? 59 : previousDigit;
    previousDigit = previousDigit === 60 ? '00' : previousDigit;
  } else {
    previousDigit = previousDigit === -1 ? 23 : previousDigit;
  }

  // if(unit == 'min') {
  //   console.log(previousDigit)
  // }

  // add zero
  if ( currentDigit !== '00' && currentDigit < 10 ) {
    currentDigit = `0${currentDigit}`;
  } 
  if ( previousDigit !== '00' && previousDigit < 10 ) {
    previousDigit = `0${previousDigit}`;
  }
  let preDigitFormCache = FlipDigitCache[unit];
  let shuffle = FlipShuffleCache[unit];


  // if(unit == 'sec') {
  //   console.log(shuffle)
  // }
  if(currentDigit != preDigitFormCache) {
    FlipShuffleCache[unit] = !shuffle;
  }
  FlipDigitCache[unit] = currentDigit;

  // shuffle digits
  const digit1 = shuffle ? previousDigit : currentDigit;
  const digit2 = !shuffle ? previousDigit : currentDigit;

  // shuffle animations
  const animation1 = shuffle ? 'fold' : 'unfold';
  const animation2 = !shuffle ? 'fold' : 'unfold';

  return (
    <div className="flipUnitContainer">
      <StaticCard 
        position="upperCard" 
        digit={currentDigit}/>
      <StaticCard 
        position="lowerCard" 
        digit={previousDigit}/>
      <AnimatedCard 
        position="first"
        digit={digit1}
        animation={animation1}/>
      <AnimatedCard 
        position="second"
        digit={digit2}
        animation={animation2}/>
    </div>
  );
};

export default class Countdown extends Component {
  static propTypes = {
    start: PropTypes.number.isRequired,
    freq: PropTypes.number,
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
  isTimerStart = false;
  constructor(props) {
    super(props);
    this.state = {
      // isTimerStart: false,
      countdown: 0
    };
  }
  startCountdown() {
    const { start } = this.props;
    if (this.isTimerStart || start === 0) return;
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
    this.isTimerStart = false;
    // this.setState({
    //   isTimerStart: false
    // });
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
    this.isTimerStart = true;
    this.setState({
      // isTimerStart: true,
      countdown: countdown
    });
    let oneRound = setInterval(() => {
      countdown--;
      this.setState({
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

    const progressDOM = needProgress && (
      <span className="progress" style={{right: percent + '%'}} />
    );

    this.setJumpElemCount(timeObj);

    return(
      <section className="flipClock">
        {
          Object.keys(timeObj).map((unit, idx) => {
            let currTime = timeObj[unit];

            // let countBg = this.getBgDOM(timeObj, time, idx);
            return (
              <FlipUnitContainer
                key={unit}
                unit={unit}
                digit={currTime} />
            );
          })
        }
        {progressDOM}
      </section>
    );
  }
}
