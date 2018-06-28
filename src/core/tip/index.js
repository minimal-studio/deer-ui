import React, {Component, PureComponent} from 'react';

const Tip = ({scale = 10}) => {
  const tipStyle = {
    height: scale,
    width: scale
  }
  return (
    <div className="uke-tip-item" style={tipStyle}>
      <span className="tip"></span>
      <span className="tip animate"></span>
    </div>
  )
}

export default Tip;
