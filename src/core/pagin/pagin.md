分页控件

```js
class ForPagin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pagin: {
        PageIndex: 0,
        PageSize: 10,
        AllCount: 101,
        UsePaging: true
      }
    }
  }
  render() {
    const { pagin } = this.state;
    return (
      <Pagination
        onPagin={nextPagin => {
          this.setState({
            pagin: nextPagin
          })
        }}
        pagingInfo={pagin}/>
    )
  }
}

<ForPagin />
```