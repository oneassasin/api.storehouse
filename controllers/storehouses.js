const Promise = require('bluebird');
const squel = require('squel').useFlavour('postgres');
const debug = require('debug')('StorehousesController');

module.exports.getStorehouses = function(req, res, next) {
  'use strict';
  const storehouseId = req.sanitize('storehouseId').toInt();
  const query = squel.select()
    .from('storehouses')
    .toString();
  req.db.many(query)
    .catch(function(error) {
      if (error.code === 0)
        error.status = 404;
      else
        error.status = 400;
      return Promise.reject(error);
    })
    .then(function(storehouses) {
      res.status(200).send(storehouses).end();
    })
    .catch(next);
};

module.exports.createStorehouse = function(req, res, next) {
  'use strict';
  req.assert('name', 'name_required').notEmpty();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      return req.db.tx(function(context) {
        const name = req.sanitize('name').escape();
        const values = {
          name: name
        };
        const query = squel.insert()
          .into('storehouses')
          .setFields(values)
          .returning('*')
          .toString();
        return context.one(query);
      });
    })
    .then(function(data) {
      debug('Storehouse created: ', data);
      res.status(201).send(data).end();
    })
    .catch(next);
};
