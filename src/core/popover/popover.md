Popover 提供全局的弹出层的接口

- GlobalPopover 为内置全局弹出层对象
- PopoverEntity 为弹出层对象的构造函数，可以通过 new 的方式来创建一个独特的弹出层

```js static
const pop = new PopoverEntity({
  id: '用于标识唯一性',
  fixed: {}, // 是否 fixed 定位
});

pop.setPopover({
  width = 400, onClose,
  elem, // 相对的 document 元素
  children,
  open, // 是否打开
  props, // 传入 popover 实体对象的 props
});
```

```js
const { GlobalPopover, PopoverEntity } = require('./popover-func');

class ForPopover extends React.Component {
  render() {
    return (
      <div>
        <span onMouseEnter={e => {
          GlobalPopover.show({
            elem: e.target,
            props: {
              showCloseBtn: false,
              type: 'red'
            },
            children: '任意内容'
          })
        }} onMouseLeave={e => {
          GlobalPopover.close()
        }}>弹出层</span>
      </div>
    )
  }
}

<ForPopover />
```