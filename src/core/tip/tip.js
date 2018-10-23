import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

const Tip = ({scale = 10, color = 'theme'}) => {
  const tipStyle = {
    height: scale,
    width: scale
  };
  return (
    <div className="uke-tip-item" style={tipStyle}>
      <span className={"tip " + color} />
      <span className={"tip animate " + color} />
    </div>
  );
};
Tip.propTypes = {
  scale: PropTypes.number,
  color: PropTypes.oneOf([
    'black',
    'theme',
    'blue',
    'red',
    'green',
    'gold',
  ]),
};

export default Tip;
