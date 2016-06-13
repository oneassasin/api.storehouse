const async = require('async');
const types = require('check-types');
const debug = require('debug')('Server');
const util = require('util');

const routes = [];

function replaceParams(path) {
  'use strict';
  if (!types.string(path))
    return path;
  if (path.indexOf(':') < 0)
    return '^' + path.split('\/').join('\\/') + '$';
  var string = '^';
  const arr = path.split('\/');
  for (var item in arr) {
    if (!arr.hasOwnProperty(item))
      continue;
    var str = arr[item];
    if (str === '' || str.length !== 0)
      string += '\\/';
    if (str.startsWith(':')) {
      str = '\\/[0-9]+';
    }
    string += str;
  }
  string += '$';
  string = string.split('\\/\\/').join('\\/');
  return string;
}

module.exports = function(router) {
  'use strict';
  if (types.object(router.stack))
    return router;
  async.forEach(router.stack, function(stackItem, _callback) {
    const route = stackItem.route;
    const path = replaceParams(route.path.toLowerCase());
    const method = route.stack[0].method.toUpperCase();
    routes.push({
      path: path,
      method: method
    });
    debug(util.format('Method: %s; RegEx: %s', method, path));
    _callback();
  });
  return router;
};