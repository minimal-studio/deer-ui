```js
class ForRanger extends React.Component {
  render() {
    return (
      <div>
        <Ranger
          range={[0, 99]}
          precent={true}
          onChange={val => {
          console.log(val)
        }} />
      </div>
    )
  }
}

<ForRanger />
```