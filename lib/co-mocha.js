var co = require('co')
var path = require('path')
var isGenFn = require('is-generator').fn
/**
 * Export `co-mocha`.
 */
module.exports = coMocha

/**
 * Monkey patch the mocha instance with generator support.
 *
 */
function coMocha (mocha) {
  // Avoid loading `co-mocha` twice.
  if (!mocha || mocha._coMochaIsLoaded) {
    return
  }

  var Runnable = mocha.Runnable
  var run = Runnable.prototype.run

  /**
   * Override the Mocha function runner and enable generator support with co.
   *
   * @param {Function} fn
   */
  Runnable.prototype.run = function (fn) {
    var oldFn = this.fn
    this.type || (this.type = 'hook')
    if (isGenFn(oldFn)) {
      this.fn = function (client, done) {
        var p = co.call(this, oldFn.call(this, client))
        if (typeof done === 'function') {
          p.then(function () {
            done()
          }, done)
        }
      }

      // Replace `toString` to output the original function contents.
      this.fn.toString = function () {
        // https://github.com/mochajs/mocha/blob/7493bca76662318183e55294e906a4107433e20e/lib/utils.js#L251
        return Function.prototype.toString.call(oldFn)
          .replace(/^function *\* *\(.*\)\s*{/, 'function () {')
      }
    } else if (oldFn.length < 2) {
      this.fn = function (client, done) {
        var p = oldFn.call(this, client)
        if (typeof done === 'function') {
          if (p && typeof p.then === 'function') {
            p.then(function () {
              done()
            }, done)
          } else {
            done()
          }
        }
      }
    }
    return run.call(this, fn)
  }

  mocha._coMochaIsLoaded = true
}

/**
 * Find active node mocha instances.
 *
 * @return {Array}
 */
function findNodeJSMocha () {
  var suffix = path.sep + path.join('', 'mocha-nightwatch', 'index.js')
  var children = require.cache || {}
  return Object.keys(children)
    .filter(function (child) {
      return child.slice(suffix.length * -1) === suffix
    })
    .map(function (child) {
      return children[child].exports
    })
}

// Attempt to automatically monkey patch available mocha instances.
var modules = typeof window === 'undefined' ? findNodeJSMocha() : [window.Mocha]
modules.forEach(coMocha)
