#!/usr/bin/env node

'use strict';

process.env.BABEL_CACHE_PATH = '/tmp/babelCache.json';

require('@babel/register')({
  extensions: ['.js'],
});

module.exports = require('./app');
