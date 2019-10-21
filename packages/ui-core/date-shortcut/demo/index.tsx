import React, { useState } from 'react';
import { DateShortcut } from '..';

export default () => {
  const [value, setVal] = useState([]);
  return (
    <div>
      <div>
        <DateShortcut style={{ width: 300 }}
          outputAsString={true}
          onChange={val => setVal(val)}/>
        <br/>
        返回值: {value.join(' - ')}
      </div>
      <div>
        <DateShortcut style={{ width: 300 }}
          outputAsString={true}
          needTime={false}
          onChange={val => setVal(val)}/>
        <br/>
            返回值: {value.join(' - ')}
      </div>
      <div>
        <DateShortcut style={{ width: 300 }}
          onChange={val => setVal(val)}/>
        <br/>
            返回值: {value.join(' - ')}
      </div>
    </div>
  );
};
