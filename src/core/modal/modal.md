提供内嵌的 modal 组件, 同样也有全局使用 modal 的方法

```jsx
const ModalHelper = require('./modal-helper').default;

class ForModal extends ModalHelper {
  render() {
    return (
      <div style={{height: 300, position: 'relative'}}>
        <span className="btn theme flat"
          onClick={e => this.setModal({
            isOpen: true,
            children: '内容'
          })}>打开 Modal</span>
        <Modal {...this.state.modalSetting} onCloseModal={e => {
          this.setModal({
            isOpen: false
          })
        }}>
          内容
        </Modal>
      </div>
    )
  }
}

<ForModal/>
```