# A fork from [Co Mocha](https://www.npmjs.com/package/co-mocha)

Enable support for generators in Mocha (built in versoin of Nightwatch.js) tests using [co](https://github.com/visionmedia/co).

Use the `--harmony-generators` flag when running node 0.11.x to access generator functions, or transpile your tests using [traceur](https://github.com/google/traceur-compiler) or [regenerator](https://github.com/facebook/regenerator).

## Installation

```
npm install co-mocha-nightwatch --save-dev
```

## Usage

Just require the module in your tests and start writing generators in your tests.

```js
require('co-mocha-nightwatch')
it('should do something', function * (cilent) {
  yield users.load(123)
})
```

DON'T use `require` option of `test_runner` in nightwatch configuratoin file, because this option can only be used in command line of mocha.

### Node

Install the module using `npm install co-mocha-nightwatch --save-dev`. Now just require the module to automatically monkey patch any available `mocha` instances. With `mocha`, add `require('co-mocha')` inside your main test file.

If you need to monkey patch a different mocha instance you can use the library directly:

```js
var mocha = require('mocha-nightwatch')
var coMocha = require('co-mocha-nightwatch')

coMocha(mocha)
```
