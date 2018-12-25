import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className, style, p = 0.1 }) => {
  return (
    <div 
      style={{
        style,
        padding: p
      }}
      className={"card " + (className ? ' ' + className : '')}>
      {children}
    </div>
  );
};

Card.propTypes = {
  /** padding */
  p: PropTypes.number,
  /** 顾名思义 */
  className: PropTypes.string,
  /** 顾名思义 */
  style: PropTypes.shape({}),
};

const CardContainer = ({ children, className, style }) => {
  return (
    <div
      style={style}
      className={"card-container " + (className ? className : '')}>
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