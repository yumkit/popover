# Yumkit Dropdown

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]](https://travis-ci.org/yumkit/dropdown)

[npm-image]: https://img.shields.io/npm/v/@yumkit/dropdown?style=flat-square
[npm-url]: https://www.npmjs.com/package/@yumkit/dropdown
[travis-image]: https://travis-ci.org/yumkit/dropdown.svg?branch=master

A simple and customizable dropdown component for React

## Install

```
npm i @yumkit/dropdown
or
yarn add @yumkit/dropdown
```

## Features

- Auto positioning (vertical & horizontal)
- Custom animations
- Dropdown offsets
- Builtin typescript definitions

## Examples

- [Simple](https://codesandbox.io/s/github/Yumkit/dropdown/tree/master/examples/simple)
- [Css animation with transition-group](https://codesandbox.io/s/github/Yumkit/dropdown/tree/master/examples/css-animation)
- [React-spring animation](https://codesandbox.io/s/github/Yumkit/dropdown/tree/master/examples/spring-animation)

## Usage

```
import React from 'react';
import Dropdown from '@yumkit/dropdown';

export default function App() {
  const [opened, setOpened] = React.useState(false);

  return (
    <Dropdown
      isOpened={opened}
      renderDropdown={({state, content, ref, style}) =>
        state !== 'closed' && <div ref={ref} style={style}>{content}<div>
      }
      renderContent={() => <div>Your dropdown content is here</div>}
    >
      <button onClick={() => {setOpened(!opened)}}>Click me</button>
    </Drodpown>
  )
}
```

## API

ToDo

## License

MIT. Copyright (c) Anton Ignatev.
