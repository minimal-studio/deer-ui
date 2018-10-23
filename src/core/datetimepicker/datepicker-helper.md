```js
class ForHelper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      res: []
    }
  }
  render() {
    const { res } = this.state;
    return (
      <div>
        返回值: {res.join(' - ')}
        <DatepickerHelper onClick={e => this.setState({
          res: e
        })}/>
      </div>
    )
  }
}
<ForHelper />
```