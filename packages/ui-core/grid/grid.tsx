import React from 'react';
import classNames from 'classnames';
import { tuple } from 'basic-helper/utils/type';
import { Children } from '../utils/props';

export type LayoutSpaces = 0 | 5 | 10 | 15 | 20 | 25 | 30;
export type RowSet = 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

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
const JustifyProps = tuple(...Object.keys(JustifyMap));
const AlignContentProps = tuple(...Object.keys(AlignContentMap));
const AlignItemProps = tuple(...Object.keys(AlignItemMap));
const DirectionProps = tuple(...Object.keys(DirectionMap));
const WrapProps = tuple(...Object.keys(WrapMap));
// const JustifyProps = Object.keys(JustifyMap);
// const AlignContentProps = Object.keys(AlignContentMap);
// const AlignItemProps = Object.keys(AlignItemMap);
// const DirectionProps = Object.keys(DirectionMap);
// const WrapProps = Object.keys(WrapMap);
// const LayoutSpaces = [0, 5, 10, 15, 20, 25, 30];
// const RowSet = ['auto', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export interface GridProps {
  /** children */
  children?: any;
  /** 用于包装的外层组件 */
  component?: React.ElementType | 'div' | 'span';
  /** className */
  className?: string;
  /** 边框的宽度 */
  space?: LayoutSpaces;
  /** 对于 屏幕宽度 < 576px 的分布 */
  xs?: RowSet;
  /** 对于 屏幕宽度 < 768px, > 576px 的分布 */
  sm?: RowSet;
  /** 对于 屏幕宽度 < 992px, > 768px 的分布 */
  lg?: RowSet;
  /** 对于 屏幕宽度 < 1200px, > 992px 的分布 */
  xl?: RowSet;
  /** justify-content */
  justify?: (typeof JustifyProps)[number];
  /** justify-content */
  alignContent?: (typeof AlignContentProps)[number];
  /** justify-item */
  alignItem?: (typeof AlignItemProps)[number];
  /** 方向 */
  direction?: (typeof DirectionProps)[number];
  /** flex-wrap */
  wrap?: (typeof WrapProps)[number];
  /** 是否作为容器 */
  container?: boolean;
  /** 是否作为子组件 */
  item?: boolean;
  /** style */
  style?: React.CSSProperties;
}

const Grid: React.SFC<GridProps> = (props) => {
  const {
    children, className = '', style, component = 'div',
    space, container, item,
    direction = '', wrap = '',
    justify = '', alignContent = '', alignItem = '',
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
    'g-container': container,
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

Grid.defaultProps = {
  component: 'div',
  space: 0,
  direction: 'row',
  wrap: 'wrap',
  container: false,
  // item: false,
};

export default Grid;
