const config = require('nconf');
const express = require('express');
const app = express();

config.argv()
  .env()
  .file({file: './config.json'});

// Boot configurations
require('./boot/index')(app);

// Route configurations
require('./routes/index')(app);