import React, { useState } from 'react';
import { Toast } from '..';

const Demo = () => {
  let toast;
  return (
    <div className="relative">
      <div style={{ height: 100 }}></div>
      <span className="btn green mr10" onClick={(e) => {
        toast.show('打开了一个 Toast', 'success');
      }}>成功</span>
      <span className="btn red" onClick={(e) => {
        toast.show('打开了一个 Toast', 'error');
      }}>失败</span>
      <Toast ref={(e) => { toast = e; }}/>
    </div>
  );
};
