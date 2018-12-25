import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const LayoutSpaces = [0, 5, 10, 15, 20, 25, 30];
const RowSet = ['auto', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const JustifyMap = {
  start: 'j-c-s',
  end: 'j-c-e',
  center: 'j-c-c',
  between: 'j-c-b',
  around: 'j-c-a',
};
const AlignContentMap = {
  start: 'a-c-start',
  end: 'a-c-e',
  center: 'a-c-c',
  between: 'a-c-b',
  around: 'a-c-around',
  stretch: 'a-c-str',
};
const AlignItemMap = {
  start: 'a-i-start',
  end: 'a-i-e',
  center: 'a-i-c',
  baseline: 'a-i-bl',
  stretch: 'a-i-str',
};
const WrapMap = {
  wrap: 'wrap',
  nowrap: 'nowrap',
};
const DirectionMap = {
  col: 'col',
  reCol: 're-col',
  row: 'row',
  reRow: 're-row',
};
const JustifyProps = Object.keys(JustifyMap);
const AlignContentProps = Object.keys(AlignContentMap);
const AlignItemProps = Object.keys(AlignItemMap);
const DirectionProps = Object.keys(DirectionMap);
const WrapProps = Object.keys(WrapMap);

const Grid = (props) => {
  const {
    children, className, style, component,
    space, container, item, 
    direction, wrap,
    justify, alignContent, alignItem,
    xs, sm, lg, xl
  } = props;
  const C = component;
  const isItem = typeof item != 'undefined' ? item : !container;
  const _className = classNames({
    [className]: className || '',
    [JustifyMap[justify]]: container && justify,
    [AlignContentMap[alignContent]]: container && alignContent,
    [AlignItemMap[alignItem]]: container && alignItem,
    [WrapMap[wrap]]: container && wrap,
    [DirectionMap[direction]]: container && direction,
    [`xs-${xs}`]: xs,
    [`sm-${sm}`]: sm,
    [`lg-${lg}`]: lg,
    [`xl-${xl}`]: xl,
    [`j-c-c`]: xl,
    'g-item': isItem,
  });

  return (
    <C 
      style={style}
      className={`${container ? `grid space-${space} ` : ''} ${_className}`}>
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
  xs: PropTypes.oneOf(RowSet),
  /** 对于 屏幕宽度 < 768px, > 576px 的分布 */
  sm: PropTypes.oneOf(RowSet),
  /** 对于 屏幕宽度 < 992px, > 768px 的分布 */
  lg: PropTypes.oneOf(RowSet),
  /** 对于 屏幕宽度 < 1200px, > 992px 的分布 */
  xl: PropTypes.oneOf(RowSet),
  /** justify-content */
  justify: PropTypes.oneOf(JustifyProps),
  /** justify-content */
  alignContent: PropTypes.oneOf(AlignContentProps),
  /** justify-item */
  alignItem: PropTypes.oneOf(AlignItemProps),
  /** 是否作为容器 */
  container: PropTypes.bool,
  /** 方向 */
  direction: PropTypes.oneOf(DirectionProps),
  /** flex-wrap */
  wrap: PropTypes.oneOf(WrapProps),
  /** 是否作为子组件 */
  item: PropTypes.bool,
  /** 顾名思义 */
  style: PropTypes.shape({}),
  /** row 为多少，详情参考 布局系统 layout */
  // row: PropTypes.oneOf(RowSet),
};
Grid.defaultProps = {
  component: 'div',
  space: 0,
  direction: 'row',
  wrap: 'wrap',
  container: false,
  // item: false,
};

export default Grid;