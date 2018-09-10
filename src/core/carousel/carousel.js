import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {CallFunc} from 'basic-helper';
import Icon from '../icon';

export default class BannerCarousel extends Component {
  static propTypes = {
    carouselItems: PropTypes.array.isRequired,
    styleConfig: PropTypes.object.isRequired,
    actionClass: PropTypes.string,
    transitionName: PropTypes.string,
    isMobile: PropTypes.bool,
    transitionTimer: PropTypes.number,
    thumbRate: PropTypes.number,
  };
  static defaultProps = {
    isMobile: false
  };
  constructor(props) {
    super(props);

    const {carouselItems = [], styleConfig, isMobile} = props;
    const defaultIdx = 0;
    this.state = {
      activeIdx: defaultIdx,
      toNext: true,
      activeBannerItem: carouselItems[defaultIdx],
      isHover: false,
    }
    this.timer = null;
    this.freq = 5000;
    this.isStarted = false;
    this.bannerItemWidth = styleConfig.width;

    this.mobileEvents = {
      onMouseDown: this.handleTouchStart,
      onMouseUp: this.handleTouchEnd,
      onTouchStart: this.handleTouchStart,
      onTouchEnd: this.handleTouchEnd,
    };
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.carouselItems.length == 0 && nextProps.carouselItems.length > 0) {
      this.startLoop();
    }
  }
  componentDidMount() {
    this.startLoop();
  }
  componentWillUnmount() {
    this.stopLoop();
  }
  startLoop() {
    var self = this;
    if(!!this.timer) this.stopLoop();
    this.timer = setInterval(() => {
      const {carouselItems} = self.props;
      let {activeIdx} = self.state;
      activeIdx += 1;
      if(activeIdx >= carouselItems.length - 1) activeIdx = 0;
      if(!document.hidden) self.setActiveIdx(activeIdx);
    }, this.freq);
  }
  stopLoop() {
    clearInterval(this.timer);
    this.timer = null;
  }
  setActiveIdx(idx) {
    const {carouselItems} = this.props;
    const maxIdx = carouselItems.length - 1;
    if(idx > maxIdx) idx = 0;
    if(idx < 0) idx = maxIdx;
    this.setState((preState) => {
      let prevActiveIdx = preState.activeIdx;
      let toNext = prevActiveIdx < idx;
      return {
        activeIdx: idx,
        toNext,
        activeBannerItem: carouselItems[idx] || <span></span>
      }
    });
    this.startLoop();
  }
  genCarouselDOM(currItem, idx, imgStyle) {
    const {styleConfig, actionClass = 'action-area'} = this.props;
    const {width, height} = imgStyle || styleConfig;
    const {activeIdx, isHover} = this.state;
    let {action, imgUrl, component} = currItem;
    const objStyle = {width, height};
    if (idx === activeIdx || (isHover && imgStyle)) {
      objStyle['backgroundImage'] = `url(${imgUrl})`;
    } 
    return (
      <div className={actionClass} key={idx}>
        <div
          className="img"
          style={objStyle}></div>
        {/* <img src={imgUrl}/> */}
      </div>
    )
  }
  handleTouchStart = (e) => {
    const touches = e.changedTouches || e;
    this.startPageX = touches[0] ? touches[0].pageX : touches.pageX;
  }
  handleTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {activeIdx} = this.state;
    const touches = e.changedTouches || e;
    this.endPageX = touches[0] ? touches[0].pageX : touches.pageX;
    const touchOffset = this.endPageX - this.startPageX;
    if(Math.abs(touchOffset) < 50) {
      return this.showDetail(activeIdx);
    }
    const toNext = touchOffset > 0;
    this.setActiveIdx(activeIdx + (toNext ? - 1 : 1));
  }
  showDetail(activeIdx) {
    const {activeBannerItem} = this.state;
    CallFunc(activeBannerItem.action)(activeBannerItem, activeIdx);
  }
  handleToggleHover = () => {
    this.setState({
      isHover: !this.state.isHover
    })
  }
  render() {
    const {
      carouselItems, styleConfig, 
      isMobile, transitionTimer = 600, 
      transitionName = 'banner',
      thumbRate = 15,
    } = this.props;
    if(!carouselItems || carouselItems.length == 0) {
      return (
        <span className="no-banner"></span>
      )
    }
    const {activeIdx, toNext, activeBannerItem, isHover} = this.state;

    const {width, height, margin} = styleConfig;
    const imgWHRate = width / height;
    const thumbImgStyle = {
      width: width / thumbRate,
      height: width / imgWHRate / thumbRate
    }

    return (
      <div
        className="carousel"
        onMouseEnter={this.handleToggleHover}
        onMouseLeave={this.handleToggleHover}
        style={{width, height, margin}}>
        <TransitionGroup>
          <CSSTransition
            key={activeIdx}
            classNames={transitionName + '-to-' + (toNext ? 'next' : 'prev')}
            timeout={transitionTimer}>
            <div className="carousel-item" {...this.mobileEvents}>
              {this.genCarouselDOM(activeBannerItem, activeIdx)}
            </div>
          </CSSTransition>
        </TransitionGroup>
        {
          isMobile ? (
            <span></span>
          ) : (
            <div className="thumb-contaner">
              {
                carouselItems.map((item, idx) => {
                  let isActive = idx == activeIdx;
                  return (
                    <div
                      className={"thumb-item" + (isActive ? ' active' : '')} key={idx}>
                      <div
                        className="_mark"
                        onClick={e => {
                          this.setActiveIdx(idx);
                        }}></div>
                      {this.genCarouselDOM(item, idx, thumbImgStyle)}
                      {/* {item} */}
                    </div>
                  )
                })
              }
            </div>
          )
        }
        {
          isMobile ? null : (
            <React.Fragment>
              <div
                className="prev-btn func-btn"
                onClick={e => this.setActiveIdx(activeIdx - 1)}>
                <Icon type="arrow"/>
              </div>
              <div
                className="next-btn func-btn"
                onClick={e => this.setActiveIdx(activeIdx + 1)}>
                <Icon type="arrow"/>
              </div>
            </React.Fragment>
          )
        }
      </div>
    )
  }
}
