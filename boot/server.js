const http = require('http');
const https = require('https');
const debug = require('debug')('Server');
const config = require('nconf');

module.exports = function(app) {
  if (config.get('app:schema') === 'https') {
    // TODO: Add HTTPS definition.
    throw new Error('Unimplemented');
  }

  http.createServer(app).listen(config.get('app:port'), function () {
    debug('Express server listening on port ' + config.get('app:port'));
  });

  process.on('SIGINT', function () {
    debug('Server is stopped via Ctrl+C.');
    process.exit(0);
  });

};