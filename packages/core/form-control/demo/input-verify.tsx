import React, { useState } from 'react';
import { InputNumber } from '..';

export default () => {
  const [value, setVal] = useState();
  return (
    <div>
      <InputNumber
        onFocus={(e) => {}}
        onBlur={(e) => {}}
        onClear={(e) => {}}
        className={''}
        defaultValue={''}
        needCN={false}
        precent={false}
        inputable={true}
        numRange={[1, 100]}
        unit={2}
        lenRange={[1, 20]}
        onChange={(val) => {
          console.log(val);
        }} />
    </div>
  );
};
