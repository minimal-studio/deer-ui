import React from 'react';
import { DropdownWrapper } from '..';

const Test1 = () => {
  return (
    <DropdownWrapper menuTitle="标题" overlay={(e) => {
      return (
        <div className="p10" style={{ width: 400 }}>
          任意内容
        </div>
      );
    }} />
  );
};
const Test2 = () => {
  return (
    <DropdownWrapper overlay={() => {
      return (
        <div className="p10" style={{ width: 400 }}>
          弹出内容
        </div>
      );
    }}>
      {
        (options) => {
          return (
            <div>显示内容</div>
          );
        }
      }
    </DropdownWrapper>
  );
};
