import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

const Tip = ({ scale = 10, color = 'theme', children, animate = true }) => {
  const tipStyle = {
    height: scale,
    width: scale
  };
  return (
    <div className="uke-tip-item" style={tipStyle}>
      <span className={"tip " + color} />
      {
        animate && (
          <span className={"tip animate " + color} />
        )
      }
      <span className="c">{children}</span>
    </div>
  );
};
Tip.propTypes = {
  scale: PropTypes.number,
  animate: PropTypes.bool,
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
