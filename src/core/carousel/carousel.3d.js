import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import {DebounceClass, CallFunc} from 'basic-helper';
import Icon from '../icon';

const TRANSTION_TIME = 2000;
const defaultRotateX = $UK.isMobile ? '200px' : '1600px';
const delayExec = new DebounceClass();

export default class BannerCarousel extends Component {
  constructor(props) {
    super(props);

    const {config} = props;
    this.state = {
      activeIdx: 0,
      bannerTotalWidth: 0,
      rotateIdx: 0,
      carouselRotateY: 0
    }
    this.timer = null;
    this.freq = 5000;

    this.isStarted = false;

    this._loopConfig = config;

    let configIdx = 0;
    // for (var i = 0; i < 6; i++) {
    //   this._loopConfig.push(config[configIdx]);
    //   configIdx++;
    //   configIdx = config[configIdx] ? configIdx : 0;
    // }

    this.animateDuration = 1000;
    this.bannerItemWidth = 800;
    this.configLen = config.length;
    this.eachItemRotate = 360 / this.configLen;
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.config.length == 0 && nextProps.config.length > 0) {
      this.startLoop();
    }
  }
  componentDidMount() {
    this.setState({
      bannerTotalWidth: this.bannerItemWidth * this.configLen
    });
    this.setActiveIdx(this.props.config.length - 1);
  }
  componentWillUnmount() {
    this.stopLoop();
  }
  startLoop() {
    var self = this;
    if(!!this.timer) this.stopLoop();
    this.timer = setInterval(() => {
      const {activeIdx} = this.state;
      /**
       * 如果不在当前的标签，就不渲染
       */
      if(!document.hidden) self.roll(activeIdx - 1);
    }, this.freq);
  }
  stopLoop() {
    clearInterval(this.timer);
    this.timer = null;
  }
  setActiveIdx(idx) {
    this.startLoop();
  }
  roll(type, callback) {
    const self = this;
    this.isAnimating = true;
    this.stopLoop();
    let {carouselRotateY, activeIdx, rotateIdx} = this.state;
    let nextRotateY = carouselRotateY;
    let nextIdx = activeIdx;
    let nextRotateIdx = activeIdx;
    let currGroupLen = this.configLen - 1;

    if(!!+type || type == 0) {
      nextIdx = type;
      nextRotateIdx = rotateIdx - activeIdx + type;
    }

    nextRotateY = nextRotateIdx * this.eachItemRotate;
    //判断索引
    if(nextIdx < 0) nextIdx = currGroupLen;
    if(nextIdx > currGroupLen) nextIdx = 0;

    this.setState({
      carouselRotateY: nextRotateY,
      activeIdx: nextIdx,
      rotateIdx: nextRotateIdx,
    }, () => {
      CallFunc(callback)(nextIdx);
      setTimeout(() => {
        self.isAnimating = false;
      }, this.animateDuration);
    });
  }
  rollAndEmitChangeEvent(type) {
    const {onClickItem, onChange} = this.props;
    if(this.isAnimating || (!type && type != 0)) return;
    this.roll(type, (nextIdx) => {
      CallFunc(onChange)(nextIdx);
    });
  }
  handleTouchStart(e) {
    const touches = e.changedTouches || e;
    this.startPageX = touches[0] ? touches[0].pageX : touches.pageX;
  }
  handleTouchEnd(e) {
    const {activeIdx} = this.state;
    const touches = e.changedTouches || e;
    this.endPageX = touches[0] ? touches[0].pageX : touches.pageX;
    const touchOffset = this.endPageX - this.startPageX;
    if(Math.abs(touchOffset) < 50) {
      return this.showDetail();
    }
    const toLeft = touchOffset < 0;
    this.roll(activeIdx + (toLeft ? - 1 : 1));
  }
  showDetail() {
    let activeArea = document.querySelector('.card-render-group .card-item.active .action-area');
    if(activeArea) activeArea.click();
  }
  handleWheel(e) {
    const self = this;
    this.oneWheel += e.deltaY; //返回鼠标滚轮的垂直滚动量
    //防抖
    delayExec.exec(() => {
      // this.queryOrderDetail();
      let rollTyoe;
      if (self.oneWheel > 50) rollTyoe = '+';
      if (self.oneWheel < -50) rollTyoe = '-';
      delayExec.exec(() => {
        if(!rollTyoe) return;
        this.rollAndEmitChangeEvent(rollTyoe);
      }, 20);
      self.oneWheel = 0;
    }, 10);
  }
  render() {
    const {carouselRotateY, activeIdx, bannerTotalWidth} = this.state;
    const {config, isMobile = false, onClickItem} = this.props;

    return (
      <div
        onWheel={e => this.handleWheel(e)}
        className="card-render-group">
        <div
          className="fill-h-w"
          style={{
            // 'transform': `translateZ(-${defaultRotateX})`,
          }}>
          <div className="carousel" style={{
              'transform': `rotateY(${carouselRotateY}deg)`,
            }}>
            <div>
              {
                this._loopConfig.map((item, idx) => {
                  const isActive = idx == activeIdx;
                  return (
                    <div
                      key={idx}
                      style={{
                        transform: `rotateY(${idx * this.eachItemRotate}deg) translateZ(${defaultRotateX})`
                      }}
                      className={"card-item item idx-" + idx + (isActive ? ' active' : '')}>
                      <div
                        className="card-img">
                        {item}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        {
          isMobile ? (
            <div className="section-mark"
              onMouseDown={this.handleTouchStart.bind(this)}
              onMouseUp={this.handleTouchEnd.bind(this)}
              onTouchStart={this.handleTouchStart.bind(this)}
              onTouchEnd={this.handleTouchEnd.bind(this)}></div>
          ) : [
            <div className="func-btn prev-btn" key="prev"
              onClick={e => this.rollAndEmitChangeEvent(activeIdx + 1)}>
              <Icon type="arrow"/>
            </div>,
            <div className="func-btn next-btn" key="next"
              onClick={e => this.rollAndEmitChangeEvent(activeIdx - 1)}>
              <Icon type="arrow"/>
            </div>
          ]
        }
      </div>
    )
  }
}
BannerCarousel.propTypes = {
  /**
   * config: [
   *   ...components
   * ]
   * @type {[type]}
   */
  config: PropTypes.array.isRequired,
  isMobile: PropTypes.bool,
  onClickItem: PropTypes.func
}
