import React from 'react';
import PropTypes from 'prop-types';

const Label = ({text, color = 'blue', ...other}) => {
  return (
    <span className={"uke-label " + color} {...other}>{text}</span>
  );
};
Label.propTypes = {
  /** 内容 */
  text: PropTypes.string,
  /** label 的颜色 */
  color: PropTypes.oneOf([
    'blue',
    'red',
    'green',
    'black',
    'cyan',
    'orange',
  ]),
};

export default Label;