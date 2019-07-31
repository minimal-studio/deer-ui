# ukelli-ui

Base on React's UI lib. Make frontend's dev simpler, faster.

[![Build Status](https://travis-ci.org/ukelli/ukelli-ui.svg?branch=master)](https://travis-ci.org/ukelli/ukelli-ui)
[![install size](https://packagephobia.now.sh/badge?p=ukelli-ui)](https://packagephobia.now.sh/result?p=ukelli-ui)

## Installation

```shell
# yarn
yarn add ukelli-ui

# npm
npm i ukelli-ui
```

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { ShowModal, CloseModal } from 'ukelli-ui/core/modal';
import { Button } from 'ukelli-ui/core/button';

const handleClick = (e) => {
  const ModalID = ShowModal({
    title: 'Overlay',
    elem: e,
    children: (
      <div>内容</div>
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
git clone https://github.com/ukelli/ukelli-ui
cd ukelli-ui
yarn
yarn docz:dev
```

## Related reference

- [Online Doc](https://ui.ukelli.com/)
- [FormGenerator](https://ui.ukelli.com/#/G-Desc)
- [CHANGELOG](./docs/CHANGELOG.md)
- [UI logic of FormGenerator](./docs/ui-logic.md)
- [Import](./docs/import-desc.md)
- [Configure](./docs/configuration.md)
- [Components Desc](./docs/components.md)
