import React from 'react';

import { FormLayout } from '.';

export default class FormLayoutDemo extends React.Component {
  state = {
    hasErr: false,
    resDesc: ''
  };
  btnConfig = [
    {
      action: (formRef, actingRef) => {
        // console.log(formRef.value, actingRef);
        this.submit(formRef.value, actingRef);
      },
      text: '测试按钮',
      actingRef: 'forTest'
    }
  ];
  formOptions = [
    {
      refs: ['startDate', 'endDate'],
      type: 'datetimeRange',
      title: '日期',
      tips: [
        '可以为数组的 tip 1',
        '可以为数组的 tip 2',
        '可以为数组的 tip 3',
      ],
      required: true,
      range: ['2018-10-10', '2018-10-11']
    },
    {
      ref: 'ref1',
      type: 'radio',
      title: '单选控件',
      tips: '也可以是单纯的字符串',
      values: {
        value1: 'value1',
        value2: 'value2',
        value3: 'value3',
      }
    },
    {
      ref: 'ref2',
      type: 'select',
      title: (
        <span>选择控件</span>
      ),
      values: {
        value1: 'value1',
        value2: 'value2',
        value3: 'value3',
      }
    },
    {
      ref: 'ref3',
      type: 'input',
      title: '输入数字',
      required: true,
      inputType: 'number'
    },
    {
      refs: ['_ref3', '_ref4'],
      type: 'input-range',
      title: '范围输入',
      required: true,
      inputType: 'number'
    },
    {
      refu: {
        'refu1': '1', 'refu2': '2', 'refu3': '3'
      },
      type: 'input-selector',
      title: '选择器输入',
      required: true,
      inputType: 'number'
    },
  ];
  submit(formData, actingRef) {
    // 模拟获取数据
    setTimeout(() => {
      this.setState({
        hasErr: false,
        resDesc: '成功'
      });
    }, 800);
  }
  render() {
    return (
      <FormLayout
        {...this.state}
        btnConfig={this.btnConfig}
        formOptions={this.formOptions}/>
    );
  }
}