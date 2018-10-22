提供了全局的 modal 使用方法，由系统托管 modal 的状态

```js
const { ShowGlobalModal } = require('./modal-func');

<div>
  <span
    className="btn theme flat mr10"
    onClick={e => ShowGlobalModal({
      draggable: false,
      title: '默认的 Modal',
      children: '任意的内容'
    })}>
    默认的 Modal
  </span>

  <span
    className="btn gold flat mr10"
    onClick={e => ShowGlobalModal({
      title: '没有操作按钮的 Modal',
      showFuncBtn: false,
      children: '任意的内容'
    })}>
    没有操作按钮的 Modal
  </span>

  <span
    className="btn red flat mr10"
    onClick={e => ShowGlobalModal({
      draggable: true,
      title: '按住 header 可拖动的 Modal',
      children: '任意的内容'
    })}>
    可拖动的 Modal
  </span>

  <span
    className="btn light-p flat mr10"
    onClick={e => ShowGlobalModal({
      type: 'confirm',
      title: '确认框',
      confirmText: '是否确定',
      onConfirm: (isSure) => {
        alert('确定？' + isSure)
      }
    })}>
    确认框
  </span>
</div>
```