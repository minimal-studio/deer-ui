---
name: FormGenerator 详述
route: /G-Desc
menu: FormGenerator
---

# FormGenerator 方案

> 表单聚合组件，一种快速生成企业级业务表单和表格的解决方案，内部维护数据，表单验证，统一数据交互方式

## 应用场景

1. 企业级管理系统
2. 密集型表单表格的数据管理系统

## 终极目标

1. 声明式表单开发，直接对接业务接口，快速生产
2. 统一样式、交互、文档结构

## FormOptions 配置的详细说明

> 通用于 FormLayout | FormGenerator | ConditionGenerator

## 配置说明

每一项的配置可分为 Object 和 String 两大类型

1. Object: 通用配置项，用于渲染制定的 UI 组件
2. String: 标题配置项，用于渲染标题

```js
const formOptions = [
  // 每一项的配置可分为 Object 和 String
  {
    type: '', // 配置的类型
    ref: '', // 该字段配置的唯一引用 ID
    defaultValue: '' // 默认值
    required: boolean, // 是否必填
    values: [], // 选择器的可选项
    ...other, // 其他字段
  },
  '标题配置', // 如果某项为 string，则就当作 title 渲染，只有 Form 相关的组件会生效
];

// 如果 formOptions
```

## 最终输出

1. 根据配置组件的 type 渲染对应的组件
2. 根据用户在对应组件的交互输出的 value
3. 包装成以下数据结构

```js
const value = {
  [ref1]: [value1],
  [ref2]: [value2],
  [ref3]: [value3],
  [ref4]: [value4],
  [re5f]: [value5],
  ...
}
```

## 配置字段说明

### 目录

1. ref
2. type
3. defaultValue
4. required
5. values
6. 其他字段

<!-- > 不需要传入 value， FormGenerator 会维护内部的 value -->

### 1. ref

与 React 的 ref 概念类似，对应内部渲染的组件的引用，分为 3 中不同类型的 ref 类型，作为总体 value 输出的 key

- ref
- refu
- refs

> ref 是与远端接口对接的重要字段，下面介绍三种不同的应用场景

ref@string: 单一的 ref，适用于 type 除了下面介绍的组件

```js
const formOptions = {
  ref: 'ref1', // 用于实际与远端接口对接的字段
  type: 'input',
}
```

refu@object: ref unique, 用于 type = input-selector 的组件，应用于多个 ref 匹配一个 value，最终得出 ref: value 的结果

```js
// 目前只有 input-selector 使用 refu
const formOptions = {
  refu: {
    [refName1]: 'ref 的显示名1',
    [refName2]: 'ref 的显示名2',
    [refName3]: 'ref 的显示名3',
  }, // 用于实际与远端接口对接的字段
  defaultValueForS: [refName1],
  type: 'input-selector',
}
```

refs@array: 用于范围选择的组件, 适用于

- input-range
- datetimeRange

```js
// 目前只有 input-selector 使用 refu, 最后生成 { [refs[0]]: value1, [refs[1]]: value2 }
const formOptions = {
  refs: ['startDate', 'endData'], // 用于实际与远端接口对接的字段
  type: 'input-range || datetimeRange',
}
```

-------------

### 2. type

选择的控件的类型，以下为控件预览，对应的 ukelli-ui 中的控件，都可以在文档中找到

```js static
typeMapper = {
  'customForm': formFilter.getCustomForm,     // 自定义的组件接口，使用方式参考 FormLayout
  'captcha': Captcha,                         // 验证码
  'select-n': () => (<select></select>),      // 浏览器的原生 select 组件
  'select': DropdownMenu,                     // DropdownMenu 下拉菜单
  'input-selector': InputSelector,            // InputSelector 输入 + 选择器
  'input-range': Input + Input,               // 组合的 Input
  'input': Input,                             // Input
  'password': <Input type="password" />,      // Input 的 password 形态
  'textarea': <textarea />,                   // 原生 textarea
  'ranger': Range,                            // Range 滑动选择器
  'text': <span>children</span>,              // 简单的 text
  'radio': Radio,                             // Radio 组件
  'button': Button,                           // 按钮
  'datetime': DatetimePicker,                 // DatetimePicker，基于 flatpickr 的日期选择器
  'datetimeRange': DatetimePicker * 2,        // 聚合两个 DatetimePicker 的组件
}
```

-------------

### 3. defaultValue

该 ref 的组件的默认值

-------------

### 4. required

是否必填字段， FormLayout 会做一次验证

-------------

### 5. values

给 [Selector选择器控件](/DropdownMenu) 选项

-------------

### 6. 其他字段

其余的字段会以 props 的方式传入 type = component 具体的控件中，详情参考对应的控件

-------------

## 自动维护的内部数据结构

> FormGenerator 维护着一分内部完整数据结构，方便统一数据管理和数据交互，以及 UI 交互

```js
// 传入的配置
const formOptions = [
  {
    ref: 'username',
    type: 'input',
    required: true,
  },
  {
    ref: 'password',
    type: 'password',
    required: true,
  },
];

// FormGenerator 会根据 formOptions 的配置渲染对应的控件，并且内部生成总体的 value 结构
<FormGenerator
  ref={e => this.formRef = e}
  formOptions={formOptions} />

// 由 FormGenerator 维护的数据结构
this.formRef.value = {
  username: undefined,
  password: undefined,
}

// FormGenerator 会监控所有的子控件，并且根据用户的输入或者选择修改自身的 value
// 当用户在用户名对应的输入框输入了 user, value 则自动更新为
this.formRef.value = {
  username: 'user',
  password: undefined,
}

// 如果使用 FormLayout 表单模版，则会自动验证 required: true 的字段是否通过
```

## 通过接口改变内部数据

适用于所有 FormGenerator, 通过 ref 保存组件并且引用其中接口

接口

```js
class Customer extends React.Component {
  componentDidMount() {
    /** 方式1 */
    this.formRef.changeValues({
      [ref]: [nextValue]
    })
    /** 方式2 */
    this.formRef.changeValue(nextValue, componentRefID);
  }
  render() {
    return (
      <FormGenerator ref={e => this.formRef = e} />
    )
  }
}
```
