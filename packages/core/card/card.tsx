import React from 'react';

interface CardProps extends React.HTMLProps<HTMLElement> {
  /** padding */
  p?: number;
}

export const Card: React.SFC<CardProps> = ({
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
