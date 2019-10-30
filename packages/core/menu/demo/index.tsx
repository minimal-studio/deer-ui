import React, { useState } from 'react';
import { Menus, Menu } from '..';

export default () => {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ height: 300 }}>
      <Menus data={[
        {
          id: 1,
          text: '菜单1',
          icon: 'check',
          action: () => {}
        },
        {
          id: 2,
          text: '菜单2',
          action: () => {}
        },
        {
          id: 3,
          text: '菜单3',
          action: () => {}
        },
        {
          id: 4,
          text: '菜单4',
          action: () => {}
        },
        '-',
        {
          id: 7,
          text: '菜单5',
          action: () => {}
        },
      ]} />

      <Menus>
        <Menu icon="check">Menu1</Menu>
        <Menu>Menu2</Menu>
        <Menu>Menu3</Menu>
        <Menu onClick={(e) => { console.log('Menu4'); }}>Menu4</Menu>
        <hr />
        <Menu>Menu5</Menu>
      </Menus>
    </div>
  );
};
