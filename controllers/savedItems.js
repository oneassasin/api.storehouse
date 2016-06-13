const Promise = require('bluebird');
const squel = require('squel').useFlavour('postgres');
const debug = require('debug')('SavedItemsController');

module.exports.getSavedItems = function(req, res, next) {
  'use strict';
  req.assert('storehouseId', 'storehouseId_required').notEmpty().isInt();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      const storehouseId = req.sanitize('storehouseId').toInt();
      const skipInt = req.sanitize('skip').toInt() || 0;
      var countInt = req.sanitize('count').toInt() || 10;
      if (countInt > 10)
        countInt = 10;
      const fields = [
        'goods_rfids.created_at AS created_at',
        'goods_rfids.shipment_at AS shipment_at',
        'goods_rfids.priority AS shipment_priority',
        'goods.name AS good_name',
        'goods.id AS good_id',
        'rfids.id AS rfid_id',
        'rfids.value AS rfid_value',
        'racks_shelfes.id AS shelf_id',
        'concat(sectors_racks.name, racks_shelfes.number) AS rack_shelf_name',
        'racks_shelfes.number AS shelf_number',
        'sectors_racks.id AS rack_id',
        'sectors_racks.name AS rack_name',
        'storehouses_sectors.id AS sector_id',
        'storehouses_sectors.name AS sector_name'
      ];
      const query = squel.select()
        .fields(fields)
        .from('goods_rfids')
        .from('goods')
        .from('rfids')
        .from('racks_shelfes')
        .from('sectors_racks')
        .from('storehouses_sectors')
        .from('storehouses')
        .where('storehouses.id = ?', storehouseId)
        .where('storehouses_sectors.storehouse_id = storehouses.id')
        .where('sectors_racks.sector_id = storehouses_sectors.id')
        .where('racks_shelfes.rack_id = sectors_racks.id')
        .where('goods_rfids.shelf_id = racks_shelfes.id')
        .limit(countInt)
        .offset(skipInt)
        .order('goods_rfids.priority')
        .order('goods_rfids.created_at')
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

module.exports.createSavedItem = function(req, res, next) {
  'use strict';
  req.assert('storehouseId', 'storehouseId_required').notEmpty().isInt();
  req.assert('rfidId', 'rfidId_required').notEmpty();
  req.assert('goodId', 'goodId_required').notEmpty();
  req.assert('shelfId', 'shelfId_required').notEmpty();
  req.assert('shipmentAt', 'shipmentAt_required').notEmpty();
  req.assert('priority', 'priority_required').notEmpty();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      return req.db.tx(function(context) {
        const storehouseId = req.sanitize('storehouseId').toInt();
        const rfidId = req.sanitize('rfidId').toInt();
        const goodId = req.sanitize('goodId').toInt();
        const shelfId = req.sanitize('shelfId').toInt();
        const shipmentAt = req.sanitize('shipmentAt').toString();
        const priority = req.sanitize('priority').toInt();
        const values = {
          rfid_id: rfidId,
          good_id: goodId,
          shelf_id: shelfId,
          shipment_at: shipmentAt,
          priority: priority
        };
        const query = squel.insert()
          .into('goods_rfids')
          .setFields(values)
          .returning('*')
          .toString();
        return context.one(query);
      });
    })
    .then(function(data) {
      debug('Saved item created: ', data);
      res.status(201).send(data).end();
    })
    .catch(next);
};

module.exports.createSavedItem = function(req, res, next) {
  'use strict';
  req.assert('storehouseId', 'storehouseId_required').notEmpty().isInt();
  req.assert('rfidId', 'rfidId_required').notEmpty();
  req.assert('goodId', 'goodId_required').notEmpty();
  req.assert('shelfId', 'shelfId_required').notEmpty();
  req.assert('shipmentAt', 'shipmentAt_required').notEmpty();
  req.assert('priority', 'priority_required').notEmpty();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      return req.db.tx(function(context) {
        const storehouseId = req.sanitize('storehouseId').toInt();
        const rfidId = req.sanitize('rfidId').toInt();
        const goodId = req.sanitize('goodId').toInt();
        const shelfId = req.sanitize('shelfId').toInt();
        const shipmentAt = req.sanitize('shipmentAt').escape();
        const priority = req.sanitize('priority').toInt();
        const values = {
          rfid_id: rfidId,
          good_id: goodId,
          shelf_id: shelfId,
          shipment_at: shipmentAt,
          priority: priority
        };
        const query = squel.insert()
          .into('goods_rfids')
          .setFields(values)
          .returning('*')
          .toString();
        return context.one(query);
      });
    })
    .then(function(data) {
      debug('Saved item created: ', data);
      res.status(201).send(data).end();
    })
    .catch(next);
};

module.exports.deleteSavedItem = function(req, res, next) {
  'use strict';
  req.assert('rfidId', 'rfidId_required').notEmpty();
  req.assert('itemId', 'itemId_required').notEmpty();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      return req.db.tx(function(context) {
        const rfidId = req.sanitize('rfidId').toInt();
        const itemId = req.sanitize('itemId').toInt();
        const query = squel.delete()
          .from('goods_rfids')
          .where('rfid_id = ?', rfidId)
          .where('good_id = ?', itemId)
          .toString();
        return context.none(query);
      });
    })
    .then(function() {
      res.status(200).send().end();
    })
    .catch(next);
};