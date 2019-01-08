/* eslint-disable react/no-multi-comp */

import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, ToFixed, TimeFormat } from 'basic-helper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Grid } from '../../core/grid';

const timeTitleMapper = {
  hour: '时',
  min: '分',
  sec: '秒'
};

const AnimatedCard = ({ position, animation, digit, style }) => {
  return(
    <div className={`flip-card ${position} ${animation}`} style={style}>
      <span className="count">{digit}</span>
    </div>
  );
};

const StaticCard = ({ position, digit, style }) => {
  return(
    <div className={position} style={style}>
      <span className="count">{digit}</span>
    </div>
  );
};

class FlipUnitContainer extends React.Component {
  static propTypes = {
    digit: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    width: PropTypes.number,
    height: PropTypes.number,
    flipItemStyle: PropTypes.shape({}),
    unit: PropTypes.oneOf(['hour', 'min', 'sec']),
  }
  static defaultProps = {
    width: 140,
    height: 120,
  }
  preDigit = 0;
  shuffle = true;
  state = {
    preDigit: 0,
    shuffle: true
  }
  shouldComponentUpdate(nextProps) {
    if(this.props.digit !== nextProps.digit) {
      this.preDigit = this.props.digit;
      this.shuffle = !this.shuffle;
    }
    return true;
  }
  // componentDidUpdate(prevProps) {
  //   if(this.props.digit !== prevProps.digit) {
  //     this.setState(({ preDigit, shuffle }) => {
  //       return {
  //         preDigit: prevProps.digit,
  //         shuffle: !shuffle
  //       };
  //     });
  //   }
  // }
  render() {
    const {
      digit, unit, width = 140, height = 120, flipItemStyle
    } = this.props;
    // const { shuffle, preDigit } = this.state;
    const { shuffle, preDigit } = this;

    let previousDigit = +preDigit || 0;
    let currentDigit = +digit;
    // let previousDigit = +FlipDigitCache[unit] || 0;
  
    if ( unit !== 'hour') {
      previousDigit = previousDigit === -1 ? 59 : previousDigit;
      previousDigit = previousDigit === 60 ? '00' : previousDigit;
    } else {
      previousDigit = previousDigit === -1 ? 23 : previousDigit;
    }
  
    if ( currentDigit !== '00' && currentDigit < 10 ) {
      currentDigit = `0${currentDigit}`;
    } 
    if ( previousDigit !== '00' && previousDigit < 10 ) {
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

export default class Countdown extends Component {
  static propTypes = {
    /** 倒计时开始时间 */
    start: PropTypes.number.isRequired,
    /** 每一个 flip 的宽度 */
    width: PropTypes.number,
    /** 每一个 flip 的高度 */
    height: PropTypes.number,
    /** 给每一个 flip 的 style */
    flipItemStyle: PropTypes.shape({}),
    /** 需要广播的时间节点 */
    countdownNotifyTimer: PropTypes.number,
    /** 广播的时间节点触发的回调 */
    onCountdownNotify: PropTypes.func,
    /** 时间到 0 的时候触发的回调 */
    onTimeout: PropTypes.func.isRequired
  };
  static defaultProps = {
    width: 140,
    height: 120,
  };
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
    if(this.props.start != prevProps.start || !this.state.isTimerStart) {
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
    if(!this.jumpElem) return;

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
      countdown: countdown
    });
    this.interval = setInterval(() => {
      countdown--;
      this.setState({
        countdown: (countdown < 0) ? 0 : countdown
      });
      if(countdown == +countdownNotifyTimer) Call(onCountdownNotify, countdown);
      if(countdown === -1) {
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
  render () {
    const { width, height, countdownNotifyTimer, onCountdownNotify, onTimeout, flipItemStyle, className, ...other } = this.props;
    const { countdown } = this.state;
    const timeObj = TimeFormat(countdown);

    this.setJumpElemCount(timeObj);
    // const hasCountdown = countdown != -1;

    const container = (
      <section className={"flip-clock " + (className ? className : '')}>
        <Grid container>
          {
            Object.keys(timeObj).map((unit, idx) => {
              let currTime = timeObj[unit];
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

    // return (
    //   <TransitionGroup component={null}>
    //     <CSSTransition
    //       key={hasCountdown ? 'has' : 'none'}
    //       classNames="fade"
    //       timeout={200}>
    //       {container}
    //     </CSSTransition>
    //   </TransitionGroup>
    // );
  }
}
