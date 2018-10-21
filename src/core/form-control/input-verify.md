强大的输入框，包含

- 数字验证
- 数字范围限制
- 输入长度限制
- 百分比转换
- 数字转中文等一些列功能

```js
<InputVerify
  onChange={e => {}}
  onFocus={e => {}}
  onBlur={e => {}}
  onClear={e => {}}
  className={''}
  defaultValue={''}
  needCN={false}
  precent={false}
  inputable={true}
  numRange={[1, 100]}
  unit={2}
  lenRange={[1, 20]}
  onChange={e => {
    console.log(e)
  }} />
```