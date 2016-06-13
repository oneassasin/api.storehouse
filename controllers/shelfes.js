const Promise = require('bluebird');
const squel = require('squel').useFlavour('postgres');
const debug = require('debug')('ShelfesController');

module.exports.getShelfes = function(req, res, next) {
  'use strict';
  req.assert('rackId', 'rackId_required').notEmpty().isInt();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      const rackId = req.sanitize('rackId').toInt();
      const query = squel.select()
        .from('racks_shelfes')
        .where('rack_id = ?', rackId)
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

module.exports.createShelf = function(req, res, next) {
  'use strict';
  req.assert('rackId', 'rackId_required').notEmpty().isInt();
  req.assert('number', 'number_required').notEmpty();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      return req.db.tx(function(context) {
        const rackId = req.sanitize('rackId').toInt();
        const number = req.sanitize('number').escape();
        const values = {
          rack_id: rackId,
          number: number
        };
        const query = squel.insert()
          .into('racks_shelfes')
          .setFields(values)
          .returning('*')
          .toString();
        return context.one(query);
      });
    })
    .then(function(data) {
      debug('Shelf created: ', data);
      res.status(201).send(data).end();
    })
    .catch(next);
};