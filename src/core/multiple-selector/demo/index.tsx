import React, { useState } from 'react';
import { Multiple } from '..';

export default () => {
  return (
    <div style={{ width: 160, position: 'relative' }}>
      <Multiple
        onChange={(val) => {
          console.log(val);
        }}
        min={0}
        max={10000}
        range={[1, 10, 20, 30]} />
    </div>
  );
};
