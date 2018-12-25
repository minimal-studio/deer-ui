import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const LayoutSpaces = [0, 5, 10, 15, 20, 25, 30];
const RowSet = ['auto', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Grid = (props) => {
  const {
    children, className, style, component,
    space, container, item,
    xs, sm, lg, xl
  } = props;
  const C = component;
  const _className = classNames({
    [className]: className,
    [xs]: `xs-${xs}`,
    [sm]: `sm-${sm}`,
    [lg]: `lg-${lg}`,
    [xl]: `xl-${xl}`,
  });

  return (
    <C 
      style={style}
      className={`${container ? `layout space-${space} ` : ''} ${_className}`}>
      {children}
    </C>
  );
};

Grid.propTypes = {
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
  /** 边框的宽度 */
  space: PropTypes.oneOf(LayoutSpaces),
  /** 对于 屏幕宽度 < 576px 的分布 */
  xs: PropTypes.oneOf(LayoutSpaces),
  /** 对于 屏幕宽度 < 768px, > 576px 的分布 */
  sm: PropTypes.oneOf(LayoutSpaces),
  /** 对于 屏幕宽度 < 992px, > 768px 的分布 */
  lg: PropTypes.oneOf(LayoutSpaces),
  /** 对于 屏幕宽度 < 1200px, > 992px 的分布 */
  xl: PropTypes.oneOf(LayoutSpaces),
  /** 是否作为容器 */
  container: PropTypes.bool,
  /** 是否作为子组件 */
  item: PropTypes.bool,
  /** 顾名思义 */
  style: PropTypes.shape({}),
  /** row 为多少，详情参考 布局系统 layout */
  row: PropTypes.oneOf(RowSet),
};
Grid.defaultProps = {
  component: 'div',
  space: 24,
  container: false,
  item: false,
};

export default Grid;