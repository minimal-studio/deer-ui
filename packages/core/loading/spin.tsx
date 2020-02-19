import React from 'react';
import { Icon } from '../icon';
import { Color } from '../utils';

export default function Spinning({
  color = 'black', className = ''
}: {
  color: Color;
}) {
  return (
    <Icon n="loading" color={color} classNames={['spinning', className]} />
  );
}
