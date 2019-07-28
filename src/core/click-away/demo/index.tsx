import React, { useState } from 'react';
import { ClickAway } from '..';

export default () => {
  return (
    <div>
      <ClickAway onClickAway={(event) => {
        console.log(event, 'invoke ClickAway');
      }}>
        <div onClick={(e) => {
          console.log('点击了 children');
        }}>点击这里不会触发 ClickAway</div>
      </ClickAway>
    </div>
  );
};
