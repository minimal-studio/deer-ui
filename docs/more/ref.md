#### Repo

- [Repo of Ukelli UI](https://github.com/ukelli/ukelli-ui)
- [BasicHelper](https://github.com/SANGET/basic-helper-js.git)

#### 组件继承

Uke 组件继承自 UkeComponent 或 UkePureComponent

```jsx static
import { UkeComponent, UkePureComponent } from './utils';

class SomeUkeCom extends UkeComponent {
  /** 继承自 UkeComponent */
  /** 外部国际化键值对 $T() */
  $T = $T;
  /** uke 内部国际化键值对 $T_UKE() */
  $T_UKE = $T_UKE;
  /** 获取 uke 内部配置 */
  getConfig = getUkelliConfig;
  /** 设置 uke 内部配置 */
  setConfig = setUkelliConfig;
}
```
