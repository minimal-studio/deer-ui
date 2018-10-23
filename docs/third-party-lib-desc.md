#### 引用外部库依赖说明

为了尽量减少三方库的依赖，实现体积小，运行效率高的轻 UI 库，外部库都通过 load script 的方式引入

外部库引用列表

- CroppieJs // 自定义裁剪头像
- ChartJs   // 数据图表化

```jsx static
// 在使用以下组件之前设置，设置一次即可
import { Avatar, ChartDOM } from 'ukelli-ui';

Avatar.setCroppieUrl(loadUrl);
ChartDOM.setChartJSPath(loadUrl);
```