# ukelli-ui

[![Build Status](https://travis-ci.org/ukelli/ukelli-ui.svg?branch=master)](https://travis-ci.org/ukelli/ukelli-ui)
[![install size](https://packagephobia.now.sh/badge?p=ukelli-ui)](https://packagephobia.now.sh/result?p=ukelli-ui)

> 简易的 UI 库，像 Uke 小吉他一样轻松愉悦
> 
> 对使用者友好，对开发者友好，打通开发与用户的桥梁

## 应用场景

- 快速开发管理功能模块业务
- 快速构建 React 应用
- 可配置自由度高
- 轻量级 UI 实现

## 使用

```shell
yarn add ukelli-ui
```

```js
import { ShowGlobalModal } from 'ukelli-ui';

ShowGlobalModal({
  title: '弹出层',
  children: (
    <div>内容</div>
  )
})
```

## 参与

> 基于 docz 编写的文档和示例

```shell
git clone https://github.com/ukelli/ukelli-ui
cd ukelli-ui
yarn
yarn docz:dev
```

打开 [http://localhost:3000/](http://localhost:3000/) 本地预览

### 相关参考

- [在线文档](https://ui.ukelli.com/)
- [更新日志](./docs/update-logs.md)
- [关于 FormGenerator 的 UI 的逻辑](./docs/ui-logic.md)
- [按需加载](./docs/import-desc.md)
- [配置设置](./docs/configuration.md)
- [组件说明](./docs/components.md)
- [引用外部库依赖说明](./docs/components.md)
