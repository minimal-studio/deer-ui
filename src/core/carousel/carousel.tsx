import React, { Component, PureComponent } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Call } from 'basic-helper';
import { Icon } from '../icon';
import { Children } from '../utils/props';

interface CarouselItem {
  /** 如果同时设置了 imgUrl 和 element */
  imgUrl?: string;
  /** 优先渲染 element */
  element?: Children;
  action?: (activeItem, activeIdx) => void;
}

interface CarouselProps {
  /** 轮播的具体内容，格式如下 */
  carouselItems: CarouselItem[];
  /** 可设置的 style */
  style?: React.CSSProperties;
  /** 预留的操作 class */
  actionClass?: string;
  /** 动画的 css name，可以自由设置 */
  transitionName?: string;
  /** 是否移动版，如果是，则渲染左右切换按钮 */
  isMobile?: boolean;
  /** 自动轮播的频率，单位为秒 */
  freq?: number;
  /** 过场动画的持续时间 */
  transitionTimer?: number;
  /** 指示器的类型， 兼容旧版本，将要废弃 */
  thumbType?: 'thumb' | 'dot';
  /** 指示器的类型 */
  indicator?: 'thumb' | 'dot';
  /** 缩略图和大图的缩小比例 */
  thumbRate: number;
}

interface DefaultProps {
  style: {
    width: number;
    height: number;
  };
}

/**
 * 轮播控件
 *
 * @export
 * @class Carousel
 * @extends {Component}
 */
export default class Carousel extends Component<CarouselProps, {
  activeIdx: number;
  toNext: boolean;
  activeItem: CarouselItem;
}> {
  static defaultProps = {
    actionClass: 'action-area',
    transitionName: 'banner',
    thumbType: 'dot',
    indicator: 'dot',
    style: {
      width: '100%',
      height: 380
    },
    transitionTimer: 400,
    freq: 5,
    thumbRate: 15,
    isMobile: false
  };

  timer;

  isStarted = false;

  itemWidth: number | string;

  startPageX!: number;

  endPageX!: number;

  mobileEvents: {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseUp: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void;
    onTouchEnd: (event: React.TouchEvent<HTMLDivElement>) => void;
  }

  constructor(props) {
    super(props);

    const { carouselItems = [], style } = props;
    const defaultIdx = 0;
    this.state = {
      activeIdx: defaultIdx,
      toNext: true,
      activeItem: carouselItems[defaultIdx],
    };
    this.timer = null;
    this.itemWidth = style.width;

    this.mobileEvents = {
      onMouseDown: this.handleTouchStart,
      onMouseUp: this.handleTouchEnd,
      onTouchStart: this.handleTouchStart,
      onTouchEnd: this.handleTouchEnd,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.carouselItems.length === 0 && prevProps.carouselItems.length > 0) {
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
    const { freq = 5 } = this.props;
    if (this.timer) this.stopLoop();
    this.timer = setInterval(() => {
      const { carouselItems } = this.props;
      let { activeIdx } = this.state;
      activeIdx += 1;
      if (activeIdx > carouselItems.length - 1) activeIdx = 0;
      if (!document.hidden) this.setActiveIdx(activeIdx);
    }, freq * 1000);
  }

  stopLoop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  setActiveIdx(idx) {
    const { carouselItems } = this.props;
    const maxIdx = carouselItems.length - 1;
    let nextIdx = idx;
    if (idx > maxIdx) nextIdx = 0;
    if (idx < 0) nextIdx = maxIdx;
    this.setState((preState) => {
      const prevActiveIdx = preState.activeIdx;
      const toNext = prevActiveIdx < nextIdx;
      return {
        activeIdx: nextIdx,
        toNext,
        activeItem: carouselItems[nextIdx] || <span/>
      };
    });
    this.startLoop();
  }

  genCarouselDOM(currItem, idx, imgStyle?) {
    const { style, actionClass } = this.props;
    const { width, height } = imgStyle || style;
    const { imgUrl, element } = currItem;
    const objStyle = {
      width,
      height,
      backgroundImage: `url(${imgUrl})`
    };
    return (
      <div className={actionClass} key={idx}>
        {
          element || (
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
    const { activeIdx } = this.state;
    const touches = e.changedTouches || e;
    this.endPageX = touches[0] ? touches[0].pageX : touches.pageX;
    const touchOffset = this.endPageX - this.startPageX;
    if (Math.abs(touchOffset) < 50) {
      return this.showDetail(activeIdx);
    }
    const toNext = touchOffset > 0;
    return this.setActiveIdx(activeIdx + (toNext ? -1 : 1));
  }

  showDetail(activeIdx) {
    const { activeItem } = this.state;
    Call(activeItem.action, activeItem, activeIdx);
  }

  getThumb() {
    const {
      isMobile, carouselItems, style, thumbRate, thumbType, indicator
    } = this.props;
    const { activeIdx } = this.state;

    let thumbGenerator;
    const _indicator = indicator || thumbType;

    switch (_indicator) {
      case 'thumb':
        const { width, height } = style as DefaultProps['style'];
        const imgWHRate = width / height;
        const thumbImgStyle = {
          width: width / thumbRate,
          height: width / imgWHRate / thumbRate
        };
        thumbGenerator = (item, idx) => this.genCarouselDOM(item, idx, thumbImgStyle);
        break;
      case 'dot':
      default:
        thumbGenerator = (item, idx) => (
          <span className="dot-item" />
        );
        break;
    }

    const thumbDOM = !isMobile && (
      <div className="thumb-contaner">
        {
          carouselItems.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                className={`thumb-item${isActive ? ' active' : ''} ${thumbType}`}
                key={idx}>
                <div
                  className="_mark"
                  onClick={(e) => {
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
      carouselItems, style,
      isMobile, transitionTimer,
      transitionName,
    } = this.props;
    if (!carouselItems || carouselItems.length === 0) {
      return (
        <span className="no-banner" />
      );
    }
    const { activeIdx, toNext, activeItem } = this.state;

    return (
      <div
        className="carousel"
        style={style}>
        <TransitionGroup>
          <CSSTransition
            key={activeIdx}
            classNames={`${transitionName}-to-${toNext ? 'next' : 'prev'}`}
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
