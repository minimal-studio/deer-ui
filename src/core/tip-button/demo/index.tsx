import React, { useState } from 'react';
import { TipButton } from '..';
import MockData from '../../utils/mock-data';

const test = () => {
  return (
    <div>
      <TipButton
        text="弹出层按钮"
        popover={(
          <div className="p15" style={{ maxWidth: 200 }}>
            {MockData[1]}
          </div>
        )}
        timer={10000}
        onClick={(e) => {
          console.log(e);
        }}/>
    </div>
  );
};
