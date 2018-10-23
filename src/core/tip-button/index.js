import React from 'react';
import TipButton from './tip-button';

const TipBtn = (props) => {
  console.log('TipBtn 这个名字已经改名为 TipButton');
  return (
    <TipButton {...props}/>
  );
};

export {
  TipBtn, TipButton
};