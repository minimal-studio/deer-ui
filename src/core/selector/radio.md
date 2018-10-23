基于 selector 的组件，只能单选

```js
class ForTesting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'value1'
    }
  }
  render() {
    const { value } = this.state;
    return (
      <div>
        <span className="mr10">实际的值 {value}</span>
        <Radio
          ref={e => this.dropdown = e}
          onChange={val => {
            this.setState({
              value: val
            })
          }}
          value={value}
          values={{
            value1: '显示的值1',
            value2: '显示的值2',
            value3: '显示的值3',
          }}
        />
        <div>
          <div className="mu10">可以通过 ref 来改变 Radio 的值</div>
          <div className="btn theme" onClick={e => this.dropdown.changeValue('value3')}>点击改变为 value3</div>
        </div>
      </div>
    )
  }
}

<ForTesting />
```