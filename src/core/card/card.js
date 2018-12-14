import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, row = 20, className, style }) => {
  return (
    <div 
      style={style}
      className={"card row-" + row + (className ? ' ' + className : '')}>
      {children}
    </div>
  );
};

Card.propTypes = {
  /** 顾名思义 */
  className: PropTypes.string,
  /** 顾名思义 */
  style: PropTypes.shape({}),
  /** row 为多少，详情参考 布局系统 layout */
  row: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ])
};

const CardContainer = ({ children, isCol, className, style }) => {
  return (
    <div
      style={style}
      className={"card-container layout" + (isCol ? ' col' : '') + (className ? ' ' + className : '')}>
      {children}
    </div>
  );
};

CardContainer.propTypes = {
  /** 顾名思义 */
  className: PropTypes.string,
  /** 顾名思义 */
  style: PropTypes.shape({}),
  /** 是否树立排版 */
  isCol: PropTypes.bool
};

export {
  Card, CardContainer
};