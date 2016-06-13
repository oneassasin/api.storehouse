const Promise = require('bluebird');
const squel = require('squel').useFlavour('postgres');
const debug = require('debug')('GoodsController');

module.exports.getGoods = function(req, res, next) {
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
        .from('goods')
        .where('storehouse_id = ?', storehouseId)
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

module.exports.createGood = function(req, res, next) {
  'use strict';
  req.assert('storehouseId', 'storehouseId_required').notEmpty().isInt();
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
          .into('goods')
          .setFields(values)
          .returning('*')
          .toString();
        return context.one(query);
      });
    })
    .catch(function(error) {
      if (error.code === 23505) {
        error.status = 403;
        error.reason = '1';
      }
      return Promise.reject(error);
    })
    .then(function(data) {
      debug('Good created: ', data);
      res.status(201).send(data).end();
    })
    .catch(next);
};