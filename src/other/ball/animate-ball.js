import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {GenerateNumberRange} from 'basic-helper';

let hasSetKeyAnimateMapper = {};
let headDOM = document.getElementsByTagName('head')[0];
const prefixMap = {
  '-webkit-': 'Webkit',
  '-ms-': 'Ms',
  '-moz-': 'Moz',
};
const prefix = Object.keys(prefixMap).filter(prefix => prefix + 'transform' in headDOM.style)[0] || '';
// const prefix = '-ms-'
let transform = 'transform', animation = 'animation-name';
if (prefixMap[prefix]) {
  transform = prefixMap[prefix]+'Transform';
  animation = prefixMap[prefix]+'AnimationName';
}


function createDynamicAnimate(options) {
  const {startVal, endVal, animateName} = options;
  if(hasSetKeyAnimateMapper[animateName]) return;
  let keyCSS = `
    @${prefix}keyframes ${animateName} {
      0% {
        ${prefix}transform: translateY(${startVal});
      }
      100% {
        ${prefix}transform: translateY(${endVal});
      }
    }
  `;
  let style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = keyCSS;
  headDOM.appendChild(style);
  hasSetKeyAnimateMapper[animateName] = true;
}

export default class AnimateBall extends Component {
  constructor(props) {
    super(props);
    this.numberRangeArr = [];
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.animating !== nextProps.animating ||
           this.props.activeNumb !== nextProps.activeNumb;
  }
  componentDidMount() {
    this.genRandomArr();
  }
  genRandomArr() {
    const {numberRange} = this.props;
    this.numberRangeArr = this.shuffle(GenerateNumberRange(numberRange));
    this.eachItemRotate = 360 / this.numberRangeArr.length;
    // this.eachItemHeight = 360 / this.numberRangeArr.length;
  }
  shuffle(arrInput) {
    let arr = [...arrInput];
    for (var i = arr.length - 1; i >= 0; i--) {
      var randomIdx = Math.floor(Math.random() * (i + 1));
      var itemAtIdx = arr[randomIdx];

      arr[randomIdx] = arr[i];
      arr[i] = itemAtIdx;
    }
    return arr;
  }
  setKeyCss(ballItem) {
    if(this.eachItemHeight) return;
    const {numberRange} = this.props;
    const count = numberRange[1] - numberRange[0];
    this.eachItemHeight = ballItem.offsetHeight;
    const totalHeight = count * this.eachItemHeight;
    this.animateName = 'loop-' + this.eachItemHeight + '' + totalHeight;
    createDynamicAnimate({
      startVal: 0,
      endVal: `-${totalHeight}px`,
      animateName: this.animateName,
    });
    this.forceUpdate();
  }
  render() {
    const {animating, numberRange, activeNumb} = this.props;
    const hasActiveNumb = activeNumb != '?';
    const activeIdxRotate = (!animating && (+activeNumb || activeNumb == 0)) ? - (this.eachItemHeight * this.numberRangeArr.indexOf(activeNumb) || 0) : 0;
    // const activeIdxRotate = !animating && +activeNumb ? - this.eachItemRotate * this.numberRangeArr.indexOf(activeNumb) : 0;
    const carouselStyle = {};
    const animationStyle = {};
    if (!animating) {
      carouselStyle[transform] = `translateY(${activeIdxRotate}px)`;
    } else {
      animationStyle[animation] = this.animateName;
    }
    return (
      <div className="ball-wrap">
        <span
          style={animationStyle}
          className={`animate-balls${(animating ? ' loop1' : '')}`}>
          <div
            style={carouselStyle}
            className="carousel2">
            {
              this.numberRangeArr.map((ballNumb, idx) => {
                return (
                  <span
                    key={ballNumb}
                    ref={ballItem => {
                      if(!this.eachItemHeight && !!ballItem) this.setKeyCss(ballItem);
                    }}
                    className="item">
                    {hasActiveNumb ? ballNumb : '?'}
                  </span>
                );
              // return (
              //   <span
              //     key={ballNumb}
              //     ref={ballItem => {
              //       if(!this.eachItemHeight && !!ballItem) this.eachItemHeight = ballItem.offsetHeight;
              //     }}
              //     style={{
              //       transform: `rotateX(${this.eachItemRotate * idx}deg) translateZ(70px)`
              //     }}
              //     className="item">
              //     {ballNumb}
              //   </span>
              // )
              })
            }
          </div>
        </span>
      </div>
    );
  }
}
AnimateBall.propTypes = {
  // index: PropTypes.any,
  animating: PropTypes.bool,
  numberRange: PropTypes.array,
};
