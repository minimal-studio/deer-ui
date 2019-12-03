import React from 'react';
import { $T_IN } from '../utils';
import { Icon } from '../icon';

const NodataTip = () => {
  return (
    <span className="no-record-tip">
      <div>
        <Icon n="noData"/>
      </div>
      <div className="text">{$T_IN('暂无记录')}</div>
    </span>
  );
};

export default NodataTip;
