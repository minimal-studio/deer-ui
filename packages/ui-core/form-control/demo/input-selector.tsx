import React, { useState } from 'react';
import { InputSelector } from '..';

export default () => {
  const [value, setVal] = useState();
  return (
    <div>
      <h3>top left</h3>
      <InputSelector
        position="top"
        values={{
          value1: 'value1',
          value2: 'value2',
          value3: 'value3',
        }}
        onChange={(inputVal, selectorVal) => {
          console.log(inputVal, 'inputVal');
          console.log(selectorVal, 'selectorVal');
        }} />
      <hr />
      <h3>top right</h3>
      <InputSelector
        position="top,right"
        values={{
          value1: 'value1',
          value2: 'value2',
          value3: 'value3',
        }}
        onChange={(inputVal, selectorVal) => {
          console.log(inputVal, 'inputVal');
          console.log(selectorVal, 'selectorVal');
        }} />
    </div>
  );
};
