分步组件

```js
class ForTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIdx: 0,
      max: 5
    }
  }
  render() {
    const { activeIdx, max } = this.state;
    return (
      <div>
        <Steps activeIdx={activeIdx} justify="between">
          <Steps.Step title="分步1">这里是描述1</Steps.Step>
          <Steps.Step title="分步2">这里是描述2</Steps.Step>
          <Steps.Step title="分步3">这里是描述3</Steps.Step>
          <Steps.Step title="分步4">这里是描述4</Steps.Step>
          <Steps.Step title="分步5">这里是描述4这里是描述4这里是描述4这里是描述4, <span style={{
            color: 'red'
          }}>可以为任意元素</span></Steps.Step>
        </Steps>

        <span className="btn theme" onClick={e => {
          let nextIdx = activeIdx + 1;
          if(nextIdx > max) nextIdx = 0;
          this.setState({
            activeIdx: nextIdx
          })
        }}>
          下一个
        </span>
      </div>
    )
  }
}
<ForTest/>
```