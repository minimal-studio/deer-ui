基于 selector 的组件，支持多选

```js
const values = {
  value1: '显示的值1',
  value2: '显示的值2',
  value3: '显示的值3',
}

class ForTesting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'value1',
      valueMul: []
    }
  }
  render() {
    const { value, valueMul } = this.state;
    return (
      <div>
        <div className="mu10">
          <DropdownMenu
            ref={e => this.dropdown = e}
            onChange={val => {
              this.setState({
                value: val
              })
            }}
            value={value}
            values={values}
          />
          <span className="ml10">单选实际的值 {value}</span>
        </div>
        <div className="mu10">
          <DropdownMenu
            ref={e => this.dropdownMul = e}
            onChange={val => {
              this.setState({
                valueMul: val
              })
            }}
            isMultiple={true}
            value={valueMul}
            values={values}
          />
          <span className="ml10">多选的实际的值 {valueMul.join(',')}</span>
        </div>
        <div>
          <div className="mu10">可以通过 ref 来改变 DropdownMenu 的值</div>
          <div className="btn theme" onClick={e => this.dropdown.changeValue('value3')}>点击改变为 value3</div>
        </div>
        <hr/>
        <div>
          <span className="ms10">向上左弹出</span>
          <DropdownMenu
            position="top,left"
            onChange={val => {
              this.setState({
                value: val
              })
            }}
            value={value}
            values={values}
          />
          <span className="ms10">向上右弹出</span>
          <DropdownMenu
            position="top,right"
            onChange={val => {
              this.setState({
                value: val
              })
            }}
            value={value}
            values={values}
          />
          <span className="ms10">无效的值示例，这个时候需要检查参数</span>
          <DropdownMenu
            position="top,right"
            onChange={val => {
              this.setState({
                value: val
              })
            }}
            value={'123'}
            values={values}
          />
        </div>
      </div>
    )
  }
}

<ForTesting />
```