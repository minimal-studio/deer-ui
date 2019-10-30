import React from 'react';

import { FormLayout } from '..';
import formOptions from './form-options-demo';
import { FormLayoutBtnsConfig } from '../form-layout';

export default class FormLayoutDemo extends React.Component {
  state = {
    hasErr: false,
    resDesc: ''
  };

  formBtns: FormLayoutBtnsConfig = [
    {
      action: (formRef, actingRef) => {
        console.log(formRef.value, actingRef);
        this.submit(formRef.value, actingRef);
      },
      type: 'submit',
      text: '测试按钮',
      actingRef: 'forTest'
    },
  ];

  formOptions = formOptions;

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
        formBtns={this.formBtns}
        formOptions={this.formOptions}/>
    );
  }
}
