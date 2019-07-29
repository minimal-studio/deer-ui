import React from 'react';
import { Checkbox } from '..';

const Test1 = () => {
  return (
    <Checkbox onChange={(val) => {
      console.log(val);
    }} values={{
      1: 'A',
      2: 'B',
      3: 'C',
    }} />
  );
};
const Test2 = () => {
  return (
    <Checkbox
      n="star"
      onChange={(val) => {
        console.log(val);
      }}
      values={{
        1: 'A',
        2: 'B',
        3: 'C',
      }} />
  );
};
