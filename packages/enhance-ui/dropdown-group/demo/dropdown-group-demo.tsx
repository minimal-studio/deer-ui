import React from 'react';
import { DropdownGroup } from '../dropdown-group';

const Test1 = () => {
  const groupData = {
    group1: {
      title: '第一组',
      values: {
        value11: '显示1-1',
        value12: '显示1-2',
        value13: '显示1-3',
        value14: '显示1-4',
      }
    },
    group2: {
      title: '第二组',
      values: {
        value21: '显示2-1',
        value22: '显示2-2',
        value23: '显示2-3',
        value24: '显示2-4',
        value25: '显示2-5',
        value26: '显示6-2',
        value27: '显示2-7',
        value28: '显示2-8',
      },
    },
    group3: {
      title: '第三组，数字 value',
      isNum: true,
      values: {
        1: '显示2-1',
        2: '显示2-2',
        3: '显示2-3',
        4: '显示2-4',
      },
    },
  };
  return (
    <DropdownGroup
      defaultValue={{
        group1: ["value11"]
      }}
      outside
      fieldMapper={{
        title: 'title',
        values: 'values'
      }}
      onChange={(val) => {
        console.log(val);
      }}
      groupData={groupData} />
  );
};
