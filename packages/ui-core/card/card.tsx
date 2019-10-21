import React from 'react';

interface CardProps {
  /** padding */
  p?: number;
  /** className */
  className?: string;
  /** style */
  style?: React.CSSProperties;
}

const Card: React.SFC<CardProps> = ({
  children, className, style, p = 0.1
}) => (
  <div
    style={{
      ...style,
      padding: p
    }}
    className={`card ${className ? ` ${className}` : ''}`}>
    {children}
  </div>
);

export default Card;
