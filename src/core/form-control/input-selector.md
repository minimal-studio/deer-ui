选择器 + 输入过滤器

```js
<div className="layout">
  <div className="mr10">
    <span className="mr10">一般的</span>
    <InputSelector
      values={{
        value1: 'value1',
        value2: 'value2',
        value3: 'value3',
      }}
      onChange={e => {
        console.log(e)
      }} />
  </div>
  <div>
    <span className="mr10">向上弹出</span>
    <InputSelector
      position="top"
      values={{
        value1: 'value1',
        value2: 'value2',
        value3: 'value3',
      }}
      onChange={e => {
        console.log(e)
      }} />
  </div>
</div>
```