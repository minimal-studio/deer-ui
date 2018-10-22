提供接口来做全局通知，详情请看配置代码

```js
const Notify = require('./notify-func').default;

<span className="btn theme flat"
  onClick={e => {
    Notify({
      position: '',
      config: {
        text: '通知内容',
        // id: 'ID',
        title: '通知标题',
        type: 'white', //[success error normal warn black white] default 'desc'
        lifecycle: 7,
        onClickTip: (e) => {console.log(e)},
        actionText: '有 action 时显示的文字',
      }
    })
  }}>
  发送通知
</span>
```