查询条件生成器，组合内置的 UI 控件，生成查询条件组合，内置以下控件，通过 type 属性控制

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

```js
<ConditionGenerator
  conditionConfig={[
    {
      refs: ['startDate', 'endDate'],
      type: 'datetimeRange',
      title: '时间',
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
    {
      refs: ['s', 'e'],
      type: 'input-range',
      title: '范围',
      range: [0, 10]
    },
  ]}/>
```