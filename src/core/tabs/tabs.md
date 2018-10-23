默认的 Tabs 事例，状态由 Tabs 控制

```js
const { Tab } = Tabs;

<Tabs>
  <Tab label="切换到内容1">
    内容1
  </Tab>
  <Tab label="切换到内容2">
    内容2
  </Tab>
  <Tab label="切换到内容3">
    内容3
  </Tab>
</Tabs>
```

Tab Content 与 Tab Label 并列的事例

```js
const { Tab } = Tabs;

<Tabs inRow={true}>
  <Tab label="切换到内容1">
    内容1
  </Tab>
  <Tab label="切换到内容2">
    内容2
  </Tab>
  <Tab label="切换到内容3">
    内容3
  </Tab>
</Tabs>
```

自由控制 Tabs 事例

```js
const { Tab } = Tabs;

class ForTesting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTabIdx: 1
    }
  }
  render() {
    const { activeTabIdx } = this.state;
    return (
      <div>
        <div>
          <span className="btn theme" onClick={e => this.setState({
            activeTabIdx: 2
          })}>切换到最后一个 Tab</span>
        </div>
        <Tabs
          activeTabIdx={activeTabIdx}
          onChangeTab={idx => {
            this.setState({
              activeTabIdx: idx
            })
          }}>
          <Tab label="切换到内容1">
            内容1
          </Tab>
          <Tab label="切换到内容2">
            内容2
          </Tab>
          <Tab label="切换到内容3">
            内容3
          </Tab>
        </Tabs>
      </div>
    )
  }
}

<ForTesting />
```