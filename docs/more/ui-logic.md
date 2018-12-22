#### 表单选择器控件的选择，要根据是否必填来选择，例如

- 必填字段需要使用 Radio，并且根据实际情况传入 defaultValue
- 可以为空的选择器可以选择 DropdownMenu

```jsx static
import { Radio, DropdownMenu } from 'ukelli-ui';

const values = {
  '1': '显示为 1',
  '2': '显示为 2',
};

<Radio defaultValue={'1'} values={values}/>
<DropdownMenu values={values}/>
```

> 使用 FormController ，并且定义 FormOptions 传入的时候，需要清楚这个值的期望输出是什么，否则会对使用者造成困惑

```jsx static
const formOptions = [
  {
    type: 'select',    // 渲染 DropdownMenu
    values: values,   // 传入 DropdownMenu 的参数
    defaultValue: '', // 与上述类似
    ref: ''           // 对应的通讯的字段
  },
  {
    type: 'radio',    // 渲染 Radio
    values: values,   // 传入 DropdownMenu 的参数
    defaultValue: '', // 与上述类似
    ref: ''           // 对应的通讯的字段
  },
]
```