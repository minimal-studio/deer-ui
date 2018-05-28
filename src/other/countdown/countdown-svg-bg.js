import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

let _firstStopColor = '#fe0362';
let _secondStopColor = '#7473e3';

export default class CountdownBg extends PureComponent {
  constructor(props) {
    super(props);
    this.addProgress = this.addProgress.bind(this);
    this.minusProgress = this.minusProgress.bind(this);
    this.state = {
      progress: 0,
    }
  }

  addProgress() {
    var {progress} = this.state;
    if(progress >= 100){
      this.setState({
        progress: 0,
      })
    }else {
      this.setState({
        progress: progress + 10,
      })
    }
  }

  minusProgress(){
    var {progress} = this.state;
    if(progress <= 0) {
      this.setState({
        progress: 0,
      })
    } else {
      this.setState({
        progress: progress - 10,
      })
    }
  }
  componentWillReceiveProps(nextProps){
    let {percent} = nextProps;
    this.setState({
      progress: percent,
    })
  }

  render() {
    let {progress} = this.state;
    let {percent} = this.props;
    let dashLength = Math.PI * 2 * 30;
    let strokeDashoffset =  progress > 0 ? dashLength - dashLength * progress / 100 : dashLength;
    let textContent = progress + '%';
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
                    a 30,30 0 1 1 0,-60" strokeWidth="4">
              </path>
             <path className="progress-circle-path" fillOpacity="0" strokeLinecap="round" strokeWidth="3"
               d="M 50,50 m 0,-30
                  a 30,30 0 1 1 0,60
                  a 30,30 0 1 1 0,-60" stroke="url(#grad1)" style={{strokeDasharray:`${dashLength}`,strokeDashoffset:`${strokeDashoffset}`,transition:'  all 0.5s linear'}}>
             </path>
            </svg>
          </div>
        </div>
      </div>
    )
    // {
    //   var circle = document.getElementById('circle');
    //   circle.style.strokeDashoffset = progress > 0 ? dashLength - dashLength * progress / 100: dashLength;
    // }
  }
}
CountdownBg.propTypes = {
  // id: PropTypes.any.isRequired,
  percent: PropTypes.any.isRequired,
  text: PropTypes.any.isRequired,
};


// CountdownBg.defaultProps = {
//   firstStopColor: '#fe0362',
//   secondStopColor: '#7473e3'
// }

CountdownBg.setBgColor = function(firstStopColor, secondStopColor) {
  _firstStopColor = firstStopColor;
  _secondStopColor = secondStopColor;
}
