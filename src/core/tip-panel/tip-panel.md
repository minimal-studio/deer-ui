提示框，用于重要提示，或者用户手册等

```js
<TipPanel title="温馨提示"
  needToolTip={true}
  texts={[
    '带有序号的内容1',
    '带有序号的内容2',
    '带有序号的内容3',
    (
      <span className="btn theme" onClick={e => alert('hello')}>可以为任意类型</span>
    )
  ]}/>
```

不同类型的提示框

```js
<TipPanel title="成功的提示"
  type="success"
  texts={[
    '带有序号的内容1',
    '带有序号的内容2',
  ]}/>

<TipPanel title="重要或者错误的提示"
  type="error"
  texts={[
    '带有序号的内容1',
    '带有序号的内容2',
  ]}/>

<TipPanel title="通用的提示"
  type="normal"
  texts={[
    '带有序号的内容1',
    '带有序号的内容2',
  ]}/>
```