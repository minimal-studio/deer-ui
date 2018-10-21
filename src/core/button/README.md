Button with icon:

```js
<div>
  <Button
    className="mr10"
    onClick={e => {
    alert('你好')
  }} icon="bath" text="洗澡" />

  <Button
    onClick={e => {
      alert('你好')
    }}
    icon="bath"
    disabled
    text="不能洗澡" />
</div>
```