```js
<div className="mb10">
  默认
  <DatetimePicker />
</div>

<div className="mb10">
  时间范围 + 选择时分秒
  <DatetimePicker
    needTime={true}
    enableTime={true}
    mode="range"
    onChange={e => console.log(e)} />
</div>
```