import React from 'react';

import { getIcon, Color } from '../utils';

export interface IconProps {
  /** 是否使用默认的 icon 配置 */
  useIconConfig?: boolean;
  /** icon name */
  n?: string;
  /** icon style, 具体查看 https://fontawesome.com/ 的描述 */
  s?: 's' | 'r' | 'l' | 'b';
  /** icon name */
  type?: string;
  /** color */
  color?: Color;
  /** className for icon */
  className?: HTMLElement['className'];
  /** multiple class names, 例如 ['class1', 'class2'] */
  classNames?: HTMLElement['className'][];
  /** style */
  style?: React.CSSProperties;
  /** style */
  onClick?: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const Icon: React.FC<IconProps> = (props) => {
  const {
    n, s, useIconConfig, type, classNames = [], className, color,
    ...other
  } = props;
  if (!n) return null;
  const iconClassName = getIcon((n || type), s, [
    'icon',
    (className || ''),
    color ? `t_${color}` : '',
    ...classNames
  ], useIconConfig);
  return (
    <i
      {...other}
      className={iconClassName}
    />
  );
};
Icon.defaultProps = {
  s: 's',
  useIconConfig: true,
  classNames: [],
};

const PureIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} useIconConfig={false} />
);

export {
  PureIcon
};
