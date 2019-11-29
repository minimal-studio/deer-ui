import React from 'react';
import classNames from 'classnames';
// import { tuple } from '@mini-code/base-func/utils/type';
import { MakeReadOnly } from '../utils';

export type LayoutSpaces = 0 | 5 | 10 | 15 | 20 | 25 | 30;
export type RowSet = 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const JustifyItemsMap = {
  start: 'j-i-s',
  end: 'j-i-e',
  center: 'j-i-c',
  between: 'j-i-b',
  around: 'j-i-a',
};
const JustifyContentMap = {
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

export interface GridProps extends React.HTMLProps<HTMLElement> {
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
  /** justify-items */
  justifyItems?: keyof MakeReadOnly<typeof JustifyItemsMap>;
  /** justify-content */
  justify?: keyof MakeReadOnly<typeof JustifyContentMap>;
  /** justify-content */
  justifyContent?: keyof MakeReadOnly<typeof JustifyContentMap>;
  /** align-content */
  alignContent?: keyof MakeReadOnly<typeof AlignContentMap>;
  /** align-items */
  alignItems?: keyof MakeReadOnly<typeof AlignItemMap>;
  /** align-items */
  alignItem?: keyof MakeReadOnly<typeof AlignItemMap>;
  /** direction */
  direction?: keyof MakeReadOnly<typeof DirectionMap>;
  /** flex-wrap */
  wrap?: keyof MakeReadOnly<typeof WrapMap>;
  /** 是否作为容器 */
  container?: boolean;
  /** 是否作为子组件 */
  item?: boolean;
  /** style */
  style?: React.CSSProperties;
}

export const Grid: React.SFC<GridProps> = (props) => {
  const {
    children, className = '', style, component = 'div',
    space, container, item, justifyItems = '', justifyContent,
    direction = '', wrap = '',
    justify = '', alignContent = '', alignItem = '', alignItems = '',
    xs, sm, lg, xl, ...other
  } = props;
  const _alignItems = alignItems || alignItem;
  const _justifyContent = justifyContent || justify;
  const C = component;
  const isItem = typeof item != 'undefined' ? item : !container;
  const _className = classNames({
    [`grid g-container space-${space}`]: container,
    [JustifyItemsMap[justifyItems]]: container && justifyItems,
    [JustifyContentMap[_justifyContent]]: container && _justifyContent,
    [AlignContentMap[alignContent]]: container && alignContent,
    [AlignItemMap[_alignItems]]: container && _alignItems,
    [WrapMap[wrap]]: container && wrap,
    [DirectionMap[direction]]: container && direction,
    [`xs-${xs}`]: xs,
    [`sm-${sm}`]: sm,
    [`lg-${lg}`]: lg,
    [`xl-${xl}`]: xl,
    'g-item': isItem,
    [className]: className || '',
  });

  return (
    <C
      {...other}
      style={style}
      className={_className}>
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
