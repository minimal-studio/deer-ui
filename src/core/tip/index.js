import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

const Tip = ({scale = 10}) => {
  const tipStyle = {
    height: scale,
    width: scale
  };
  return (
    <div className="uke-tip-item" style={tipStyle}>
      <span className="tip" />
      <span className="tip animate" />
    </div>
  );
};
Tip.propTypes = {
  scale: PropTypes.number
};

export default Tip;
