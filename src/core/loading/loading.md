```jsx
class ForLoading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }
  }
  render() {
    const { loading } = this.state;
    return (
      <div>
        <span className={"btn flat mb10 " + (loading ? 'theme' : 'red')} onClick={e => {
          this.setState({
            loading: !loading
          })
        }}>切换 loading 状态</span>
        <Loading loading={loading} inrow={true}>
          <div style={{backgroundColor: '#f9f9f9', padding: 20}}>
            内容与 loading 共存
          </div>
        </Loading>
        <Loading loading={loading} inrow={false}>
          <div style={{backgroundColor: '#f9f9f9', padding: 20}}>
            内容与 loading 只有一个
          </div>
        </Loading>
      </div>
    )
  }
}
<ForLoading/>
```