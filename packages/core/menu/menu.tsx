import React from 'react';

import { $T } from '../utils';
import { Icon, PureIcon, IconProps } from '../icon';

export interface MenuProps extends React.HTMLProps<HTMLDivElement> {
  /** 内容 */
  text?: any;
  /** Icon */
  icon?: string;
  /** 参考 PureIcon */
  pureIcon?: string;
  /** 参考 PureIcon */
  s?: IconProps['s'];
  /** isActive */
  isActive?: boolean;
}

const Menu: React.FC<MenuProps> = (props) => {
  const {
    isActive, text, icon, s, pureIcon, children, ...other
  } = props;
  const I = pureIcon ? <PureIcon n={pureIcon} /> : icon && <Icon n={icon} s={s} />;
  return (
    <div
      {...other}
      className={`menu-item${isActive ? ' active' : ''}`}
    >
      {I}
      {$T(text)}
      {children}
    </div>
  );
};

export default Menu;
