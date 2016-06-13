const config = require('nconf');
const express = require('express');
const expressValidator = require('express-validator');
const debug = require('debug')('Server');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const postgreSQLConnector = require('../middleware/postgresql-connector');
const helmet = require('helmet');

module.exports = function(app) {
  if (config.get('app:nginx'))
    app.enable('trust proxy');
  app.use(helmet());
  app.set('etag', false);
  app.use(morgan('combined'));
  if (config.get('app:public:enabled'))
      app.use(express.static(config.get('app:public:path')));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({}));
  app.use(expressValidator());
  app.use(postgreSQLConnector());

  debug('Configuration complete');
};
