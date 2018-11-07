提供接口来做全局通知，详情请看配置代码

```js
const Notify = require('./notify-func').default;

<div>
  <span className="btn theme flat mr10"
    onClick={e => {
      Notify({
        position: 'top,right',
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
  <span className="btn red flat mr10"
    onClick={e => {
      Notify({
        position: 'bottom,right',
        config: {
          text: '通知内容',
          // id: 'ID',
          title: '通知标题',
          type: 'error', //[success error normal warn black white] default 'desc'
          lifecycle: 7,
          onClickTip: (e) => {console.log(e)},
          actionText: '有 action 时显示的文字',
        }
      })
    }}>
    右下角发送通知
  </span>
  <span className="btn green flat mr10"
    onClick={e => {
      Notify({
        position: 'bottom,right',
        config: {
          text: '通知内容',
          // id: 'ID',
          title: '通知标题',
          type: 'success', //[success error normal warn black white] default 'desc'
          lifecycle: 7,
          onClickTip: (e) => {console.log(e)},
          actionText: '有 action 时显示的文字',
        }
      })
    }}>
    成功的颜色
  </span>
</div>
```