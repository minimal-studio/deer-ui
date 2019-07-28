import React, { useState } from 'react';
import { SubContent } from '..';

export default () => {
  return (
    <div>
      <SubContent displayElem={'鼠标移至此处出现隐藏的内容'}>
        显示的内容
      </SubContent>
    </div>
  );
};
