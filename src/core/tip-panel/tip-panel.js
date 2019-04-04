import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import { ToolTip } from '../tooltip';
import { Icon } from '../icon';

export default class TipPanel extends PureComponent {
  static propTypes = {
    /** panel 的 title */
    title: PropTypes.string,
    /** panel 的一项内容 */
    text: PropTypes.string,
    /** panel 的类型 */
    type: PropTypes.oneOf([
      'warm',
      'error',
      'success',
      'normal',
    ]),
    /** 是否默认显示内容 */
    defaultShow: PropTypes.bool,
    /** 数据数据，任意类型，渲染出来带有序号 */
    texts: PropTypes.arrayOf(PropTypes.any),
    /** 是否需要内容收起展开的开关 */
    needToolTip: PropTypes.bool,
    /** 是否可收缩内容 */
    collapse: PropTypes.bool,
  };
  static defaultProps = {
    type: 'warm',
    needToolTip: false,
    defaultShow: true,
    collapse: true,
    title: '',
    text: '',
  }
  state = {
    showContent: this.props.defaultShow
  };
  // constructor(props) {
  //   super(props);

  //   const { defaultShow } = props;

  //   this.state = {
  //     showContent: defaultShow
  //   };
  // }
  toggleContent = () => {
    this.setState(({showContent}) => ({
      showContent: !showContent
    }));
  }
  render() {
    const { title, text, texts = [], type, needToolTip, defaultShow, collapse, ...other} = this.props;
    const { showContent } = this.state;

    const titleDOM = title && (
      <h4 className="title">
        <div onClick={collapse ? this.toggleContent : null}>
          {title}
          {
            collapse && (
              <Icon
                n={showContent ? "arrow-up" : "arrow-down"} />
            )
          }
        </div>
      </h4>
    );
  
    const textDOM = text && (
      <div className="item">{text}</div>
    );
  
    const textsDOM = [];
  
    for (let i = 0; i < texts.length; i++) {
      let currT = texts[i];
      if(currT) textsDOM.push((
        <div className="item" key={i}>{i + 1 + '.'} {currT}</div>
      ));
    }
  
    return (
      <div className={`tip-panel ${type}`} {...other}>
        {titleDOM}
        {
          showContent ? (
            <React.Fragment>
              {textDOM}
              {textsDOM}
            </React.Fragment>
          ) : null
        }
      </div>
    );
  }
} 
