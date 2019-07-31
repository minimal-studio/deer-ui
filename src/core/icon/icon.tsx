import React from 'react';

import { getIcon } from '../config';

export interface IconProps {
  /** 是否使用默认的 icon 配置 */
  useIconConfig?: boolean;
  /** icon name */
  n?: string;
  /** icon style, 具体查看 https://fontawesome.com/ 的描述 */
  s?: 's' | 'r' | 'l' | 'b';
  /** icon name */
  type?: string;
  /** className for icon */
  className?: string;
  /** multiple class names, 例如 ['class1', 'class2'] */
  classNames?: string[];
  /** style */
  style?: React.CSSProperties;
  /** style */
  onClick?: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const Icon: React.SFC<IconProps> = (props) => {
  const {
    n, s, useIconConfig, type, classNames = [], className, ...other
  } = props;
  const iconClassName = getIcon((n || type), s, ['icon', (className || ''), ...classNames], useIconConfig);
  return (
    <i
      {...other}
      className={iconClassName} />
  );
};
Icon.defaultProps = {
  n: 'none',
  s: 's',
  useIconConfig: true,
  classNames: [],
};

const PureIcon: React.SFC<IconProps> = props => (
  <Icon {...props} useIconConfig={false} />
);

export {
  PureIcon
};

export default Icon;
