import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DescHelper, Table } from '.';
import { ShowModal } from '../modal';

let table;

const action = {
  key: 'action',
  filter: (str, item) => {
    return (
      <div>
        <span
          onClick={e => ShowModal({
            children: <DescHelper keyMapper={keyMapper} record={item} />
          })}
          className="link-btn">详情
        </span>
        <span
          onClick={e => ShowModal({
            width: 1000,
            children: (
              <Table
                keyMapper={keyMapper}
                ref={e => table = e}
                whenCheckAction={(
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
    );
  }
};

const keyMapper = [
  {
    key: 'username',
    tips: [
      '可以是数组1',
      '可以是数组2',
      '可以是数组3',
    ],
    title: () => {
      return (
        <span>使用 func title 返回表头</span>
      );
    },
    namesMapper: {
      alex: '埃里克斯',
      chili: '吃梨',
      dove: '德芙',
    }
  },
  {key: 'age', selectable: false, count: false},
  {key: 'property', selectable: false},
  {key: 'add', labels: {
    cn: 'red'
  }, namesMapper: {
    cn: '中国', uk: '英国'
  }},
  // {key: 'birth1', date: 1},
  // {key: 'birth2', date: 1},
  // {key: 'birth3', date: 1},
  // {key: 'birth4', date: 1},
  {key: 'obj', filter: (_, item) => {
    return _.account;
  }},
  {key: 'status', title: {
    type: 'selector',
    values: {
      normal: '正常',
      abnormal: '异常',
    },
    onChange: (val) => {
      console.log(val);
    }
  }},
  // action,
];
const keyMapperMiddle = [...keyMapper].slice(1, keyMapper.length - 1);
const keyMapperFixed = [
  {
    key: 'username',
    fixed: 'left',
    tips: [
      '可以是数组1',
      '可以是数组2',
      '可以是数组3',
    ],
    title: () => {
      return (
        <span>使用 func title 返回表头</span>
      );
    },
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
    age: '100',
    property: '100,000',
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
  },
  {
    id: 2,
    username: 'chili',
    age: '102',
    property: '200,000',
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
  },
  {
    id: 3,
    username: 'dove',
    property: '300,000',
    age: '50',
    add: 'cn1241241241257172590812903890128590127095712905709125u012',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
  },
  {
    id: 4,
    username: 'susam',
    property: '400,000',
    age: '20',
    add: 'uk',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
  },
  {
    id: 5,
    username: 'susam',
    property: '400,000',
    age: '20',
    add: 'uk',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
  },
  {
    id: 6,
    username: 'susam',
    property: '400,000',
    age: '20',
    add: 'uk',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
  },
];

export {
  keyMapper, keyMapperFixed, records
};