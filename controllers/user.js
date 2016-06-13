const Promise = require('bluebird');
const crypto = require('crypto');
const randomString = require('randomstring');
const config = require('nconf');
const squel = require('squel').useFlavour('postgres');
const check = require('check-types');
const debug = require('debug')('UserController');
const moment = require('moment');

function getSHA1Hash(text) {
  'use strict';
  const sha1 = crypto.createHash('sha1');
  return sha1.update(text).digest('hex');
}

module.exports.signIn = function(req, res, next) {
  'use strict';
  req.assert('login', 'login_required').notEmpty();
  req.assert('password', 'password_required').notEmpty();
  req.asyncValidationErrors()
    .catch(function(errors) {
      errors.status = 400;
      return Promise.reject(errors);
    })
    .then(function() {
      const login = req.sanitize('login').escape();
      const query = squel.select()
        .from('users')
        .where('login = ?', login)
        .toString();
      return req.db.one(query);
    })
    .catch(function(error) {
      if (error.code === 0)
        error.status = 404;
      else
        error.status = 400;
      return Promise.reject(error);
    })
    .then(function(user) {
      res.user = user;
      const password = getSHA1Hash(req.sanitize('password').toString());
      if (user.password !== password) {
        const error = new Error('Incorrect password.');
        error.status = 404;
        return Promise.reject(error);
      }
      const query = squel.select()
        .from('sessions')
        .where('user_id = ?', user.id)
        .toString();
      return req.db.oneOrNone(query);
    })
    .then(function(session) {
      if (!check.object(session))
        return Promise.resolve();
      res.session = session;
      const date = moment(session.expired).format();
      const query = squel.select()
        .field('now()::timestamptz < \'' + date + '\'::timestamptz', 'result')
        .toString();
      return req.db.one(query)
        .then(function(data) {
          if (data.result)
            return Promise.resolve();
          delete res.session;
          const query = squel.delete()
            .from('sessions')
            .where('user_id = ?', res.user.id)
            .toString();
          return req.db.none(query);
        });
    })
    .then(function() {
      if (check.object(res.session))
        return Promise.resolve(res.session);
      const randomValue = randomString.generate(10) + new Date().getTime();
      const cookie = getSHA1Hash(randomValue);
      const values = {
        user_id: res.user.id,
        session: cookie
      };
      const expired = 'now() + interval \'' + config.get('session:interval') + ' hours\'';
      const query = squel.insert()
        .into('sessions')
        .setFields(values)
        .set('expired', expired, {
          dontQuote: true
        })
        .returning('*')
        .toString();
      return req.db.one(query);
    })
    .then(function(session) {
      res.cookie(config.get('session:cookieName'), session.session, {}).status(200).end();
    })
    .catch(next);
};

module.exports.signOut = function(req, res, next) {
  'use strict';
  const cookieName = config.get('session:cookieName');
  const query = squel.delete()
    .from('sessions')
    .where('session = ?', req.session.session)
    .toString();
  req.db.none(query)
    .then(function() {
      res.clearCookie(cookieName, {}).status(200).end();
    })
    .catch(next);
};
