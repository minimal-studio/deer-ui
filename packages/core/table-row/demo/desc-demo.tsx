import React, { useState } from 'react';
import { TableRow } from '..';
import { ShowModal } from '../../modal';
import MockData from '../../utils/mock-data';

const Test = () => {
  const longText = MockData[0];

  const columns = [
    {
      key: 'username',
      namesMapper: {
        alex: '埃里克斯',
        chili: '吃梨',
        dove: '德芙',
      }
    },
    { key: 'age' },
    { key: 'add' },
    // block 为占用一行
    { key: 'longText' },
    { key: 'desc2' },
    { key: 'desc3' },
    { key: 'desc4' },
  ];

  const records = [
    {
      username: 'alex',
      age: '100',
      add: 'cn',
      longText,
    },
    {
      username: 'chili',
      age: '102',
      add: 'cn',
    },
    {
      username: 'dove',
      age: '50',
      add: 'cn',
    },
    {
      username: 'susam',
      age: '20',
      add: 'uk',
    },
  ];
  const [activeIdx, setIdx] = useState(0);
  return (
    <div>
      {
        records.map((item, idx) => {
          return (
            <span
              className="btn default mr5 mb5"
              onClick={(e) => {
                setIdx(idx);
              }}
              key={idx}>查看{item.username}的数据</span>
          );
        })
      }
      <TableRow
        columns={columns}
        record={records[activeIdx]} />
    </div>
  );
};
