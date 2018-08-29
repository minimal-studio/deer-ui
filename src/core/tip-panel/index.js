import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import Popover from '../popover/popover.js';

const TipPanel = ({title, text, texts = [], type = 'warm', ...other}) => {
  const titleDOM = title ? (
    <h4 className="title">{title}</h4>
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
      {textDOM}
      {textsDOM}
    </div>
  )
}
TipPanel.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  texts: PropTypes.array,
};

export default TipPanel;
