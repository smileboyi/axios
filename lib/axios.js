'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  // 一个axios实例
  var context = new Axios(defaultConfig);
  // 将axios实例作为request的上下文
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  // 将prototype上的公共属性和方法添加到instance对象上
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  // 拦截器，默认配置等添加到instance
  utils.extend(instance, context);

  // 返回新的axios对象，它的原型方法都绑定了context上下文
  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
// axios.js默认导出的axios就可以使用了。通过create返回配置的新axios
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
// 提供取消的状态对象
axios.Cancel = require('./cancel/Cancel');
// 提供取消的辅助方法
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');


/**
 * 
 * function getUserAccount() {
 *  return axios.get('/user/12345');
 * }
 *
 * function getUserPermissions() {
 *   return axios.get('/user/12345/permissions');
 * }
 *
 * // all接受请求Promise的数组
 * axios.all([getUserAccount(), getUserPermissions()])
 *  .then(axios.spread((acct, perms) => {
 *   // 参数为每个请求返回的响应
 * }));
 * 
 */

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;
