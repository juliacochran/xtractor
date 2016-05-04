# xtractor

> Simple string extraction

**xtractor** statically analyzes js files or globs of files and extracts strings within designated function call

## Usage

Import the library
```js
var xtractor = require('xtractor');
```
or
```js
import * as xtractor from 'xtractor';
```

### Extract strings from a file

```js
xtractor.extractFromFile(__dirname + '/source.js', ['_', 'i18n._'], function(err, strings) {
    // use strings
});
```

A promise-based API is also supported

```js
xtractor.extractFromFile(__dirname + '/source.js', ['_', 'i18n._'])
.then(function(err, strings) {
    // use strings
});
```

### Extract strings from a glob

```js
xtractor.extractFromFile(__dirname + '/*.js', ['_', 'i18n._'], function(err, strings) {
    // use strings
});
```

A promise-based API is also supported

```js
xtractor.extractFromFile(__dirname + '/*.js', ['_', 'i18n._'])
.then(function(err, strings) {
    // use strings
});
```