const Promise = require('bluebird');
const squel = require('squel').useFlavour('postgres');
const debug = require('debug')('MessagesController');

module.exports.getMessages = function(req, res, next) {
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
        'messages.id',
        'messages.created_at',
        'messages.message',
        'users.login'
      ];
      const query = squel.select()
        .fields(fields)
        .from('messages')
        .from('users')
        .limit(countInt)
        .offset(skipInt)
        .where('messages.storehouse_id = ?', storehouseId)
        .where('messages.author_id = users.id')
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

module.exports.createMessage = function(req, res, next) {
  'use strict';
  req.assert('storehouseId', 'storehouseId_required').notEmpty().isInt();
  req.assert('message', 'message_required').notEmpty();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      return req.db.tx(function(context) {
        const storehouseId = req.sanitize('storehouseId').toInt();
        const message = req.sanitize('message').escape();
        const userId = req.session.user_id;
        const values = {
          author_id: userId,
          storehouse_id: storehouseId,
          message: message
        };
        const query = squel.insert()
          .into('messages')
          .setFields(values)
          .returning('*')
          .toString();
        return context.one(query);
      });
    })
    .then(function(data) {
      debug('Message created: ', data);
      res.status(201).send(data).end();
    })
    .catch(next);
};