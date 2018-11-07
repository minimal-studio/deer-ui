```js
const DescHelper = require('./desc-helper').default;
const { ShowGlobalModal } = require('../modal');

class ForTable extends React.Component {
  constructor(props) {
    super(props);

    this.keyMapper = [
      {
        key: 'username',
        title: (keyMapper) => {
          return (
            <span>使用 func title 返回表头</span>
          )
        },
        namesMapper: {
          alex: '埃里克斯',
          chili: '吃梨',
          dove: '德芙',
        }
      },
      {key: 'age'},
      {key: 'add'},
      {key: 'birth', date: 1},
      {key: 'action', filter: (str, item) => {
        return (
          <span
            onClick={e => ShowGlobalModal({
              children: <DescHelper keyMapper={this.keyMapper} record={item} />
            })}
            className="link-btn">详情</span>
        )
      }}
    ]

    this.records = [
      {
        username: 'alex',
        age: '100,100',
        add: 'cn',
        birth: new Date('1999-01-01'),
      },
      {
        username: 'chili',
        age: '102',
        add: 'cn',
        birth: new Date('1999-01-01'),
      },
      {
        username: 'dove',
        age: '50',
        add: 'cn',
        birth: new Date('1999-01-01'),
      },
      {
        username: 'susam',
        age: '20',
        add: 'uk',
        birth: new Date('1999-01-01'),
      },
    ]
  }
  render() {
    return (
      <div>
        <CardTable
          keyMapper={this.keyMapper}
          records={this.records} />
      </div>
    )
  }
}

<ForTable />
```