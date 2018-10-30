表单生成器的再一层封装模版，用于渲染通用表单配置

- 表单渲染
- 表单操作按钮的行为与显示
- 操作按钮的状态

```js
<FormLayout
  btnConfig={[
    {
      action: (formRef, actingRef) => {
        console.log(formRef, actingRef);
      },
      text: '测试按钮',
      actingRef: 'forTest'
    }
  ]}
  formOptions={[
    {
      refs: ['startDate', 'endDate'],
      type: 'datetimeRange',
      title: '日期',
      range: ['2018-10-10', '2018-10-11']
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
      ref: 'ref2',
      type: 'select',
      title: '选择控件',
      values: {
        value1: 'value1',
        value2: 'value2',
        value3: 'value3',
      }
    },
  ]}/>
```