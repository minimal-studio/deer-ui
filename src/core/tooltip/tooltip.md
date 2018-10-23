```js
class ForTesting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    }
  }
  render() {
    const { isOpen } = this.state;
    return (
      <ToolTip
        onClick={e => this.setState({
          isOpen: !isOpen
        })}
        title={!isOpen ? "打开书" : "关闭书"}
        n={isOpen ? "book-open" : "book"}
      />
    )
  }
}

<ForTesting />
```