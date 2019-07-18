import React from 'react';

interface CardContainerProps {
  /** 顾名思义 */
  className: string;
  /** 顾名思义 */
  style: {};
  /** 是否树立排版 */
  isCol: boolean;
}

const CardContainer: React.SFC<CardContainerProps> = ({ children, className, style }) => {
  return (
    <div
      style={style}
      className={"card-container " + (className ? className : '')}>
      {children}
    </div>
  );
};

export default CardContainer;
