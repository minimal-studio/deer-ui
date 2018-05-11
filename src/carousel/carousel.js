import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const TRANSTION_TIME = 600;
const thumbRate = 15;

export default class BannerCarousel extends Component {
  constructor(props) {
    super(props);

    const {config, carouselConfig} = props;
    const defaultIdx = 0;
    this.state = {
      activeIdx: defaultIdx,
      activeBannerItem: config[defaultIdx],
    }
    this.timer = null;
    this.freq = 5000;

    this.isStarted = false;

    this.bannerItemWidth = carouselConfig.width;
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.config.length == 0 && nextProps.config.length > 0) {
      this.startLoop();
    }
  }
  componentDidMount() {
    // this.setActiveIdx(this.props.config.length - 1);
    this.startLoop();
  }
  componentWillUnmount() {
    this.stopLoop();
  }
  startLoop() {
    var self = this;
    if(!!this.timer) this.stopLoop();
    this.timer = setInterval(() => {
      const {config} = self.props;
      let {activeIdx} = self.state;
      activeIdx += 1;
      if(activeIdx >= config.length - 1) activeIdx = 0;
      if(!document.hidden) self.setActiveIdx(activeIdx);
    }, this.freq);
  }
  stopLoop() {
    clearInterval(this.timer);
    this.timer = null;
  }
  setActiveIdx(idx) {
    const {config} = this.props;
    const maxIdx = config.length - 1;
    if(idx > maxIdx) idx = 0;
    if(idx < 0) idx = maxIdx;
    this.setState({
      activeIdx: idx,
      activeBannerItem: config[idx] || <span></span>
    // });
    }, () => this.startLoop());
  }
  genCarouselDOM(currItem, idx, imgStyle) {
    const {carouselConfig} = this.props;
    const {width, height} = imgStyle || carouselConfig;

    const {action, imgUrl, component} = currItem;

    return (
      <div className="action-area" key={idx}
        onClick={idx => {
          $GH.CallFunc(action)(currItem, idx);
        }}>
        <div
          className="img"
          style={{
            backgroundImage: `url(${imgUrl})`,
            width, height
          }}></div>
        {/* <img src={imgUrl}/> */}
      </div>
    )
  }
  render() {
    const {activeIdx, activeBannerItem} = this.state;
    const {config, carouselConfig, onClickItem} = this.props;
    const {width, height, margin} = carouselConfig;
    const imgWHRate = width / height;
    const thumbImgStyle = {
      width: width / thumbRate,
      height: width / imgWHRate / thumbRate
    }

    return (
      <div
        className="carousel"
        style={{width, height, margin}}>
        <TransitionGroup>
          <CSSTransition
            key={activeIdx}
            classNames="banner"
            timeout={TRANSTION_TIME}>
            <div className="carousel-item">
              {this.genCarouselDOM(activeBannerItem, activeIdx)}
            </div>
          </CSSTransition>
        </TransitionGroup>
        <div className="thumb-contaner">
          {
            config.map((item, idx) => {
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
        <div
          className="prev-btn func-btn"
          onClick={e => this.setActiveIdx(activeIdx - 1)}>
            <i className={$UK.getIcon('backBtn', 'icon')}></i>
          </div>
        <div
          className="next-btn func-btn"
          onClick={e => this.setActiveIdx(activeIdx + 1)}>
            <i className={$UK.getIcon('backBtn', 'icon')}></i>
          </div>
      </div>
    )
  }
}
BannerCarousel.propTypes = {
  /**
   * config: [
   *   {
   *     action, url, component
   *   }
   * ]
   * @type {[type]}
   */
  config: PropTypes.array.isRequired,

  /* 设置轮播图控件的样式，和其他配置 */
  carouselConfig: PropTypes.object.isRequired,
  actionClass: PropTypes.string,
  isMobile: PropTypes.bool,
  onClickItem: PropTypes.func
}
