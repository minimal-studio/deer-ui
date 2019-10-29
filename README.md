# @dear-ui

Base on React's UI lib. Make frontend's dev simpler and faster.

<!-- [![Build Status](https://travis-ci.org/ukelli/dear-ui.svg?branch=master)](https://travis-ci.org/ukelli/dear-ui)
[![install size](https://packagephobia.now.sh/badge?p=dear-ui)](https://packagephobia.now.sh/result?p=dear-ui) -->

## Support

- Client side render React App
- Server side render React App (like Gatsby, Next)

## Getting started

```shell
yarn add @dear-ui/all @mini-code/base-func unistore
```

### Use in project

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { ShowModal, CloseModal } from '@dear-ui/all/core/modal';
import { Button } from '@dear-ui/all/core/button';

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
git clone https://github.com/minimal-studio/dear-ui
cd dear-ui
yarn
yarn docz:dev
```

## Reference

- [Online Doc](https://ui.ukelli.com/)
- [FormGenerator](https://ui.ukelli.com/#/G-Desc)
- [CHANGELOG](./CHANGELOG.md)
- [UI logic of FormGenerator](./docs/ui-logic.md)
- [Components Desc](./docs/components.md)
