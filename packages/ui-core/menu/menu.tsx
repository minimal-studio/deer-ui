import React from 'react';

import { $T } from '../config';
import { Icon, PureIcon } from '../icon';
import { IconProps } from '../icon/icon';

export interface MenuProps {
  /** 内容 */
  text?: any;
  /** ID */
  id?: string | number;
  /** Icon */
  icon?: string;
  /** 参考 PureIcon */
  pureIcon?: string;
  /** 参考 PureIcon */
  s?: IconProps['s'];
  /** isActive */
  isActive?: boolean;
  /** 点击 Menu 的回调 */
  onClick?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Menu: React.SFC<MenuProps> = (props) => {
  const {
    isActive, text, icon, s, pureIcon, children, id, ...other
  } = props;
  const I = pureIcon ? <PureIcon n={pureIcon} /> : icon && <Icon n={icon} s={s} />;
  return (
    <div
      className={`menu-item${isActive ? ' active' : ''}`}
      {...other}>
      {I}
      {$T(text)}
      {children}
    </div>
  );
};

export default Menu;
