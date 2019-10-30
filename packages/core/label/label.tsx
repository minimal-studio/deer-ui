import React from 'react';

import { Color } from '../utils/props';

export interface LabelProps {
  /** 内容 */
  text?: string;
  /** label 的背景颜色 */
  color?: Color;
  /** label 的字体颜色 */
  tColor?: Color;
  className?: string;
  children?: any;
}

const Label: React.SFC<LabelProps> = ({
  className, text, color = 'default', tColor = 'white', children, ...other
}) => {
  const child = children || text;
  return (
    <span {...other} className={`__label bg_${color} t_${tColor}${className ? ` ${className}` : ''}`}>{child}</span>
  );
};

export default Label;
