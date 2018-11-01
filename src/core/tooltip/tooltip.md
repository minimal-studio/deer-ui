```js
class ForTesting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    }
  }
  render() {
    const { position } = this.props;
    const { isOpen } = this.state;
    return (
      <span className="mr20">
        <ToolTip
          onClick={e => this.setState({
            isOpen: !isOpen
          })}
          position={position}
          title={!isOpen ? "打开书" : "关闭书"}
          n={isOpen ? "book-open" : "book"}
        />
      </span>
    )
  }
}

<div>
  左边
  <ForTesting position="left" />
  右边
  <ForTesting position="right" />
  下面
  <ForTesting position="bottom" />
  上面
  <ForTesting position="top" />
</div>
```