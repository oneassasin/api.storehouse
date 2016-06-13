const Promise = require('bluebird');
const squel = require('squel').useFlavour('postgres');
const debug = require('debug')('RacksController');

module.exports.getRacks = function(req, res, next) {
  'use strict';
  req.assert('sectorId', 'sectorId_required').notEmpty().isInt();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      const sectorId = req.sanitize('sectorId').toInt();
      const query = squel.select()
        .from('sectors_racks')
        .where('sector_id = ?', sectorId)
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

module.exports.createRack = function(req, res, next) {
  'use strict';
  req.assert('sectorId', 'sectorId_required').notEmpty().isInt();
  req.assert('name', 'name_required').notEmpty();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      return req.db.tx(function(context) {
        const sectorId = req.sanitize('sectorId').toInt();
        const name = req.sanitize('name').escape();
        const values = {
          sector_id: sectorId,
          name: name
        };
        const query = squel.insert()
          .into('sectors_racks')
          .setFields(values)
          .returning('*')
          .toString();
        return context.one(query);
      });
    })
    .then(function(data) {
      debug('Rack created: ', data);
      res.status(201).send(data).end();
    })
    .catch(next);
};