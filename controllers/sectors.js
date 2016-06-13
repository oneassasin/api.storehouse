const Promise = require('bluebird');
const squel = require('squel').useFlavour('postgres');
const debug = require('debug')('SectorsController');

module.exports.getSectors = function(req, res, next) {
  'use strict';
  req.assert('storehouseId', 'storehouseId_required').notEmpty().isInt();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      const storehouseId = req.sanitize('storehouseId').toInt();
      const query = squel.select()
        .from('storehouses_sectors')
        .where('storehouse_id = ?', storehouseId)
        .order('created_at')
        .toString();
      return req.db.many(query);
    })
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

module.exports.createSector = function(req, res, next) {
  'use strict';
  req.assert('storehouseId', 'storehouseId_required').notEmpty().isInt();
  req.assert('name', 'name_required').notEmpty();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      return req.db.tx(function(context) {
        const storehouseId = req.sanitize('storehouseId').toInt();
        const name = req.sanitize('name').escape();
        const values = {
          storehouse_id: storehouseId,
          name: name
        };
        const query = squel.insert()
          .into('storehouses_sectors')
          .setFields(values)
          .returning('*')
          .toString();
        return context.one(query);
      });
    })
    .then(function(data) {
      debug('Sector created: ' + data);
      res.status(201).send(data).end();
    })
    .catch(next);
};
