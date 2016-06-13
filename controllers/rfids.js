const Promise = require('bluebird');
const squel = require('squel').useFlavour('postgres');
const debug = require('debug')('RFIDSsController');

module.exports.getMarks = function(req, res, next) {
  'use strict';
  const query = squel.select()
    .from('rfids')
    .order('created_at')
    .toString();
  return req.db.many(query)
    .catch(function(error) {
      if (error.code === 0)
        error.status = 404;
      else
        error.status = 400;
      return Promise.reject(error);
    })
    .then(function(messages) {
      res.status(200).send(messages).end();
    })
    .catch(next);
};

module.exports.createMark = function(req, res, next) {
  'use strict';
  req.assert('value', 'value_required').notEmpty();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      return req.db.tx(function(context) {
        const value = req.sanitize('value').escape();
        const values = {
          value: value
        };
        const query = squel.insert()
          .into('rfids')
          .setFields(values)
          .returning('*')
          .toString();
        return context.one(query);
      });
    })
    .then(function(data) {
      debug('RFID created: ', data);
      res.status(201).send(data).end();
    })
    .catch(next);
};