import React from 'react';

const CustomerCom = ({ onChange }) => {
  // onChange 由 FormGenerator 提供
  return (
    <div onClick={e => onChange('vvvvv')}>内容</div>
  );
};

const formOptions = [
  {
    refs: ['startDate', 'endDate'],
    type: 'datetimeRange',
    title: '日期',
    defaultValue: ['2018-10-10', '2018-10-11']
  },
  {
    ref: 'ref1',
    type: 'radio',
    title: '单选控件',
    values: {
      value1: 'value1',
      value2: 'value2',
      value3: 'value3',
    }
  },
  {
    ref: 'ref22',
    type: 'radio',
    title: '多选控件',
    isMultiple: true,
    values: {
      value1: 'value1',
      value2: 'value2',
      value3: 'value3',
    }
  },
  {
    ref: 'ref2',
    type: 'select',
    title: '选择控件',
    values: {
      value1: 'value1',
      value2: 'value2',
      value3: 'value3',
    }
  },
  {
    ref: 'ref3',
    type: 'input',
    inputType: 'number',
    required: true,
    title: '选择控件',
    values: {
      value1: 'value1',
      value2: 'value2',
      value3: 'value3',
    }
  },
  {
    ref: 'customer1',
    type: 'customForm',
    getCustomFormControl: () => {
      return {
        component: CustomerCom,
        props: {

        }
      };
    },
    title: '自定义的表单组件1',
    values: {
      value1: 'value1',
      value2: 'value2',
      value3: 'value3',
    }
  },
  {
    ref: 'customer2',
    type: 'customForm',
    getCustomFormControl: () => CustomerCom,
    title: '自定义的表单组件2',
    values: {
      value1: 'value1',
      value2: 'value2',
      value3: 'value3',
    }
  },
  {
    refs: ['s', 'e'],
    type: 'input-range',
    title: '范围',
    range: [0, 10]
  },
];

export default formOptions;