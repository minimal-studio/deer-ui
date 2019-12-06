import React from 'react';
import classnames from 'classnames';
import { ContainerSizes } from '../utils';

export interface ContainerProps extends React.HTMLProps<HTMLDivElement> {
  /** 是否流布局，100% 宽度 */
  fluid?: boolean;
  size?: ContainerSizes;
  maxWidth?: React.CSSProperties['maxWidth'];
  /** 是否自动左右对齐 */
  autoAlign?: boolean;
}

/**
 * 容器，默认最大宽度为
 */
const Container: React.SFC<ContainerProps> = (props) => {
  const {
    fluid, size = 'xl', className, children, maxWidth, autoAlign = true,
    style,
    ...other
  } = props;
  const classes = classnames([
    className,
    'container',
    fluid && 'fluid',
    autoAlign && 'auto',
    size,
  ]);
  return (
    <div
      {...other}
      style={Object.assign({}, style, {
        maxWidth
      })}
      className={classes}
    >
      {children}
    </div>
  );
};

export default Container;
