import React, { Component, PureComponent } from 'react';

let _firstStopColor = '#fe0362';
let _secondStopColor = '#7473e3';

interface CountdownBgProps {
  percent: any;
  firstStopColor: any;
  secondStopColor: any;
}

export default class CountdownBg extends PureComponent<CountdownBgProps> {
  static defaultProps = {
    percent: 0,
    firstStopColor: '#fe0362',
    secondStopColor: '#7473e3',
  };

  static setBgColor = (firstStopColor, secondStopColor) => {
    _firstStopColor = firstStopColor;
    _secondStopColor = secondStopColor;
  };

  render() {
    const { percent, firstStopColor, secondStopColor } = this.props;
    const dashLength = Math.PI * 2 * 30;
    const strokeDashoffset = percent > 0 ? dashLength - dashLength * percent / 100 : dashLength;
    return (
      <div className="prassbar-container">
        <div id="svgContainer">
          <div id="countSvgBg">
            <svg width="150" height="150">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: firstStopColor, stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: secondStopColor, stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path className="progress-circle-trail" fillOpacity="0" stroke="rgba(0,0,0,0.1)"
                d="M 50,50 m 0,-30
                    a 30,30 0 1 1 0,60
                    a 30,30 0 1 1 0,-60" strokeWidth="4" />
              <path className="progress-circle-path" fillOpacity="0" strokeLinecap="round" strokeWidth="3"
                d="M 50,50 m 0,-30
                  a 30,30 0 1 1 0,60
                  a 30,30 0 1 1 0,-60" stroke="url(#grad1)" style={{ strokeDasharray: `${dashLength}`, strokeDashoffset: `${strokeDashoffset}`, transition: '  all 0.5s linear' }} />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
