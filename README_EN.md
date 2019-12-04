# @deer-ui

Base on React's UI lib. Make frontend's dev simpler and faster.

<!-- [![Build Status](https://travis-ci.org/ukelli/deer-ui.svg?branch=master)](https://travis-ci.org/ukelli/deer-ui)
[![install size](https://packagephobia.now.sh/badge?p=deer-ui)](https://packagephobia.now.sh/result?p=deer-ui) -->

## Support

- Client side render React App
- Server side render React App (like Gatsby, Next)

## Getting started

```shell
yarn add @deer-ui @mini-code/base-func
```

### Use in project

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
yarn docz:dev
```

## Reference

- [Online Doc](https://ui.thinkmore.xyz/)
- [FormGenerator](https://ui.thinkmore.xyz/#/G-Desc)
- [CHANGELOG](./CHANGELOG.md)
- [Components Desc](./docs/components.md)
