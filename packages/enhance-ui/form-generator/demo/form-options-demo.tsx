import React, { useState } from 'react';
import { FormLayoutProps } from '../form-layout';

const CustomerCom = ({ onChange }) => {
  const [isMount, setisMount] = useState(false);
  // onChange 由 FormGenerator 提供
  return (
    <div onClick={(e) => {
      onChange('vvvvv');
      setisMount(!isMount);
    }}>Mounted: {isMount ? 'Yes' : 'No'}</div>
  );
};

class CustomerCom2 extends React.Component {
  state = {
    isMount: false
  }

  componentDidMount() {
    console.log('mount');
  }

  render() {
    // onChange 由 FormGenerator 提供
    const { onChange } = this.props;
    const { isMount } = this.state;
    return (
      <div onClick={(e) => {
        onChange('vvvvv');
        this.setState({
          isMount: !isMount
        });
      }}>Mounted: {isMount ? 'Yes' : 'No'}</div>
    );
  }
}

const formOptions: FormLayoutProps['formOptions'] = [
  '日期',
  {
    refs: ['startDate', 'endDate'],
    type: 'datetimeRange',
    enableTime: true,
    title: '日期1',
    tips: '123',
    defaultValue: []
  },
  {
    refs: ['startDate2', 'endDate2'],
    type: 'datetimeRange',
    title: '日期2',
    tips: '123',
    defaultValue: []
  },
  '选择器',
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
    ref: 'ref_checkbox',
    type: 'checkbox',
    title: 'checkbox控件',
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
    ref: 'switch',
    type: 'switch',
    title: '开关',
    defaultValue: true
  },
  '输入控制',
  {
    ref: 'input',
    type: 'input',
    title: '字符串输入',
    required: true,
  },
  {
    ref: 'ref3',
    type: 'input',
    outputType: 'number',
    props: {
      type: 'number'
    },
    required: true,
    title: '数字输入',
  },
  {
    ref: 'textarea',
    type: 'textarea',
    defaultValue: '123',
    title: '文本',
  },
  {
    ref: 'captchCode',
    type: 'captcha',
    keyRef: 'captchKey',
    title: '验证码',
  },
  {
    refs: ['s', 'e'],
    type: 'input-range',
    title: '范围',
    range: [0, 10]
  },
  {
    refu: {
      refuValue1: '选择1',
      refuValue2: '选择2',
      refuValue3: '选择3',
    },
    type: 'input-selector',
    title: '输入选择器, 等于多个输入框',
  },
  {
    ref: 'MainRef',
    refForS: 'RefForSelector',
    type: 'input-selector-s',
    defaultValueForS: 1,
    defaultValue: '123123',
    isNum: true,
    values: {
      1: '选择1',
      2: '选择2',
      3: '选择3',
    },
    title: '输入选择器, 分开输入和选择器两个标记',
  },
  '自定义组件',
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
    getCustomFormControl: () => CustomerCom2,
    title: '自定义的表单组件2',
    values: {
      value1: 'value1',
      value2: 'value2',
      value3: 'value3',
    }
  },
];

export default formOptions;
