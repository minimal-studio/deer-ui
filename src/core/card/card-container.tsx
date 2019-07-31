import React from 'react';

interface CardContainerProps {
  /** className */
  className?: string;
  /** style */
  style?: React.CSSProperties;
  /** 是否树立排版 */
  isCol?: boolean;
}

const CardContainer: React.SFC<CardContainerProps> = ({ children, className, style }) => (
  <div
    style={style}
    className={`card-container ${className || ''}`}>
    {children}
  </div>
);

export default CardContainer;
