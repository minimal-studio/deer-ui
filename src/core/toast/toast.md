Toast 需要放到 position != static 的容器之中

```js
class ForTesting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    }
  }
  render() {
    return (
      <div className="relative">
        <span className="btn theme" onClick={e => {
          this.toast.show('打开了一个 Toast', 'green')
        }}>开启一个 taost</span>
        <Toast ref={e => this.toast = e}/>
      </div>
    )
  }
}

<ForTesting />
```