import React from 'react';

import Menu, { MenuProps } from './menu';
import { DivideType } from '../utils/props';

export interface MenuItemData extends MenuProps {
  /** 点击 Menu 的回调 */
  action?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export interface MenusProps {
  /** Menus 数据，可以为 Menu 的数据结构，如果为 '-' 或 'hr'，则渲染分隔线 */
  data?: (MenuItemData | DivideType)[];
}

const menuDividGroup = ['-', 'hr'];

const Menus: React.SFC<MenusProps> = (props) => {
  const { data, children } = props;
  return (
    <span className="__menus">
      {
        data ? data.map((item, idx) => {
          if (!item) return null;
          if (typeof item === 'string' && menuDividGroup.indexOf(item) !== -1) {
            return (
              <hr key={idx} />
            );
          }
          const { action, id, ...other } = item as MenuItemData;
          return (
            <Menu key={id || idx} onClick={action} {...other} />
          );
        }) : children
      }
    </span>
  );
};

export default Menus;
