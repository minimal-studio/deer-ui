# @deer-ui

基于 React 的，可扩展的 UI 库。

## Support

- 支持客户端渲染的 React 应用
- 支持服务端渲染的 React 应用 (例如 Gatsby, Next)

## Getting started

### core

核心 UI 库

```shell
yarn add @deer-ui/core @mini-code/base-func unistore
```

### enhance-ui

增强 UI 库

```shell
yarn add @deer-ui/enhance-ui @deer-ui/core @mini-code/base-func unistore
```

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { ShowModal, CloseModal } from '@deer-ui/core/modal';
import { Button } from '@deer-ui/core/button';

const handleClick = (e) => {
  const ModalID = ShowModal({
    title: 'Overlay',
    elem: e,
    children: (
      <div>Content</div>
    )
  })

  // CloseModal(ModalID)
}

const App = () => (
  <Button onClick={handleClick}>
    Overlay
  </Button>
)

ReactDOM.render(<App />, document.querySelector('#Main'));
```

## Local dev

```shell
git clone https://github.com/minimal-studio/deer-ui
cd deer-ui
yarn
yarn dev:doc
```

## Reference

- [Online Doc](https://ui.thinkmore.xyz/)
- [FormGenerator](https://ui.thinkmore.xyz/#/G-Desc)
- [CHANGELOG](./CHANGELOG.md)
- [Components Desc](./docs/components.md)
