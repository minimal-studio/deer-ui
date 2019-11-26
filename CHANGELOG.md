# Change logs of Deer-UI

## 4.0.0

### 组织升级

从 ukelli ui 升级为 @deer-ui，为产品化做基础建设

### 全面移动端支持

兼顾 PC 与移动端的交互组件

### 项目结构调整

项目结构调整为

- @dear-ui/core 核心组件
  - style
  - utils 工具库
    - config 配置
    - i18n 国际化
- @dear-ui/enhance-ui 基于核心组件的增强组件
  - style

### API 调整

彻底舍弃 window.$UKE 全局变量模式

- UkeComponent -> UIComponent
- $T_UKE -> $T_IN
- setUkeLang -> setUILang
- setUkeLangConfig -> setUILangConfig
- setUkelliConfig -> setUIConfig
- getUkelliConfig -> getUIConfig

### 组件文件名更改

@dear-ui/core

- pagin -> pagination
- button-basic -> button
- range-selector -> slider
- form-control/input -> input
- form-control/input-selector -> input-selector
- form-control/input-number -> input-number
- record-render/table -> table
- record-render/mapper-filter -> table/column-filter
- record-render/card-table -> table-card
- record-render/desc-helper -> table-row
- selector/radio -> radio
- selector/checkbox -> checkbox
- selector/dropdown-menu -> dropdown
- selector/dropdown-wrapper -> dropdown-wrapper
- selector -> selector-basic
- uke-component -> ui-component

@dear-ui/enhance-ui

- captcha -> enhance-ui/captcha
- selector/chart-dom -> enhance-ui/chart-dom
- selector/dropdown-group -> enhance-ui/dropdown-group
- tip-button -> enhance-ui/tip-button
- selector/link-selector -> enhance-ui/link-selector

### 组件名更改

- Ranger -> Slider
- DropdownMenu -> Dropdown
- CardTable -> TableCard
- DescHelper -> TableRow

### Props 更改

- Table 相关的 records -> dataRows

### FormGenerator

- 不再提供 captcha 的支持，需要通过扩展字段引入
- 重构 customForm 表单控件接入接口

### 文档调整

- 将文档单独放入 website 目录中，并且存放所有组件的文档和测试用例
