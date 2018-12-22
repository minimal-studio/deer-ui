import React from 'react';
import PropTypes from 'prop-types';

const GUTTERS = [0, 8, 16, 24, 32, 40];
const GRID_SIZES = ['auto', true, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Gird = (props) => {
  const {
    children, row, className, style, component,
    space, container, item
  } = props;
  console.log(props)
  const C = component;

  return (
    <C 
      style={style}
      className={`layout row-${row} ${(className ? className : '')}`}>
      {children}
    </C>
  );
};

Gird.propTypes = {
  /** 顾名思义 */
  children: PropTypes.node,
  /** 用于包装的外层组件 */
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.oneOf([
      'div', 'span'
    ])
  ]),
  /** 顾名思义 */
  className: PropTypes.string,
  /** 该 Gird 分多少份 */
  space: PropTypes.oneOf(GUTTERS),
  /** 是否作为容器 */
  container: PropTypes.bool,
  /** 是否作为子组件 */
  item: PropTypes.bool,
  /** 顾名思义 */
  style: PropTypes.shape({}),
  /** row 为多少，详情参考 布局系统 layout */
  row: PropTypes.oneOf(GRID_SIZES),
};
Gird.defaultProps = {
  component: 'div',
  space: 24,
  container: false,
  item: false,
  row: 24,
};

export default Gird;