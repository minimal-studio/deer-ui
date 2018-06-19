## update logs

-----------

### 2.3.0

- 优化 FormFilter 和 FormGenerator 的实现
- 新增 select-n 的表单类型，用于渲染原生的 select 组件，提供移动端使用
- 重做了 select 的实现方式与样式
- 重做 Radio 组件的样式与结构
- 优化 Modal 的参数传递
- 优化 button 的样式，以及提供的 mixin 方法
- 重做 ranger 的样式与交互，新增 input verify 辅助
- 增强 input verify 的功能，

-----------

### 2.2.4

- 优化 Notification 的样式, 新增可以控制的 action btn 的 text

-----------

### 2.2.*

- 不再使用 $GH ，而是更严谨的 import 对应的方法
- 优化 Notify 全局方法

-----------

### 2.1.*

1. 废除 citySelector，改为联动组件
2. formGenarator 新增一个可以自定义控件的接口
3. var.scss 提供一些通用的样式配置 @mixin scss 配置，需要在外部引入
4. 重做 IconInput 组件，名字不再是 IconInput，而是统一为 Input
5. form 的配置 text 多了一个 highlight: true 的选项
6. 调整 formLayout showDesc 的时机，更友好的提示
7. formGenarator 新增两个参数 showInputTitle: bool， isMobile: bool，可控制显示的模版

-----------

### 2.0.*

1. 重做的 dropdown menu
2. 分离 core 和 other 文件

-----------

### 1.8.*

1. 新增 notification 通知组件

-----------

### 1.7.*

1. FormHelper 改名为 FormGenerator
2. ConditionHelper 改名为 ConditionGenerator
