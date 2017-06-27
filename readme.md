# keyboardevent-from-electron-accelerator

> Transform an Electron Accelerator string into a DOM KeyboardEvent.

This module export a function that take an Electron Accelerator as input
and return a corresponding KeyboardEvent object.

E.g. `'Ctrl+Alt+C' => {code: 'c', ctrlKey: true, altKey: true}`


## Usage

This example convert a string containing an Electron Accelerator to a corresponding KeyboardEvent object. Returned object is the keyevent that would be emitted if that key combination was pressed.

```js
const {toKeyEvent} = require('keyboardevent-from-electron-accelerator');
console.log(toKeyEvent('Shift+Delete'));
```

This will output

```
{key: 'Delete', shiftKey: true}

```

## Context and motivation for this module.

This module is part of an ongoing effort to make [electron-localshortcut](https://github.com/parro-it/electron-localshortcut) less error prone, using keyboard DOM listener instead of 'globalShortcut' method to trigger shortcuts handlers.


[![Travis Build Status](https://img.shields.io/travis/parro-it/keyboardevent-from-electron-accelerator/master.svg)](http://travis-ci.org/parro-it/keyboardevent-from-electron-accelerator)
[![NPM downloads](https://img.shields.io/npm/dt/keyboardevent-from-electron-accelerator.svg)](https://npmjs.org/package/keyboardevent-from-electron-accelerator)


## API

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install keyboardevent-from-electron-accelerator
```

## See Also

- [`noffle/common-readme`](https://github.com/noffle/common-readme)

## License

MIT

