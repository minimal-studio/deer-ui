# Ukelli-UI 的内部配置说明

> Ukelli UI 提供一个 setUkelliConfig 接口，设置 UI 库内部结构

## 默认的 UkelliConfig

```js
const DefaultUkeConfig = {
  $T(key) {
    return key;
  },
  iconMapper: {},
  iconPrefix: (s) => `fa${s} fa-`,
}
```

## setUkelliConfig

```jsx static
import { setUkelliConfig } from 'ukelli-ui';

setUkelliConfig({
  // Icon 的 mapper， Ukelli UI 库并不提供内置的 icon，可以根据具体项目的实际使用来决定使用的 icon 库
  iconMapper,
  // icon 的前缀，与 iconMapper 同用
  iconPrefix,
})
```
