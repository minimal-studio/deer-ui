import React, { useState } from 'react';

import { Radio } from '../..';
import { FormLayout } from '..';
import formOptions from './form-options-demo';
import { FormLayoutBtnsConfig, FormLayoutProps } from '../form-layout';
import { FormOptions } from '../../form-generator/form-generator';


export default class FormLayoutDemo extends React.Component<FormLayoutProps> {
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
        {...this.props}
        formBtns={this.formBtns}
        formOptions={this.formOptions}
      />
    );
  }
}

const FormLayoutDemo2 = () => {
  const [layout, setLayout] = useState('horizontal');
  const [resDesc, setResDesc] = useState('');

  const formBtns: FormLayoutBtnsConfig = [
    {
      action: (formRef, actingRef) => {
        console.log(formRef.value, actingRef);
        submit(formRef.value, actingRef);
      },
      text: 'Button',
      actingRef: 'forTest'
    },
  ];

  const _formOptions: FormOptions = [
    {
      type: 'input',
      ref: 'InputField',
      defaultValue: '123',
    },
    {
      type: 'radio',
      ref: "RadioField",
      values: {
        radioValue1: 'radioText1',
        radioValue2: 'radioText2',
      }
    }
  ];
  const submit = (formData, actingRef) => {
    // 模拟获取数据
    setTimeout(() => {
      setResDesc({
        hasErr: false,
        resDesc: '成功'
      });
    }, 800);
  };

  return (
    <>
      <Radio
        onChange={(nextLayout) => setLayout(nextLayout)}
        defaultValue="horizontal"
        values={{
          horizontal: '水平布局',
          vertical: '垂直布局',
          flow: '流布局',
        }}
      />
      <FormLayout
        layout={layout}
        resDesc={resDesc}
        formBtns={formBtns}
        formOptions={formOptions}
      />
    </>
  );
};
