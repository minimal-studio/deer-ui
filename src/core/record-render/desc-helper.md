```js
class ForTable extends React.Component {
  constructor(props) {
    super(props);

    this.keyMapper = [
      {
        key: 'username',
        namesMapper: {
          alex: '埃里克斯',
          chili: '吃梨',
          dove: '德芙',
        }
      },
      {key: 'age'},
      {key: 'add'},
    ]

    this.records = [
      {
        username: 'alex',
        age: '100',
        add: 'cn',
      },
      {
        username: 'chili',
        age: '102',
        add: 'cn',
      },
      {
        username: 'dove',
        age: '50',
        add: 'cn',
      },
      {
        username: 'susam',
        age: '20',
        add: 'uk',
      },
    ]

    this.state = {
      activeRecordIdx: 0
    }
  }
  render() {
    const { activeRecordIdx } = this.state;
    return (
      <div>
        {
          this.records.map((item, idx) => {
            return (
              <span
                className="btn theme flat m5"
                onClick={e => {
                  this.setState({
                    activeRecordIdx: idx
                  })
                }}
                key={idx}>点击查看{item.username}的详情</span>
            )
          })
        }
        <DescHelper
          keyMapper={this.keyMapper}
          record={this.records[activeRecordIdx]} />
      </div>
    )
  }
}

<ForTable />
```