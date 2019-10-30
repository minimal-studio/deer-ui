import React from 'react';

import { Pop } from '..';

const Test = () => {
  return (
    <div style={{ overflowX: 'auto', position: 'relative', width: '100%' }}>
      <div className="layout j-c-b" style={{ width: '110%' }}>
        <span className="mr10 p10 flex bg_default" onMouseEnter={(e) => {
          Pop.show({
            elem: e.target,
            props: {
              showCloseBtn: false,
              position: 'top',
              type: 'red'
            },
            children: (
              <div className="p10">
              任意内容任意内容任意内容任意内容<br />
              任意内容任意内容任意内容任意内容<br />
              任意内容任意内容任意内容任意内容<br />
              任意内容任意内容任意内容任意内容<br />
              </div>
            )
          });
        }} onMouseLeave={(e) => {
          Pop.close();
        }}>
        向上弹出
        </span>
        <span className="mr10 p10 flex bg_default" onMouseEnter={(e) => {
          Pop.show({
            elem: e.target,
            props: {
              showCloseBtn: false,
              position: 'bottom',
              type: 'red'
            },
            children: (
              <div className="p10">任意内容</div>
            )
          });
        }} onMouseLeave={(e) => {
          Pop.close();
        }}>
        向下弹出
        </span>
        <span className="mr10 p10 flex bg_default" onMouseEnter={(e) => {
          Pop.show({
            elem: e.target,
            props: {
              showCloseBtn: false,
              position: 'left',
              type: 'red'
            },
            children: (
              <div className="p10">任意内容</div>
            )
          });
        }} onMouseLeave={(e) => {
          Pop.close();
        }}>
        向左弹出
        </span>
        <span className="mr10 p10 flex bg_default" onMouseEnter={(e) => {
          Pop.show({
            elem: e.target,
            props: {
              showCloseBtn: false,
              position: 'right',
              type: 'red'
            },
            children: (
              <div className="p10">任意内容</div>
            )
          });
        }} onMouseLeave={(e) => {
          Pop.close();
        }}>
        向右弹出
        </span>
      </div>
    </div>
  );
};
