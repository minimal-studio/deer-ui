# Change logs of Dear-UI

## 4.0.0

### 重命名

从 ukelli ui 重命名为 dear-ui，为产品化做基础建设

### Code Change

- uke-component 改名为 ui-component，其中的 UkeComponent 改名为 UIComponent

### API Rename

- $T_UKE -> $T_IN
- setUkeLang -> setUILang
- setUkeLangConfig -> setUILangConfig
- setUkelliConfig -> setUIConfig
- getUkelliConfig -> getUIConfig

### 项目结构调整

项目结构调整为

- core 核心组件
- enhance 基于核心组件的聚合增强组件
- utils 工具库
- style 样式库
- config 配置
- i18n 国际化
- layout 布局

文件调整

- 将 FormGenerator 调整到 enhance 目录中
- 将文档单独放入 website 目录中，并且把所有组件的文档都放入其中

### 组件文件名更改

- pagin -> pagination
- button-basic -> button
- range-selector -> slider
- form-control/input -> input
- form-control/input-selector -> input-selector
- form-control/input-number -> input-number
- record-render/table -> table
- record-render/card-table -> table-card
- record-render/desc-helper -> table-row
- record-render/mapper-filter -> table/column-filter
- tip-button -> enhance/tip-button
- selector/radio -> radio
- selector/checkbox -> checkbox
- selector/dropdown-menu -> dropdown
- selector/dropdown-group -> dropdown-group
- selector/dropdown-wrapper -> dropdown-wrapper
- selector/link-selector -> enhance/link-selector
- selector -> selector-basic

### 组件名更改

- Ranger -> Slider

### Props 更改

- Table 相关的 records -> dataRows
