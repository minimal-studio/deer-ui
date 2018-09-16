import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ToolTip from '../tooltip';

export default class TipPanel extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    defaultShow: PropTypes.bool,
    texts: PropTypes.array,
  };
  constructor(props) {
    super(props);

    const { defaultShow = true } = props;

    this.state = {
      showContent: defaultShow
    };
  }
  toggleContent() {
    this.setState({
      showContent: !this.state.showContent
    });
  }
  render() {
    const {title, text, texts = [], type = 'warm', ...other} = this.props;
    const {showContent} = this.state;

    const titleDOM = title ? (
      <h4 className="title">
        {title}
        <ToolTip
          title={showContent ? '缩起': '展开'}
          type={showContent ? "circle-up" : "circle-down"}
          onClick={e => this.toggleContent()}/>
      </h4>
    ) : null;
  
    const textDOM = text ? (
      <div className="item">{text}</div>
    ) : null;
  
    const textsDOM = [];
  
    for (let i = 0; i < texts.length; i++) {
      let currT = texts[i];
      if(currT) textsDOM.push((
        <div className="item" key={i}>{i + 1 + '.'} {currT}</div>
      ))
    }
  
    return (
      <div className={`panel-tip ${type}`} {...other}>
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
    )
  }
} 
