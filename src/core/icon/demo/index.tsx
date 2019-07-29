import React, { useState } from 'react';
import { Icon, PureIcon } from '..';

export default () => {
  return (
    <div>
      <Icon n="balance-scale" classNames={['ms10']} style={{ fontSize: 20 }} />
      <Icon n="allergies" classNames={['ms10']} style={{ fontSize: 20 }} />
      <Icon n="address-book" classNames={['ms10']} style={{ fontSize: 20 }} />
      <Icon n="address-card" classNames={['ms10']} style={{ fontSize: 20 }} />
      <PureIcon n="fas fa-dungeon" classNames={['ms10']} style={{ fontSize: 20 }} />
    </div>
  );
};
