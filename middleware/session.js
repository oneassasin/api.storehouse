const Promise = require('bluebird');
const types = require('check-types');
const config = require('nconf');
const squel = require('squel').useFlavour('postgres');

function _escapeSymbols(str) {
  return str.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;');
}

module.exports = function() {
  'use strict';
  return function(req, res, next) {
    const SID = _escapeSymbols(req.cookies[config.get('session:cookieName')]);
    if (types.not.assigned(SID) || types.emptyString(SID)) {
      const error = new Error('Need to authorize.');
      error.status = 401;
      return next(error);
    }
    const query = squel.select()
      .field('*')
      .field('now()::timestamptz > session.expired::timestamptz', 'is_expired')
      .from("(" + squel.select().from('sessions').where('session = ?', SID).toString() + ")", 'session')
      .toString();
    req.db.oneOrNone(query)
      .then(function(session) {
        if (types.not.object(session)) {
          const error = new Error('Need to authorize.');
          error.status = 401;
          return Promise.reject(error);
        }
        if (session.is_expired == true) {
          const query = squel.delete()
            .from('sessions')
            .where('session = ?', SID)
            .toString();
          req.db.none(query);
          const error = new Error('Session is outdated.');
          error.status = 401;
          return Promise.reject(error);
        }
        req.session = session;
        return Promise.resolve();
      })
      .then(next)
      .catch(next);
  };
};