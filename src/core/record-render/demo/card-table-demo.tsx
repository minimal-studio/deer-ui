import React from 'react';
import { CardTable, DescHelper } from '..';
import { ShowModal } from '../../modal';

const test1 = () => {
  const columns = [
    {
      key: 'username',
      title: (mapper) => {
        return (
          <span>Func Title</span>
        );
      },
      namesMapper: {
        alex: '埃里克斯',
        chili: '吃梨',
        dove: '德芙',
      }
    },
    { key: 'age' },
    { key: 'add' },
    { key: 'birth', date: true },
    {
      key: 'action',
      filter: (str, item) => {
        return (
          <span
            onClick={e => ShowModal({
              title: '详情',
              children: <DescHelper columns={columns} record={item} />
            })}
            className="link-btn">详情</span>
        );
      }
    }
  ];
  const records = [
    {
      username: 'alex',
      age: '100,100',
      add: 'cn',
      birth: new Date('1999-01-01'),
    },
    {
      username: 'chili',
      age: '102',
      add: 'cn',
      birth: new Date('1999-01-01'),
    },
    {
      username: 'dove',
      age: '50',
      add: 'cn',
      birth: new Date('1999-01-01'),
    },
    {
      username: 'susam',
      age: '20',
      add: 'uk',
      birth: new Date('1999-01-01'),
    },
  ];
  return (
    <CardTable
      columns={columns}
      records={records} />
  );
};
