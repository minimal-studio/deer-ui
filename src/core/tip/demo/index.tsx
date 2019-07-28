import React, { useState } from 'react';
import { Tip } from '..';

const test = () => {
  return (
    <div>
      <span className="relative p10">
        写些什么吧
        <Tip color="red"/>
      </span>

      <span className="relative p10">
        有什么好写的
        <Tip color="blue"/>
      </span>

      <span className="relative p10">
        说好的呢
        <Tip color="green"/>
      </span>
    </div>
  );
};

const test2 = () => {
  return (
    <div>
      <span className="relative p10">
        带动画的未读数提示
        <Tip color="red" scale={20}>12</Tip>
      </span>
      <hr />
      <span className="relative p10">
        未读数提示
        <Tip color="red" animate={false} scale={20}>12</Tip>
      </span>
    </div>
  );
};
