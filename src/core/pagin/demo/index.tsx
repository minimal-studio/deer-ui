import React, { useState } from 'react';
import { Pagination } from '..';

export default () => {
  const [pagingInfo, setPagin] = useState({
    active: true,
    total: 1000,
    pIdx: 0,
    pSize: 10
  });
  return (
    <Pagination
      onPagin={(nextPagin) => {
        console.log(nextPagin);
        setPagin(nextPagin);
      }}
      pagingInfo={pagingInfo}/>
  );
};

const Test1 = () => {
  /** 支持自定义数据结构 */
  const [pagingInfo, setPagin] = useState({
    Active: true,
    Total: 1000,
    PIdx: 0,
    PSize: 10
  });
  const paginTransfer = {
    active: 'Active',
    total: 'Total',
    pIdx: 'PIdx',
    pSize: 'PSize'
  };
  return (
    <Pagination
      onPagin={(nextPagin) => {
        console.log(nextPagin);
        setPagin(nextPagin);
      }}
      infoMapper={paginTransfer}
      pagingInfo={pagingInfo}/>
  );
};
