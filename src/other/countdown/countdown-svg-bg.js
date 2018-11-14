import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

let _firstStopColor = '#fe0362';
let _secondStopColor = '#7473e3';

export default class CountdownBg extends PureComponent {
  static propTypes = {
    // id: PropTypes.any.isRequired,
    percent: PropTypes.number,
    // text: PropTypes.any.isRequired,
  };
  static defaultProps = {
    percent: 0
  };
  static setBgColor = function(firstStopColor, secondStopColor) {
    _firstStopColor = firstStopColor;
    _secondStopColor = secondStopColor;
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    const { resDesc } = nextProps;
    if(prevState.prevResDesc !== resDesc) {
      return {
        prevResDesc: resDesc,
        changeDescFromProps: true
      };
    } else {
      return {
        changeDescFromProps: false
      };
    }
  }
  render() {
    const { percent } = this.props;
    let dashLength = Math.PI * 2 * 30;
    let strokeDashoffset =  percent > 0 ? dashLength - dashLength * percent / 100 : dashLength;
    return (
      <div className="prassbar-container">
        <div id="svgContainer">
          <div id="countSvgBg">
            <svg width="150" height="150">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: _firstStopColor, stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor: _secondStopColor, stopOpacity:1}} />
                </linearGradient>
              </defs>
              <path className="progress-circle-trail" fillOpacity="0" stroke="rgba(0,0,0,0.1)"
                d="M 50,50 m 0,-30
                    a 30,30 0 1 1 0,60
                    a 30,30 0 1 1 0,-60" strokeWidth="4" />
              <path className="progress-circle-path" fillOpacity="0" strokeLinecap="round" strokeWidth="3"
                d="M 50,50 m 0,-30
                  a 30,30 0 1 1 0,60
                  a 30,30 0 1 1 0,-60" stroke="url(#grad1)" style={{strokeDasharray:`${dashLength}`,strokeDashoffset:`${strokeDashoffset}`,transition:'  all 0.5s linear'}} />
            </svg>
          </div>
        </div>
      </div>
    );
    // {
    //   var circle = document.getElementById('circle');
    //   circle.style.strokeDashoffset = progress > 0 ? dashLength - dashLength * progress / 100: dashLength;
    // }
  }
}
