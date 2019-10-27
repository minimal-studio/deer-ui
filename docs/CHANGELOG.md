# Change logs of Ukelli UI

-----------------

## 3.3.0

- TipPanel 改名为 Alert
- 调整 DatetimePicker 的样式
- 调整 DatetimePicker 引入 flatpickr 的方式
- 调整 Pop 的实现，符合服务端渲染

## 3.2.0

- 修改所有 uke- 前缀的 className
- 修复 position 可能出现的无限循环问题

## 3.1.1

- FormLayout 的 btnConfig 改名为 formBtns

## 3.1.0

- 数据表渲染组件的 prop keyMapper 重命名为与数据库定义的 columns，更加语义化
- 调整降低绿色的饱和度，更加舒适
- 优化 DropdownWrapper 的功能，以及定位实现，统一定位模块

## 3.0.1

- 调整全局变量的引用，兼容服务端渲染
- 调整 Pagination 的交互

## 3.0.0

### 项目重构

- 全面使用 Typescript 重构项目
- 所有组件提供代码提示，Props 和 API 的参数检查
- 整理并精简项目结构和代码
- 调整 /core/utils 目录的结构，按照功能更细致划分代码，旧的 /core/uke-utils 的功能也合并到其中
- 调整 ClickAway 的目录位置，可以通过 /core/click-away 引用
- 调整并统一 Button 的样式，去除 `className: flat`

### 新特性

- 全新的 Color 系统
  - 全新的 scss 架构和主题定制
  - 全新的配色方案
- Avatar 支持 Color 系统

### 颜色更改

- 新增 light-blue
- 废弃 gold

### 废弃组件

- state-manager
- selector-filter.js

### 废弃组件名

- DatepickerHelper

### 废弃 API

- Input.props.inputType

### 组件更名

- InputVerify -> InputNumber

### 组件更新

#### Input

- 优化参数传递
- 优化 Title 上浮效果的应用

#### Avatar

- 新加入 Color 系统

#### Button

- 优化样式

#### Carousel

- props 更改: styleConfig -> style

#### Tabs

- 新增 tabsClassName 取代旧的 className

#### Table

- whenCheckAction 更名为 checkedOverlay

#### Pagination

- 更改 defaultProps.infoMapper 与 props.infoMapper 的默认数据结构一致
- 优化显示和交互

```js
// change
<Pagination
  infoMapper={{
    pIdx: 'PageIndex',
    pSize: 'PageSize',
    total: 'AllCount',
    active: 'UsePaging',
  }} />

// to
<Pagination
  infoMapper={{
    pIdx: 'pIdx',
    pSize: 'pSize',
    total: 'total',
    active: 'active',
  }} />
```

-----------------

## 2.17.17

- 修复查询条件组件清空 datetime 不正确的问题

## 2.17.16

- Table 新增 clickToHighlight 接口

## 2.17.15

- Checkbox 添加 forwardRef

## 2.17.14

- 修改 Tip 的样式

## 2.17.13

- 修复一些问题

## 2.17.12

- 优化 Tip 组件，添加可以渲染子内容
- 优化 Avatar，添加 Tip 提示

## 2.17.11

- update basic-helper

## 2.17.10

- 添加分页的国际化字段

## 2.17.9

- 调整 Avatar 的样式

## 2.17.8

- FormLayout 的 Button 支持更多属性传入

## 2.17.7

- Button 添加 style 属性

## 2.17.6

- 优化组件内的国际化

## 2.17.5

- 修复一些问题

## 2.17.4

- 修复一些问题

## 2.17.3

- 修复一些问题

## 2.17.2

- 修复一些问题

## 2.17.1

- 完善 FormGenerator 的 title 的国际化

## 2.17.0

### 组件重做

- 重做 Avatar，统一参数传入，优化头像选项等功能，暂时不提供自定义头像功能

### 配置调整

- 不再提供 getImage 配置
- LoadStuff 放入 /core/utils 包中

### 国际化优化

- 重做国际化，删除 getKeyMap 接口，改为全面翻译(mapper)的方式，参考文档的国际化配置

-----------------

## 2.16.6

- 修复 Table 中的 Dropdown 的定位问题
- Table 新增一个 alignRightTypes 接口，用于对不同类型的字段做向右排序

## 2.16.5

- 完善 Button 的布局内容的样式实现

## 2.16.4

- Button 的 res 响应式模式下文字居中

## 2.16.3

- 去除 FormLayout 中的按钮的 span 包装

## 2.16.2

- 修复 FormLayout 的按钮的参数重复的问题

## 2.16.1

- DropdownWrapper 新增触发方式接口 trigger, 用于触发 click || hover

## 2.16.0

### 重做组件

- 优化 DropdownWrapper 的参数传递方式，更加明确传递的功能，children 为显示内容，overlay 为弹出遮罩
- 重做 DateShortcut，使用 DropdownWrapper 的方式实现

-----------------

## 2.15.61

- 修复下拉菜单的搜索值的问题
- DropdownWrapper 的 menuWrapper 改为 overlay

## 2.15.60

- DropdownWapper 新增 scrollElem 接口，用于监听滚动隐藏的容器元素

## 2.15.59

- 修复 Modal 下的 Dropdown 和 Popover 的定位问题

## 2.15.58

- 修复问题

## 2.15.57

- 修复 Dropdown 的问题

## 2.15.56

- 完善 DropdownMenu 的实现
- 优化 Table 的 warn 输出机制

## 2.15.55

- 修复定义全局引用的错误

## 2.15.54

- 升级 basic-helper 的依赖

## 2.15.52

- 修复 Table 的统计数字的问题

## 2.15.51

- 修复 Loading 的样式问题

## 2.15.50

- 调整 Notify 的样式

## 2.15.49

- 修复 FormFilter 中 Input 的问题

## 2.15.48

- 调整 Input 的 type 和 propsForInput 的优先级

## 2.15.47

- 优化 Input 组件

## 2.15.46

- 优化 Input 接受的 props
- Input 的 inputType 改为 outputType

## 2.15.45

- 调整 formFilter 的 input 参数传递

## 2.15.44

- 修复 Label 在白色背景下显示白色字体的问题

## 2.15.43

- 废弃 DatetimePicker 的 enableTime 属性
- 完善时间输出的机制

## 2.15.42

- ConditionGenerator 新增是否 submit 表单的判定

## 2.15.41

- 优化时间范围选择器的显示和交互
- 优化 ConditionGenerator 的交互

## 2.15.40

- 调整 Tab 的样式
- Table 的 rowKey 新增 idx 作为回调参数

## 2.15.39

- 修复 textarea 的值的问题

## 2.15.38

- 修复时间空间选择相同日期报错的问题

## 2.15.37

- 修复一些样式问题

## 2.15.36

- 修复时间选择器的样式

## 2.15.35

- 优化时间选择器的交互，可以让用户手动输入，如果遇到错误的时间格式会做提示
- 优化关闭按钮的样式
- 修复日期快捷方式无法选择的问题

## 2.15.34

- 修复点击时间范围的 UI 不重新渲染的问题

## 2.15.33

- 修复 FormLayout 的 props 验证
- 优化 Pop 的指示器的位置显示准确性
- 优化 Avatar 的实现

## 2.15.32

- 修复 FormGenerator 时间范围的问题

## 2.15.31

- 添加 ConditionGenerator 的配置判断

## 2.15.30

- 修复问题

## 2.15.29

- 优化 FormGerenator 的 Title 的样式

## 2.15.28

- FormGerenator 新增 Title 的配置

## 2.15.27

- 调整 Pop 的位置

## 2.15.26

- 优化 Menus 的样式

## 2.15.25

- 优化 Popover 的定位和样式
- 优化 TipPanel 的样式
- 调整 Modal 的默认参数传递
- 优化 Button 的默认参数传递

## 2.15.24

- 修复一些问题

## 2.15.23

- 修复 ToolTip 的问题
- Nitify 超过 4 个以后才出现关闭所有按钮

## 2.15.22

- 修复一些问题

## 2.15.21

- 修复 ModalHelper 的问题

## 2.15.20

- 调整 ModalHelper 的使用方式

## 2.15.19

- 修复 Table 的数据源改变时不自动计算宽度的问题
- 调整 Modal 的参数

## 2.15.18

- 调整 Table 的排序策略，新增一个 onSort 的排序设置

## 2.15.17

- 调整 Modal 的 marginTop 控制

## 2.15.16

- 优化 DescHelper 的显示以及样式控制

## 2.15.15

- 修复最小化 Modal 时不能滚动的问题

## 2.15.14

- 响应浏览器变形后的 Table 宽度计算机制

## 2.15.13

- 修复 FixedTableHeader 的宽度计算错位问题
- 新增 fixedRightKeys && fixedLeftKeys 接口，拓展固定表格的方法

## 2.15.12

- 修复 Table 表头有时候渲染失效的问题

## 2.15.11

- 完善表格显示的动画

## 2.15.10

- 完善 Table 的 fixedTable 的切入显示

## 2.15.9

- 完善 Table 的显示判断

## 2.15.8

- 修复 Table isHidden 的判断

## 2.15.7

- Table 新增一个检测器，监听自身是否在隐藏元素之中，如果是，则设置监听器一直监听

## 2.15.6

- 优化 Table 样式和性能

## 2.15.5

- 调整 Table 的 fixedTable 样式

## 2.15.4

- 提高 Table 的固定表格的同步滚动性能

## 2.15.3

- 修复 Selector 对于 array 的值的判断

## 2.15.2

- 完善 Table 固定列的显示效果

## 2.15.1

- 鼠标移过 Table row 时可以同步设置 mainTable fixedTable 的效果

## 2.15.0

- Table 重构，新增固定列

-----------------

## 2.14.53

- 修复轮播图的问题
- 调整 Table 的结构

## 2.14.52

- 修复 DropdownGroup 的错误

## 2.14.51

- 修复 Loading 的动画问题

## 2.14.50

- 完善 dropdown

## 2.14.49

- 调整 dropdown 的样式

## 2.14.48

- Table 新增一个 rowKey 的 props 接口，用于提高 Table 的性能

## 2.14.47

- 优化选择器的交互和样式
- 优化 Table 的选择器插件的样式

## 2.14.46

- 优化 Notify 的自动关闭的定时器

## 2.14.45

- Modal 新增 side 模式

## 2.14.44

- Table 新增表头选择器的 onChange 回调
- 优化 Modal 的最小化实现

## 2.14.43

- 优化表格统计的格式
- 优化 Modal 的实现，使用 transfrom 替代 top left 定位
- Modal 组件新增最大化最小化功能

## 2.14.42

- 修复 DateRanger 的 enableTime 出现的问题

## 2.14.41

- 修复验证码的问题，添加验证码的测试用例

## 2.14.40

- 修复验证码的问题

## 2.14.39

- 优化通知的样式显示和交互方式

## 2.14.38

- 修复 DatetimePicker 的 enableTime 时不触发 onChange 的问题

## 2.14.37

- 修复日期控件 unmount 时可能出现的错误

## 2.14.36

- 完善 Switch 组件的不受控状态

## 2.14.35

- 修改 basic-helper 的引用方式

## 2.14.30

- 表单聚合组件添加了清空表单值的方法

## 2.14.29

- 修复 Table 可能出现的无限循环

## 2.14.28

- 修复 radio 的 props checker 的警告

## 2.14.27

- 完善 PureIcon 和 Icon 的切换

## 2.14.26

- 整理 Icon，新增 PureIcon 组件，支持更多的参数传入方式

## 2.14.25

- 完善 Grid 的布局机制

## 2.14.24

- 调整 ConditionGenerator 的样式

## 2.14.23

- 修正 Menus 的 props checker

## 2.14.22

- 完善 Menus 的数据，添加分割线
- DropdownMenu 现在使用和 Menus 同一个组件

## 2.14.21

- Tabs 新增只渲染 content 的参数

## 2.14.20

- Tabs 的 closeabled 改为 closeable
- 调整 Tabs 的 closeBtn 的样式

## 2.14.19

- 优化 DropdownWrapper 的指示器的位置

## 2.14.18

- 优化 Notify 的样式

## 2.14.17

- Table 新增 needSort 配置，可以选择不排序

## 2.14.16

- 修复 keyMapper 的数量判断

## 2.14.15

- 修复 TableBody 减少 keyMapper 数量时出现的无限循环

## 2.14.14

- ToolTip 支持颜色

## 2.14.13

- 修复 Pop 的定位问题

## 2.14.12

- 调整 Table 的样式

## 2.14.11

- 调整 Table 的样式

## 2.14.10

- 调整 Table 选中后出现的内容的样式

## 2.14.9

- 新增 Menus 组件

## 2.14.8

- Pagination 组件根据 pSize 确定选择器

## 2.14.7

- DropdownWrapper 添加可自定义的外层菜单

## 2.14.6

- DropdownGroup 添加 title
- 添加 Dropdown LinkSelector
- 修复 Tabs 的 key 的问题

## 2.14.5

- 修复 Table 的样式

## 2.14.4

- 修复 Table 的样式

## 2.14.3

- FormFilter 支持 Checkbox 控件

## 2.14.2

- 新增 Checkbox
- 优化 Radio 对于选中图标的支持
- 优化 DropdownGroup 的输出值
- 优化 Pagination 的 className

## 2.14.1

- 修复 DropdownWrapper 的 outside 的问题

## 2.14.0

### 新功能

- 抽离 Dropdown 的实现，新增一个 DropdownWrapper 组件，可以打开任意内容
- 新增一个 DropdownGroup 的组件

### 改进

- DropdownMenu 使用 DropdownWrapper 实现

-----------------

## 2.13.21

- 调整表格过滤器的顺序

## 2.13.20

- 调整表格过滤器的顺序

## 2.13.19

- 新增表格对于 Label 的统一处理方式

## 2.13.18

- 优化 Tab 的 key 传入
- 优化 Popover 的位置实现
- 优化 Modal 打开时的实现
- 优化 Toast 的点击触发机制

## 2.13.17

- 优化 Notify 的样式

## 2.13.16

- 优化表格的实现

## 2.13.15

- 增强 Label 的颜色控制

## 2.13.14

- 修复 DatePicker 的 enableTime 的问题

## 2.13.13

- 调整 DropdownMenu 的样式层级

## 2.13.12

- 调整 RecordRender 的输出

## 2.13.11

- 升级版本号，与 2.13.10，因为 npm 的 bug

## 2.13.10

- 调整 Table 的表头的条件输出机制

## 2.13.9

- Treelist 新增 defaultValue

## 2.13.8

- 修复 Treelist 的选择问题
- Treelist 添加默认选中值
- 修复 Pop 元素定位问题

## 2.13.7

- 修复 DropdownMenu 的定位问题
- 修复 Table 的最长样式问题

## 2.13.6

- 升级 basic-helper
- 修复 DateShortcut 的问题

## 2.13.5

- Table 添加新的表头配置，支持选择器模式
- DropdownMenu 支持渲染到 react root 以外区域，支持自定义其中的文字提示内容

## 2.13.4

- 调整 TreeList 的输出 value

## 2.13.3

- 调整 Input 的输出机制
- 调整 FormFilter 对于空字符串的判断

## 2.13.2

- 修复 TreeList 的一些问题

## 2.13.1

- 修复 TreeList 的一些问题

## 2.13.0

- 新增 TreeList 组件
- 调整 Radio 多选状态的样式

-----------------

## 2.12.3

- 回退 Loading 的实现

## 2.12.2

- 抽离 ToUTC 方法

## 2.12.1

- 调整时间输出的格式，默认输出 UTC 标准时间

## 2.12.0

- 调整 DatetimePicker 的输出，默认输出 ISOString
- 分页新增总页数控制

-----------------

## 2.11.4

- 调整 Loading 样式

## 2.11.3

- 调整 FlipClock 的样式

## 2.11.2

- 调整 FlipClock 的倒计时判断机制

## 2.11.1

- 修复 FlipClock 的问题

## 2.11.0

- 正式添加 FlipClock 组件

-----------------

## 2.10.6

- 增强 Button 的 loading 体验
- 调整 ShowModal ，默认没用按钮

## 2.10.5

- Loading 组件支持 children 函数写法

## 2.10.4

- 调整 ClickAway 的 props 检查

## 2.10.3

- 修复对 refs 的 require 验证

## 2.10.2

- 修复 refs 的默认值问题

## 2.10.1

- 取出多余打印

## 2.10.0

- 重做 Loading 控件，在 loading 状态下不再渲染 children

-----------------

## 2.9.33

- 调整 Switch 的禁用状态样式

## 2.9.32

- 调整 input-control 的 class

## 2.9.31

- 修复 DatePicker 的问题

## 2.9.30

- 优化 FormFilter 对 getFormOptions 的判断

## 2.9.29

- 优化 Modal 的实现
- 添加 Modal 的 template 接口，可以自定义 Modal 的所有内容

## 2.9.28

- 修复时间控件输出为数组的问题

## 2.9.27

- 修复 Selector 的问题

## 2.9.26

- 调整 Chart 的高宽

## 2.9.25

- 修复 DropdownMenu 对于 0 的判断

## 2.9.24

- 修复 Card 参数 style 的传递问题

## 2.9.23

- 优化 Chart 的效率，新增重新渲染 Chart 的机制

## 2.9.22

- 导出 InputSelector 组件

## 2.9.21

- 优化 DropdownMenu 对于 multiple 模式下的默认值的设置

## 2.9.20

- 升级 BasicHelper

## 2.9.19

- 修复 DropdownMenu 的问题

## 2.9.18

- 完善 ClickAway 点击元素以外的组件和机制
- 修复一些问题

## 2.9.17

- 完善 FormFilter 对于 refu 的 input-selector 的判断机制

## 2.9.16

- 优化 DropdownMenu，添加是否需要 action 按钮的配置
- 优化 FormFilter 对于 InputSelector 的支持

## 2.9.15

- 调整 loading 动画的 zIndex

## 2.9.14

- 完善 Modal 的 onClose 回调

## 2.9.13

- Selector 组件的 values 改变时再触发一次 changeValue，保证数据的输出的正确性

## 2.9.12

- 完善 ChartCom 的画图机制
- 完善 FormFilter 对于新配置的值的判断机制
- 调整 Grid 的布局机制

## 2.9.11

- 完善 InputSelector 的受控模式

## 2.9.10

- 完善动态表单的例子
- 完善选择器对于 values 的改变而作出变化

## 2.9.9

- 完善 CloseAllModal 的机制

## 2.9.8

- 导出 CloseAllModal 方法

## 2.9.7

- 新增一个 CloseAllModal 的方法
- FormFilter 支持 ConditionGenerator

## 2.9.6

- 增强 FormFilter 对新传入的 FormOptions 的支持

## 2.9.5

- 调整 FormFilter 的 input-selector 的默认值参数配置参数，refuDefaultIdx -> defaultValueForS

## 2.9.4

- 改进 LoadScript 的机制
- 修复 ChartDOM 加载的问题

## 2.9.3

- 完善 Grid 的布局

## 2.9.2

- 调整 Grid 的 props 验证

## 2.9.1

- 调整 Grid 的 defaultProps

## 2.9.0

### 新功能

- 添加 Grid 布局

### fixbug

- 修复 Table 的选择项的状态不更新问题

-----------------

## 2.8.7

- 调整 textarea 的样式
- 调整 switch 的 defaultValue 传入

## 2.8.6

- 优化 Pop 判断边界的情况

## 2.8.5

- 提升 record render 记录渲染器的是否重新渲染的机制层级，提升渲染效率

## 2.8.4

- 加入 input-selector-s 和 switch 的验证

## 2.8.2

- 新增一个 input-selector-s 控件，可以把选择条件和输入内容分别输出

## 2.8.1

- 添加日期控件的更多 props
- 优化 popover 对于边界的判断
- GlobalPopover 新增一个别名 Pop
- 新增 ShowModal 和 CloseModal， 对应 ShowGlobalModal 和 CloseGlobalModal 的别名

## 2.8.0

### 新功能

- 添加 Switch 开关组件
- 添加对应 Switch 的 FormGenerator 的设置

-----------------

## 2.7.47

- 修复 FormLayout 对 submit 的误报

## 2.7.46

- 提升 Table 的渲染效率

## 2.7.45

- 优化 Modal 的样式

## 2.7.44

- 去除多余样式

## 2.7.42

- 修复 FormLayout onSubmit 触发两次的问题

## 2.7.41

- 修复 radio 的判断

## 2.7.40

- 修复下拉选择器对于 isNum 的判断问题
- 调整 radio 多选的交互

## 2.7.39

- 优化验证码的刷新机制

## 2.7.38

### 优化

- 优化分页的实现
- 优化 FormGenerator 的表单组件，实现 submit 提交
- 修复 DatePicker 输出时分秒的错误

### 新功能

- 添加 LinkSelector 联动选择器

## 2.7.37

- 优化 FormGenerator 的自定义组件接口

## 2.7.36

- 调整验证码自动刷新的策略，不再无限刷新

## 2.7.35

- 优化轮播图组件
- 整理图标命名

## 2.7.34

- 修复 Modal 的问题

## 2.7.33

- 优化 ChartCom 的实现，完善加载前后的顺序

## 2.7.32

- 导出 Card

## 2.7.31

- 新增一个 Card 组件

## 2.7.30

- 修复 TipPanel 不现实开关按钮的问题

## 2.7.29

- 修复 Modal 错位的问题

## 2.7.28

- 调整 Modal 的层级样式

## 2.7.27

- Popover 新增 style

## 2.7.26

- 修复 Modal 的样式问题

## 2.7.25

- Modal 新增是否禁用 maxHeight 的选项
- 调整 Modal 的策略，修复内存没有释放的问题

## 2.7.24

- 修复一些问题

## 2.7.23

- 修复 Popover 的定位问题

## 2.7.22

- 调整 Tabs 的样式问题

## 2.7.21

- 优化 ToolTip 的结构
- 优化 popover 的判断 children 是否更新的机制
- 调整 Tabs 的关闭按钮，新增按钮提示

## 2.7.20

- Input 组件现在新增一个 filter，用于过滤出期望的值

## 2.7.19

- 调整 ToolTip 样式
- 调整 DatePicker 的输出格式，优化接口
- 调整 DateShortcut 的输出格式，优化接口
- 调整所有包含 componentWillReceiveProps 声明周期函数的组件的实现，逐步放弃使用该方法
- FormLayout 的 btnConfig 添加是否需要预检查接口

## 2.7.18

- 新增 FormGenertor 和 ConditionGenerator 的提示按钮
- 新增所有 Table 的提示接口

## 2.7.17

- 调整 input 的 title 的类型检查

## 2.7.16

- 重做 Input 的 number 类型的机制，支持输出 number
- 修复 input-range 不能做表单验证的问题
- 调整 DropdownMenu 对于无效值的验证以及对应的样式
- 新增 UkeComponent 和 UkePureComponent，用于被继承用于获取国际化以及内部配置

## 2.7.15

- 优化 Dropdown 的样式

## 2.7.14

- 调整 Table 的 checkbox 的宽度
- 调整 conditionGroup 的输入框样式

## 2.7.12 2.7.13

- 调整 Input 的样式

## 2.7.11

- 修复 Input 输入为 0 不现实的问题

## 2.7.10

- 重命名一些组件的名字，更符合实际用途
  - TableBody -> Table
  - MultipleHelper -> Multiple
  - DatepickerHelper -> DateShortcut
  - RecordItemsHelper -> CardTable
- 优化大部分组件的 key 的实现，不再依赖数组的 index，提高性能
- 优化 RecordFilter 的所有组件的表头的实现
- 优化 Selector 的说明
- 新增 basicHelper 的说明

## 2.7.9

- 完善 Notify 的 position 和 ID 的机制，不再强制传入 ID
- 优化所有按钮的实现，新增所有颜色的 hola 按钮样式

## 2.7.8

- 优化 TableBody 的性能
- 优化 DescHelper 的实现，以及对于长字符的优化

## 2.7.7

- 修复 formFilter 的刷新验证码的功能

## 2.7.6

- 修改 Pagination 的默认值

## 2.7.5

- 优化 ToolTip 的逻辑，新增 position 的控制
- 优化 tableBody 的判定

## 2.7.3

- 优化 Steps 的逻辑，新增一些 Steps 的类型的图标

## 2.7.1

- 优化布局的预设 css，优化 steps

## 2.7.0

- 新增一个 Steps 分步组件

-----------------

## 2.6.9

- 修复 formFilter 检查 required 的问题

## 2.6.8

- 修复 formFilter 的 input 为 number 返回字符串的问题
- 新增预设 class 的说明

## 2.6.5

- 修复一些由于错误 propTypes 的 checker 函数导致的警告
- 调整 Icon 的 props
- 调整 Avatar 的样式
- 添加 formGenerator 的日期范围的例子

## 2.6.4

- 修复中英文的问题
- 修复 ranger 的问题
- 修复 formFilter 引用的问题
- 调整 Icon 的 prop 传入
- 修复 selector 的 props checker
- 优化 FormLayout 的提示机制，先内置过滤一遍 form 的检查
  
## 2.6.3

- iconPrefix 可以为字符串

## 2.6.1

- 新增 tableBody 的 func title

## 2.6.0

- 补全所有的文档说明
- 调整了 scss 的结构，补全一些缺失样式
- 修改了一些接口的名字
- 调整了分页组件（Pagination）的实现
- 调整了 Popover 的接口，把 setPopover 调整为 set，showPopover 调整为 show，把 closePopover 调整为 close
- Tab 现在挂载在 Tbas 中，可以通过 Tbas.Tab 引用

-----------------

## 2.5.12

- 优化 TableBody 实现，新增 checkbox 组件

```jsx static
import { TableBody } from 'ukelli-ui';

<TableBody
  onCheck={(nextItems, idx) => {
    this.checkedItems = nextItems;
  }}
  whenCheckAction={whenCheckAction}
  keyMapper={_thumbKeyMapper}
  records={records}
  needCheck={needCheck}
  needCount={needCount}/>
```

## 2.5.10

- 优化结构
- 新增 Tooltip 组件
- 优化 popover 组件
- 优化大部分组件的样式
- 整理 icon 的引用，设置了默认的 iconMapper

```jsx static
// icon 使用了 awsome icon 库
let defaultIconMapper = {
  arrow: 'angle-left',
  date: 'calendar-alt',
  more: 'equals',
  close: 'times',
  close: 'times',
  noData: 'thermometer-empty',
  success: 'check',
  error: 'exclamation-circle',
  'circle-up': 'arrow-circle-up',
  'circle-down': 'arrow-circle-down',
}
```

-----------------

## 2.4.33

- 把 Avatar 中的依赖抽离出来

依赖 Croppie js [地址](http://foliotek.github.io/Croppie/)

可以设置加载的路径

```jsx static
import { Avatar } from 'ukelli-ui';

Avatar.setCroppieUrl(loadUrl);
```

-----------------

## 2.4.31

- 支持国际化

分为外部 KeyMapper 和内部 UkeKeyMapper 两种情况，可以通过 setUkeLang 设置语言，默认提供 「中文」 和 「英语」 两种语言，也可以通过 setUkeLangConfig 设置更多的语言

```jsx static
import { setUkeLang, setUkeLangConfig } from 'ukelli-ui';

setUkeLangConfig({
  'zh-HK': {
    '无': '無'
  }
});
setUkeLang('zh-HK');
```

切换语言时，也需要设置外部

## 2.4.22

- Modal 新增可拖动模式

## 2.4.20

- Ranger 支持手势滑动

## 2.4.8

- DropdownMenu 支持 number 的 value

## 2.4.0

- 提供一个基础的 class state manager，用于管理通用异步的组件中的 state ，抽离于 ActionBasic ， ActionBasic 可以为更专注于业务处理

使用方式

```jsx static
import {StateManager} from 'ukelli-ui/other/state-manager';

1. 继承 StateManager
2. 重写其中的流程 hook

class ActionBasic extends StateManager {
  showResDesc() {
    // do anything
  } // 用于
  checkResIsSuccess(resData) {
    return boolean
  } // 检查业务回调是否成功
  defaultStateAfterPost(resData, sendOptions) {
    return {}
  } // 触发在请求后，setState 前
  wrapDataFilter(sendData) {
    return {}
  } // 发送请求前的 data 对象的 hook
  request(reqObj) {
    return async function
  } // 业务数据发送接口, 需要返回异步函数
}
```

-----------------

## 2.3.0

- 优化 FormFilter 和 FormGenerator 的实现
- 新增 select-n 的表单类型，用于渲染原生的 select 组件，提供移动端使用
- 重做了 select 的实现方式与样式
- 重做 Radio 组件的样式与结构
- 优化 Modal 的参数传递
- 优化 button 的样式，以及提供的 mixin 方法
- 重做 ranger 的样式与交互，新增 input verify 辅助
- 增强 input verify 的功能，

-----------------

## 2.2.4

- 优化 Notification 的样式, 新增可以控制的 action btn 的 text

-----------------

## 2.2.*

- 不再使用 $GH ，而是更严谨的 import 对应的方法
- 优化 Notify 全局方法

-----------------

## 2.1.*

1. 废除 citySelector，改为联动组件
2. formGenarator 新增一个可以自定义控件的接口
3. var.scss 提供一些通用的样式配置 @mixin scss 配置，需要在外部引入
4. 重做 IconInput 组件，名字不再是 IconInput，而是统一为 Input
5. form 的配置 text 多了一个 highlight: true 的选项
6. 调整 formLayout showDesc 的时机，更友好的提示
7. formGenarator 新增两个参数 showInputTitle: bool， isMobile: bool，可控制显示的模版

-----------------

## 2.0.*

1. 重做的 dropdown menu
2. 分离 core 和 other 文件

-----------------

## 1.8.*

1. 新增 notification 通知组件

-----------------

## 1.7.*

1. FormHelper 改名为 FormGenerator
2. ConditionHelper 改名为 ConditionGenerator
