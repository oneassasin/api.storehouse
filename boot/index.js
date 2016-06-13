module.exports = function index(app) {
  "use strict";
  require('./server')(app);
  require('./express')(app);
};