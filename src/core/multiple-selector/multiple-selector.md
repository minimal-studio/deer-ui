输入提示控件

```js
<div style={{width: 260, position: 'relative'}}>
  <MultipleHelper
    onChange={val => {
      console.log(val)
    }}
    min={0}
    max={10000}
    range={[1, 10, 20, 30]} />
</div>
```