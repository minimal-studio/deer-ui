import React from 'react';
import classnames from 'classnames';

interface CardProps extends React.HTMLProps<HTMLDivElement> {
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
  const classes = classnames({
    [className]: !!className,
    'card-container': !!container,
    'card-item': !container,
  });
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
