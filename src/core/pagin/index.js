import React from 'react';
import Pagin from './pagin';

const PagingBtn = (props) => {
  console.log(window.$UKE.getUkeKeyMap('PagingBtn 要废弃了，请使用 Pagin 代替'));
  return (
    <Pagin {...props}/>
  );
};

export {
  Pagin, PagingBtn
};
