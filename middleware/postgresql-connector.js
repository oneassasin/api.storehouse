const pg = require('pg-promise');
const config = require('nconf');
const promise = require('bluebird');
const SQL = require('debug')('SQL');

const options = {
  promiseLib: promise,
  pgFormatting: false,
  query: function(e) {
    'use strict';
    SQL(e.query);
  }
};
const db = pg(options);
const dbConfig = {
  host: config.get('db:host'),
  port: config.get('db:port'),
  database: config.get('db:name'),
  user: config.get('db:user'),
  password: config.get('db:password'),
  poolSize: config.get('db:poolSize')
};

module.exports = function() {
  return function(req, res, next) {
    'use strict';
    req.db = db(dbConfig);
    next();
  }
};