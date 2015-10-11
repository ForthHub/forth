# Forth
[![NPM version](https://img.shields.io/npm/v/forth.svg)](https://www.npmjs.org/package/forth) [![Build Status](https://travis-ci.org/drom/forth.svg?branch=master)](https://travis-ci.org/drom/forth) [![Build status](https://ci.appveyor.com/api/projects/status/xw04eu1fa8ng167h?svg=true)](https://ci.appveyor.com/project/drom/forth)

Forth programming environment implemented in JavaScript.

## Use
### Node.js

```
npm i forth --save
```

```js
var forth = require('forth');
var f = forth(); // new instance of Forth machine
```

### Browser
use Browserify!

### APIs
#### f.interpret(input, cb)
Run Forth interpreter.

`input` can be String or Stream

#### f.DS()
Data stack Array

#### f.RS()
Return stack Array

## Testing
`npm test`

## License
MIT [LICENSE](https://github.com/drom/forth/blob/master/LICENSE).
