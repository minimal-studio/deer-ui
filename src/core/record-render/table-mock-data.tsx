import React, { PureComponent } from 'react';
import { DescHelper, Table } from '.';
import { ShowModal } from '../modal';
import { TableColumns } from './table-body';

let table;

const columns: TableColumns = [
  {
    key: 'username',
    namesMapper: {
      alex: '埃里克斯',
      chili: '吃梨',
      dove: '德芙',
    }
  },
  {
    key: 'age',
    selectable: false,
    title: () => (
      <span>Age</span>
    ),
  },
  {
    key: 'property',
    selectable: false,
    money: true,
    tips: [
      '超过 10 块钱的富人',
      '超过 20 块钱的巨富',
      '超过 40 块钱的富可敌国',
    ],
  },
  {
    key: 'obj',
    filter: (_, item) => _.account
  },
  {
    key: 'add',
    labels: {
      cn: 'red'
    }
  },
  // {key: 'birth1', date: 1},
  // {key: 'birth2', date: 1},
  // {key: 'birth3', date: 1},
  // {key: 'birth4', date: 1},
  {
    key: 'status',
    title: {
      type: 'selector',
      values: {
        normal: '正常',
        abnormal: '异常',
      },
      onChange: (val) => {
        console.log(val);
      }
    },
    labels: {
      normal: 'success',
      exception: 'error',
    }
  },
  // action,
];

const action = {
  key: 'action',
  filter: (str, item) => (
    <div>
      <span
        onClick={e => ShowModal({
          title: '详情',
          children: <DescHelper columns={columns} record={item} />
        })}
        className="link-btn">详情
      </span>
      <span
        onClick={e => ShowModal({
          width: 1000,
          title: '详情',
          children: (
            <Table
              columns={columns}
              ref={(e) => { table = e; }}
              checkedOverlay={(
                <span className="btn theme mu10" onClick={e => table.clearCheckeds()}>
                    清除所有的以选中项
                </span>
              )}
              needCheck
              needCount
              records={records} />
          )
        })}
        className="link-btn t_red">弹出表格
      </span>
    </div>
  )
};

const keyMapperMiddle: TableColumns = [...columns].slice(1, columns.length);
const keyMapperFixed: TableColumns = [
  {
    key: 'username',
    fixed: 'left',
    tips: [
      '可以是数组1',
      '可以是数组2',
      '可以是数组3',
    ],
    title: () => (
      <span>Func Title</span>
    ),
    namesMapper: {
      alex: '埃里克斯',
      chili: '吃梨',
      dove: '德芙',
    }
  },
  ...keyMapperMiddle,
  {
    ...action,
    fixed: 'right',
  }
];
const records = [
  {
    id: 1,
    username: 'alex',
    age: 100,
    property: '100000',
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 2,
    username: 'chili',
    age: 102,
    property: '200000',
    add: '帝国议会所代表的王国和皇室领地以及匈牙利圣斯蒂芬王冠领地',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 3,
    username: 'dove',
    property: '300000',
    age: 50,
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 4,
    username: 'susam',
    property: '400000',
    age: 20,
    add: 'uk',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 5,
    username: 'susam',
    property: '400000',
    age: 20,
    add: 'uk',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 6,
    username: 'susam',
    property: '400000',
    age: 20,
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 7,
    username: 'susam',
    property: '400000',
    age: 20,
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'exception',
  },
];

export {
  columns, keyMapperFixed, records
};
