import React, { useState } from 'react';
import { Slider } from '..';

export default () => {
  return (
    <div>
      <h4>范围 0 ~ 100</h4>
      <Slider
        range={[0, 100]}
        withInput={false}
        onChange={(val) => {
        }
        } />
      <Slider
        range={[0, 100]}
        withInput
        onChange={(val) => {
        }
        } />
      <Slider
        range={[0, 100]}
        basicUnit={5}
        onChange={(val) => {
        }
        } />
      <Slider
        range={[0, 100]}
        precent
        onChange={(val) => {
        }
        } />
    </div>
  );
};
