import React, { useState } from 'react';
import { Ranger } from '..';

export default () => {
  return (
    <div>
      <h4>范围 0 ~ 100</h4>
      <Ranger
        range={[0, 100]}
        withInput={false}
        onChange={(val) => {
        }
        } />
      <Ranger
        range={[0, 100]}
        withInput
        onChange={(val) => {
        }
        } />
      <Ranger
        range={[0, 100]}
        basicUnit={5}
        onChange={(val) => {
        }
        } />
      <Ranger
        range={[0, 100]}
        precent
        onChange={(val) => {
        }
        } />
    </div>
  );
};
