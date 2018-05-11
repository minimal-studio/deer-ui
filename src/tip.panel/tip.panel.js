import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import Popover from '../popover/popover.js';

export default class TipPanel extends PureComponent {
  // shouldUpdateComponent() {
  //   return false;
  // }
  render() {
    const {title, text, texts = [], type='warm'} = this.props;
    const titleDOM = title ? (
      <h4 className="title">{title}</h4>
    ) : '';
    const textDOM = text ? (
      <div className="item">{text}</div>
    ) : '';
    const textsDOM = [];

    for (let i = 0; i < texts.length; i++) {
      let currT = texts[i];
      if(currT) textsDOM.push((
        <div className="item" key={i}>{i + 1 + '.'} {currT}</div>
      ))
    }
    return (
      <div className={`panel-tip panel-${type}`}>
        {titleDOM}
        {textDOM}
        {textsDOM}
      </div>
    )
  }
}
TipPanel.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  texts: PropTypes.array,
};
