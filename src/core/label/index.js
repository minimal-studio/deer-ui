import React from 'react';

const Label = ({text, color = 'blue', ...other}) => {
  return (
    <span className={"uke-label " + color} {...other}>{text}</span>
  )
}

export default Label;