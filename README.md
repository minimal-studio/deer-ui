# ukelli-ui

[![Build Status](https://travis-ci.org/ukelli/ukelli-ui.svg?branch=master)](https://travis-ci.org/ukelli/ukelli-ui)
[![install size](https://packagephobia.now.sh/badge?p=ukelli-ui)](https://packagephobia.now.sh/result?p=ukelli-ui)

> 轻量级 React UI 框架，探索另一种开发方式，尝试另一种可能。

## Installation / 安装

### Via Npm

```shell
# yarn
yarn add ukelli-ui

# npm
npm i ukelli-ui
```

## Usage / 使用

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { ShowModal, CloseModal } from 'ukelli-ui/core/modal';
import { Button } from 'ukelli-ui/core/button';

const handleClick = (e) => {
  const ModalID = ShowModal({
    title: '弹出层',
    elem: e,
    children: (
      <div>内容</div>
    )
  })

  // CloseModal(ModalID)
}

const App = () => (
  <Button onClick={handleClick}>
    弹出层
  </Button>
)

ReactDOM.render(<App />, document.querySelector('#Main'));
```

## 本地构建

> 基于 docz 编写的文档和示例

```shell
git clone https://github.com/ukelli/ukelli-ui
cd ukelli-ui
yarn
yarn docz:dev
```

打开 [http://localhost:3000/](http://localhost:3000/) 本地预览

## 相关参考

- [在线文档](https://ui.ukelli.com/)
- [聚合表单](https://ui.ukelli.com/#/G-Desc)
- [更新日志](./docs/update-logs.md)
- [关于 FormGenerator 的 UI 的逻辑](./docs/ui-logic.md)
- [按需加载](./docs/import-desc.md)
- [配置设置](./docs/configuration.md)
- [组件说明](./docs/components.md)
- [引用外部库依赖说明](./docs/components.md)
