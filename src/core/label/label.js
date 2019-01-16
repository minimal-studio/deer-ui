import React from 'react';
import PropTypes from 'prop-types';

import { ColorProps } from '../uke-utils/props';

const Label = ({className, text, color = 'blue', tColor = 'white', children, ...other}) => {
  const child = children || text;
  return (
    <span {...other} className={"uke-label bg_" + color + ' t_' + tColor + (className ? ' ' + className : '')}>{child}</span>
  );
};
Label.propTypes = {
  /** 内容 */
  text: PropTypes.string,
  /** label 的背景颜色 */
  color: ColorProps,
  /** label 的字体颜色 */
  tColor: ColorProps,
};

export default Label;