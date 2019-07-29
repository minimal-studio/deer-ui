import React, { useState } from 'react';
import { Label } from '..';

export default () => {
  return (
    <div>
      <Label tColor="blue">
      blue
      </Label>
      <Label tColor="green">
      green
      </Label>
      <Label tColor="red">
      red
      </Label>
      <Label tColor="orange">
      orange
      </Label>
      <Label tColor="black" color="default">
      black
      </Label>
    </div>
  );
};
