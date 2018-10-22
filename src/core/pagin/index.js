import React from 'react';
import Pagination from './pagin';

const PagingBtn = (props) => {
  console.log(window.$UKE.getUkeKeyMap('PagingBtn 要废弃了，请使用 Pagin 代替'));
  return (
    <Pagination {...props}/>
  );
};

export {
  Pagination, PagingBtn
};
