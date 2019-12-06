import React from 'react';

import { DivideType } from '../utils/props';
import Menu, { MenuProps } from './menu';

export interface MenuItemData extends MenuProps {
  id?: string | number;
  /** 点击 Menu 的回调 */
  action?: MenuProps['onClick'];
}

export interface MenusProps {
  /** Menus 数据，可以为 Menu 的数据结构，如果为 '-' 或 'hr'，则渲染分隔线 */
  data?: (MenuItemData | DivideType)[];
  padding?: 0 | 5 | 10 | 15 | 20;
  className?: string;
}

const menuDividGroup = ['-', 'hr'];

const Menus: React.SFC<MenusProps> = (props) => {
  const {
    data, padding = 10, children, className = '__menus', ...other
  } = props;
  return (
    <div
      {...other}
      className={`${className} ${padding ? `p${padding}` : ''}`}
    >
      {
        data ? data.map((item, idx) => {
          if (!item) return null;
          if (typeof item === 'string' && menuDividGroup.indexOf(item) !== -1) {
            return (
              <hr key={idx} />
            );
          }
          const { action, id, ...otherForMenu } = item as MenuItemData;
          return (
            <Menu key={id || idx} onClick={action} {...otherForMenu} />
          );
        }) : children
      }
    </div>
  );
};

export default Menus;
