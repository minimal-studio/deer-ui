表单生成器，组合内置的 UI 控件，生成查询条件组合，内置以下控件，通过 type 属性控制

- customForm
- captcha
- select-n
- select
- input-selector
- input-range
- input
- password
- textarea
- ranger
- text
- radio
- button
- datetime
- datetimeRange

## 表单配置例子

> 可以通过 type = 'customForm' 来实现，实现 getCustomFormControl 接口

```js
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
    required: true,
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
    required: true,
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
```