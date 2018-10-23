```js
class ForRanger extends React.Component {
  render() {
    return (
      <div>
        <Ranger onChange={val => {
          console.log(val)
        }} />
      </div>
    )
  }
}

<ForRanger />
```