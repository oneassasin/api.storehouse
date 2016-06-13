const debug = require('debug')('Server');
const error = require('debug')('Error');
const config = require('nconf');
const routerList = require('../libs/router-list');

const user = require('./user');
const messages = require('./messages');
const goods = require('./goods');
const rfids = require('./rfids');
const sectors = require('./sectors');
const racks = require('./racks');
const shelfes = require('./shelfes');
const storehouses = require('./storehouses');
const savedItems = require('./savedItems');

module.exports = function(app) {
  "use strict";

  app.use('/api/', routerList(user));
  app.use('/api/', routerList(messages));
  app.use('/api/', routerList(goods));
  app.use('/api/', routerList(rfids));
  app.use('/api/', routerList(sectors));
  app.use('/api/', routerList(racks));
  app.use('/api/', routerList(shelfes));
  app.use('/api/', routerList(storehouses));
  app.use('/api/', routerList(savedItems));

  if (config.get('app:dev')) {
    debug('Development error handler setup');
    app.use(function(err, req, res, next) {
      error(err);
      next(err);
    });
  }

  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send({errors: err}).end();
  });

};