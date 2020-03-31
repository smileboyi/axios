'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  // then resolve callback
  var resolvePromise;
  // 定义一个resolve promise，当promise.then()时，将resolve callback赋给resolvePromise
  this.promise = new Promise(function promiseExecutor(resolve) {
    // 返回一个可取消的模板
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    // 传入reason，执行这个模板
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
// 如果有cancel reason，则抛出reason
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    // 这个c就是上面的function cancel(message)
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


// // 取消请求
// axios.get(url, {
//   cancelToken: new axios.CancelToken(cancel => {
//     if (/* 取消条件 */) {
//       cancel('取消日志');
//     }
//   })
// });