import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Call } from 'basic-helper';
import { Icon } from '../icon';

/**
 * 轮播控件
 *
 * @export
 * @class Carousel
 * @extends {Component}
 */
export default class Carousel extends Component {
  static propTypes = {
    /** 轮播的具体内容，格式如下 */
    carouselItems: PropTypes.arrayOf(PropTypes.shape({
      /** 如果同时设置了 imgUrl 和 element */
      imgUrl: PropTypes.string,
      /** 优先渲染 element */
      element: PropTypes.element,
      action: PropTypes.func
    })).isRequired,
    /** 可设置的 style */
    styleConfig: PropTypes.shape({
      width: PropTypes.any,
      height: PropTypes.any,
      margin: PropTypes.any
    }).isRequired,
    /** 预留的操作 class */
    actionClass: PropTypes.string,
    /** 动画的 css name，可以自由设置 */
    transitionName: PropTypes.string,
    /** 是否移动版，如果是，则渲染左右切换按钮 */
    isMobile: PropTypes.bool,
    /** 过场动画的持续时间 */
    transitionTimer: PropTypes.number,
    thumbType: PropTypes.oneOf([
      'thumb',
      'dot',
    ]),
    /** 缩略图和大图的缩小比例 */
    thumbRate: PropTypes.number,
  };
  static defaultProps = {
    actionClass: 'action-area',
    transitionName: 'banner',
    thumbType: 'dot',
    transitionTimer: 400,
    thumbRate: 15,
    isMobile: false
  };
  constructor(props) {
    super(props);

    const {carouselItems = [], styleConfig, isMobile} = props;
    const defaultIdx = 0;
    this.state = {
      activeIdx: defaultIdx,
      toNext: true,
      activeItem: carouselItems[defaultIdx],
    };
    this.timer = null;
    this.freq = 5000;
    this.isStarted = false;
    this.itemWidth = styleConfig.width;

    this.mobileEvents = {
      onMouseDown: this.handleTouchStart,
      onMouseUp: this.handleTouchEnd,
      onTouchStart: this.handleTouchStart,
      onTouchEnd: this.handleTouchEnd,
    };
  }
  componentDidUpdate(prevProps) {
    if(this.props.carouselItems.length == 0 && prevProps.carouselItems.length > 0) {
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
    if(this.timer) this.stopLoop();
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
        activeItem: carouselItems[idx] || <span/>
      };
    });
    this.startLoop();
  }
  genCarouselDOM(currItem, idx, imgStyle) {
    const { styleConfig, actionClass } = this.props;
    const { width, height } = imgStyle || styleConfig;
    const { imgUrl, element } = currItem;
    const objStyle = { width, height };
    objStyle['backgroundImage'] = `url(${imgUrl})`;
    return (
      <div className={actionClass} key={idx}>
        {
          element ? element : (
            <div
              className="img"
              style={objStyle} />
          )
        }
      </div>
    );
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
    const {activeItem} = this.state;
    Call(activeItem.action, activeItem, activeIdx);
  }

  getThumb() {
    const { isMobile, carouselItems, styleConfig, thumbRate, thumbType } = this.props;
    const { activeIdx } = this.state;

    let thumbGenerator;

    switch (thumbType) {
    case 'thumb':
      const { width, height } = styleConfig;
      const imgWHRate = width / height;
      const thumbImgStyle = {
        width: width / thumbRate,
        height: width / imgWHRate / thumbRate
      };
      thumbGenerator = (item, idx) => this.genCarouselDOM(item, idx, thumbImgStyle);
      break;
    case 'dot':
    default:
      thumbGenerator = (item, idx) => {
        return (
          <span className="dot-item" />
        );
      };
      break;
    }

    let thumbDOM = !isMobile && (
      <div className="thumb-contaner">
        {
          carouselItems.map((item, idx) => {
            let isActive = idx == activeIdx;
            return (
              <div
                className={"thumb-item" + (isActive ? ' active' : '') + ' ' + thumbType}
                key={idx}>
                <div
                  className="_mark"
                  onClick={e => {
                    this.setActiveIdx(idx);
                  }}>
                  {thumbGenerator(item, idx)}
                </div>
              </div>
            );
          })
        }
      </div>
    );
    return thumbDOM;
  }

  render() {
    const {
      carouselItems, styleConfig, 
      isMobile, transitionTimer, 
      transitionName, thumbType,
      thumbRate,
    } = this.props;
    if(!carouselItems || carouselItems.length == 0) {
      return (
        <span className="no-banner" />
      );
    }
    const { activeIdx, toNext, activeItem } = this.state;
    const { width, height, margin } = styleConfig;

    return (
      <div
        className="carousel"
        style={{width, height, margin}}>
        <TransitionGroup>
          <CSSTransition
            key={activeIdx}
            classNames={transitionName + '-to-' + (toNext ? 'next' : 'prev')}
            timeout={transitionTimer}>
            <div className="carousel-item" {...this.mobileEvents}>
              {this.genCarouselDOM(activeItem, activeIdx)}
            </div>
          </CSSTransition>
        </TransitionGroup>
        {
          this.getThumb()
        }
        {
          isMobile ? null : (
            <React.Fragment>
              <div
                className="prev-btn func-btn"
                onClick={e => this.setActiveIdx(activeIdx - 1)}>
                <Icon n="arrow-left"/>
              </div>
              <div
                className="next-btn func-btn"
                onClick={e => this.setActiveIdx(activeIdx + 1)}>
                <Icon n="arrow-right"/>
              </div>
            </React.Fragment>
          )
        }
      </div>
    );
  }
}
