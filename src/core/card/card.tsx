import React from 'react';

interface CardProps {
  /** padding */
  p?: number;
  /** 顾名思义 */
  className?: string;
  /** style */
  style?: {};
}

const Card: React.SFC<CardProps> = ({ children, className, style, p = 0.1 }) => {
  return (
    <div 
      style={{
        ...style,
        padding: p
      }}
      className={"card " + (className ? ' ' + className : '')}>
      {children}
    </div>
  );
};

export default Card;
