模版提供一下功能

- 渲染远端表格数据
- 数据的具体字段过滤器
- 点击表头做已有数据排序
- 统计所有能统计的数字值
- 带有可选项

```js
const DescHelper = require('./desc-helper').default;
const { ShowGlobalModal } = require('../modal');

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
      {key: 'action', filter: (item) => {
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
  }
  render() {
    return (
      <div>
        <TableBody
          keyMapper={this.keyMapper}
          whenCheckAction={'选中后出现的内容，可以为任意值'}
          needCheck={true}
          needCount={true}
          records={this.records} />
      </div>
    )
  }
}

<ForTable />
```