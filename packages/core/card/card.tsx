import React from 'react';
import classnames from 'classnames';

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
  /** padding */
  p?: number;
  /** 是否作为容器 */
  container?: boolean;
  overflow?: 'auto' | 'hidden' | 'scroll' | 'visible';
}

export const Card: React.SFC<CardProps> = ({
  children, className,
  container,
  p = 0.1,
  overflow = 'hidden',
  style,
  ...other
}) => {
  const classes = classnames(
    className,
    container ? 'card-container' : 'card-item'
  );
  return (
    <div
      {...other}
      style={{
        ...style,
        padding: p,
        overflow
      }}
      className={classes}
    >
      {children}
    </div>
  );
};

export const CardContainer: React.SFC<CardProps> = (props) => (
  <Card
    {...props}
    container
  />
);
