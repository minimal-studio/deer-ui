import React from 'react';
import classnames from 'classnames';

import { Color, Children } from '../utils/props';

export interface LabelProps extends React.HTMLProps<HTMLSpanElement> {
  /** 内容 */
  text?: string;
  /** label 的背景颜色 */
  color?: Color;
  /** label 的字体颜色 */
  tColor?: Color;
  className?: HTMLElement['className'];
  children?: Children;
}

export const Label: React.FC<LabelProps> = ({
  className, text, color = 'default', tColor = 'white', children, ...other
}) => {
  const child = children || text;
  const classes = classnames([
    '__label',
    `bg_${color}`,
    `t_${tColor}`,
    className && className
  ]);
  return (
    <span {...other} className={classes}>{child}</span>
  );
};
